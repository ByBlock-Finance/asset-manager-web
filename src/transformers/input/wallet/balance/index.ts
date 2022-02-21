
import { WalletBalanceItem } from '@/model/wallet/balance'
import { AssetTransferItem } from '@/model/wallet/transfer'
import store from '@/store'

import Web3 from 'web3';
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

const WEI_TO_REAL_MULTIPLIER = 0.000000000000000001
const DIRECTION_IN = "IN"
const TRANSFER_TYPE_WALLET = "wallet"
const TRANSFER_TYPE_CONTRACT = "contract"
const DIRECTION_OUT = "OUT"
function tokenAddressShortener(address) {
    const partOne = address.substring(0, 5);
    const partTwo = "...";
    const partThree = address.substring(address.length - 5, address.length);
    return partOne + partTwo + partThree;
}

function transform(balanceRaw) {
    /* @ts-ignore */
    const blacklistedAssets = store.state.accountModule.blacklistedAssets;
    const blacklisted = (blacklistedAssets && blacklistedAssets.includes(balanceRaw.contract_address))

    const balance: WalletBalanceItem = {
        quote_currency: balanceRaw.quote_currency,
        contract_decimals: balanceRaw.contract_decimals,
        contract_name: balanceRaw.contract_name,
        contract_ticker_symbol: balanceRaw.contract_ticker_symbol,
        contract_address: balanceRaw.contract_address,
        last_transferred_at: balanceRaw.last_transferred_at,
        type: balanceRaw.type,
        blacklisted: blacklisted,
        logo_url: balanceRaw.logo_url,
        trust_logo: false,
        market: {
            marketCapInUsd: -1,
            dilMarketCapInUsd: -1,
            priceInUsd: balanceRaw.quote_rate,
            priceInUsd24h: balanceRaw.quote_rate_24h
        },
        holding: {
            balance: balanceRaw.balance / 10 ** balanceRaw.contract_decimals,
            valueInUsd: balanceRaw.quote,
            dca: -1
        },
        asset_color: "",
        no_metadata: false,
        moralis_data: {}
    }
    return balance
}

async function transformAssetTransferItem(assetTransferRaw, walletAddress, assetContractAddress){
    const amount = Number(assetTransferRaw.transfers[0].delta)
    let from_label = ""
    let to_label = ""

    if (assetTransferRaw.transfers[0].from_address.toLowerCase() === walletAddress.toLowerCase()) from_label = "This wallet"
    else from_label = tokenAddressShortener(assetTransferRaw.transfers[0].from_address)

    if (assetTransferRaw.transfers[0].to_address.toLowerCase() === walletAddress.toLowerCase()) to_label = "This wallet"
    else to_label = tokenAddressShortener(assetTransferRaw.transfers[0].to_address)

    let code = ""
    let transferType = ""
    if(assetTransferRaw.transfers[0].transfer_type === DIRECTION_IN) code = await web3.eth.getCode(assetTransferRaw.transfers[0].from_address)
    else code = await web3.eth.getCode(assetTransferRaw.transfers[0].to_address)
    
    if(code == '0x') transferType = TRANSFER_TYPE_WALLET // EOA = Externally owned address (e.g. wallet)
    else transferType = TRANSFER_TYPE_CONTRACT

    const price = assetTransferRaw.transfers[0].quote_rate || "No data"

    const assetTransfer: AssetTransferItem = {
        asset_contract: assetContractAddress,
        interim_from: assetTransferRaw.from_address,
        interim_to: assetTransferRaw.to_address,
        interim_from_label: tokenAddressShortener(assetTransferRaw.from_address),
        interim_to_label: tokenAddressShortener(assetTransferRaw.to_address),
        successful: assetTransferRaw.successful,
        tx_hash: assetTransferRaw.tx_hash,
        tx_offset: assetTransferRaw.tx_offset,
        block_height: assetTransferRaw.block_height,
        block_signed_at: assetTransferRaw.block_signed_at,
        amount: amount,
        quantity: amount / 10 ** assetTransferRaw.transfers[0].contract_decimals,
        value_is_usd: assetTransferRaw.transfers[0].delta_quote,
        price: price,
        gas: {
            gas_offered: assetTransferRaw.gas_offered,
            gas_spent: assetTransferRaw.gas_spent,
            gas_qty: assetTransferRaw.gas_spent * 0.000000001,
            gas_price: assetTransferRaw.gas_price,
            gas_in_usd: assetTransferRaw.gas_quote,
            gas_quote_rate: assetTransferRaw.gas_quote_rate
        },
        from_address: assetTransferRaw.transfers[0].from_address,
        from_address_label: from_label,
        to_address: assetTransferRaw.transfers[0].to_address,
        to_address_label: to_label,
        contract: {
            address: assetTransferRaw.transfers[0].contract_address,
            name: assetTransferRaw.transfers[0].contract_name,
            ticker: assetTransferRaw.transfers[0].contract_ticker_symbol,
            decimal: assetTransferRaw.transfers[0].contract_decimals
        },
        direction: assetTransferRaw.transfers[0].transfer_type,
        txn_link: "https://bscscan.com/tx/" + assetTransferRaw.tx_hash,
        unit: assetTransferRaw.transfers[0].contract_ticker_symbol,
        transfer_type: transferType,
        fee_unit: "BNB" //TODO: make this depend on the network id
    }

    return assetTransfer
}

async function transformAssetTransfers(assetTransferItemsRaw, walletAddress, assetContractAddress) {

    const transfers: AssetTransferItem[] = []

    for (let i = 0; i < assetTransferItemsRaw.length; i++) {
        transfers.push(await transformAssetTransferItem(assetTransferItemsRaw[i], walletAddress, assetContractAddress))
    }
    return transfers
}

export default { transform, transformAssetTransfers, transformAssetTransferItem }
