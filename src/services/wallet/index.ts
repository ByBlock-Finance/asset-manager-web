import { Token } from '@/model/token';
import * as BBService from '@/third-party/byblock/service'
import WalletBalanceInputTransformer from '@/transformers/input/wallet/balance';
import { WalletBalanceItem } from '../../model/wallet/balance'
import store from '../../store'
import * as AccountService from "../../services/account";
import * as TokenService from "../../services/token";

const ORDER_TYPES = {
    TXN_TIME: "TXN_TIME",
    NAME: "NAME",
    BALANCE: "BALANCE",
    VALUE: "VALUE",
    PRICE: "PRICE",
    QTY: "QTY",
    MCAP: "MCAP",
    DMCAP: "DMCAP",
}


async function getWalletBalanceItems(walletAddress: string) {
    const walletBalanceRaw = await BBService.getWalletBalance(BBService.NET_IDS.BSC, walletAddress)

    const balanceItems: WalletBalanceItem[] = []
    walletBalanceRaw.items.forEach(balanceItemRaw => {
        const balanceItem: WalletBalanceItem = WalletBalanceInputTransformer.transform(balanceItemRaw)
        balanceItems.push(balanceItem)
    });
    return balanceItems
}

async function getAssetTransferItems(walletAddress: string, balanceItem: WalletBalanceItem) {
    try {
        const assetTransfersRaw = await BBService.getAssetTransactions(BBService.NET_IDS.BSC, walletAddress, balanceItem.contract_address)
        return assetTransfersRaw;
    } catch (err) {
        console.error("WalletService | getAssetTransferItems | error: ", err)
        return []
    }
}

async function addMetadataToBalanceItems(walletAddress: string, walletBalanceItems: WalletBalanceItem[]) {
    store.commit("walletModule/setLoadingMoralisData", true)
    const requestItems: any = []
    // @ts-ignore
    const whitelist = store.state.accountModule.whitelistedAssets;
    // @ts-ignore
    const blacklist = store.state.accountModule.blacklistedAssets;

    // add moralis metadata
    for (let i = 0; i < walletBalanceItems.length; i++) {
        const item = walletBalanceItems[i];
        const isWhitelisted = whitelist.includes(item.contract_address) // has been whitelisted already
        const isBlacklisted = blacklist.includes(item.contract_address) // has been blacklisted already
        
        if(!isBlacklisted){
            //get morialis data
            const morData = await TokenService.getTokenDetails(walletAddress, item.contract_address, item.contract_ticker_symbol)
            item.moralis_data = morData
            // @ts-ignore
            if(morData.meta && morData.meta.logo){
                // @ts-ignore
                item.logo_url = morData.meta.logo 
                item.trust_logo = true
            }

            if(!item.blacklisted) requestItems.push(createTokenMetaRequest(item))
            if(!isWhitelisted && (!item.moralis_data.price || item.moralis_data.price.usdPrice == -1)) autoBlacklistAsset(item.contract_address)

            store.commit("walletModule/replaceBalanceItem", item)
        }
    }
    store.commit("walletModule/setLoadingMoralisData", false)
  
    // add market metadata
    // TODO: merge above metadata requests tokenModule/getTokenMetadataMany.
    const eachTokenMetadata = await store.dispatch("tokenModule/getTokenMetadataMany", requestItems);
    walletBalanceItems.forEach(item => {
        eachTokenMetadata.forEach(token => {
            if (token.contractAddress === item.contract_address) addMetaTo(item, token)
        });
        store.commit("walletModule/replaceBalanceItem", item)
    });
}

function autoBlacklistAsset(contract){
    store.dispatch("walletModule/archiveAsset", contract)
    store.commit("accountModule/incrementNrOfAutoBlacklistedAssets")
    console.log("Autoblacklisting asset")
}


async function addMetadataToBalanceItem(walletBalanceItem: WalletBalanceItem) {
    const tokenMeta = await store.dispatch("tokenModule/getTokenMeta", {symbol: walletBalanceItem.contract_ticker_symbol, contract: walletBalanceItem.contract_address})
    addMetaTo(walletBalanceItem, tokenMeta)
    store.commit("walletModule/replaceBalanceItem", walletBalanceItem)
}
function addMetaTo(walletBalanceItem: WalletBalanceItem, tokenMeta: Token) {
    if (tokenMeta && tokenMeta.name) {
        if (!walletBalanceItem.trust_logo) walletBalanceItem.logo_url = "https://eu.ui-avatars.com/api/?background=random&name=" + tokenMeta.symbol
        else walletBalanceItem.logo_url = tokenMeta.icon
        walletBalanceItem.asset_color = tokenMeta.color
        if (tokenMeta.mcap) walletBalanceItem.market.marketCapInUsd = tokenMeta.mcap
        if (tokenMeta.dmcap) walletBalanceItem.market.dilMarketCapInUsd = tokenMeta.dmcap
    } else {
        walletBalanceItem.no_metadata = true //potential hazardous token (e.g. dust).
        if (!walletBalanceItem.trust_logo) walletBalanceItem.logo_url = "https://eu.ui-avatars.com/api/?background=random&name=" + tokenMeta.symbol
    }
}
function createTokenMetaRequest(walletBalanceItem: WalletBalanceItem) {
    return {
        address: walletBalanceItem.contract_address,
        symbol: walletBalanceItem.contract_ticker_symbol,
        decimal: walletBalanceItem.contract_decimals
    }
}

function orderBalancesBasedOn(balances, orderType, archived, showZero){
    console.log("orderBalancesBasedOn | balances: ", balances)
    if (orderType == ORDER_TYPES.QTY) {
        return balances.filter(balance => balanceMatch({ balance: balance, input: "", archived: archived, showZero:showZero })).sort( compareBalanceQTY );
    }else if(orderType == ORDER_TYPES.PRICE){
        console.log("orderBalancesBasedOn | price")
        return balances.filter(balance => balanceMatch({ balance: balance, input: "", archived: archived, showZero:showZero })).sort( compareBalancePrice );
    }else if(orderType == ORDER_TYPES.VALUE){
        return balances.filter(balance => balanceMatch({ balance: balance, input: "", archived: archived, showZero:showZero })).sort( compareBalanceValue );
    }else return balances
}

function filterBalancesBasedOn(balances, orderType, input, archived, showZero){
    return balances
}

function orderAssetsBasedOn(assets, orderType, archived, showZero) {
    if (orderType == ORDER_TYPES.TXN_TIME) {
        return assets.filter(asset => assetMatch({ asset: asset, input: "", archived: archived, showZero:showZero })).sort( compareLatestTxnTime );
    }else if(orderType == ORDER_TYPES.BALANCE){
        return assets.filter(asset => assetMatch({ asset: asset, input: "", archived: archived, showZero:showZero })).sort( compareValue );
    }
}

function filterAssetsBasedOn(assets, orderType, input, archived, showZero) {
    if (orderType == ORDER_TYPES.TXN_TIME) {
        return assets.filter(asset => assetMatch({ asset: asset, input: input, archived: archived, showZero:showZero })).sort( compareLatestTxnTime );
    }else if(orderType == ORDER_TYPES.BALANCE){
        return assets.filter(asset => assetMatch({ asset: asset, input: input, archived: archived, showZero:showZero })).sort( compareValue );
    }
}

function compareBalanceQTY(a, b) {
    //last_transferred_at
    if (a.balance < b.balance) {
        return 1;
    }
    if (a.balance > b.balance) {
        return -1;
    }
    return 0;
}
function compareBalancePrice(a, b) {
    const aToken = store.getters.tokenModule.tokens[a.token_address]
    const bToken = store.getters.tokenModule.tokens[b.token_address]

    console.log("aToken: ", aToken)
    console.log("bToken: ", bToken)

    if(aToken && bToken){
        if (aToken.priceInUsd < bToken.priceInUsd) {
            return 1;
        }
        if (aToken.priceInUsd > bToken.priceInUsd) {
            return -1;
        }
    }
    return 0;
}

function compareBalanceValue(a, b) {
    //last_transferred_at
    if (a.balance < b.balance) {
        return 1;
    }
    if (a.balance > b.balance) {
        return -1;
    }
    return 0;
}

function compareLatestTxnTime(a, b) {
    //last_transferred_at
    if (a.last_transferred_at < b.last_transferred_at) {
        return 1;
    }
    if (a.last_transferred_at > b.last_transferred_at) {
        return -1;
    }
    return 0;
}
function compareBalance(a, b) {
    //balance
    if (a.holding.balance < b.holding.balance) {
        return 1;
    }
    if (a.holding.balance > b.holding.balance) {
        return -1;
    }
    return 0;
}
function compareValue(a, b) {
    //valueInUsd
    if (a.holding.valueInUsd < b.holding.valueInUsd) {
        return 1;
    }
    if (a.holding.valueInUsd > b.holding.valueInUsd) {
        return -1;
    }
    return 0;
}

function balanceMatch({ balance, input, archived, showZero }) {
    let res = true
    if (!showZero && balance.balance <= 0) return false
    if (input) {
        const searchTerm = input.toLowerCase()
        let itemText = ""

        itemText += safeObjectRead(balance, 'name')
        itemText += safeObjectRead(balance, 'symbol')
        itemText += safeObjectRead(balance, 'token_address')
        res = itemText.toLowerCase().indexOf(searchTerm) !== -1
    }
    return res
}

function assetMatch({ asset, input, archived, showZero }) {
    let res = true
    if (asset.blacklisted != archived) return false
    if (!showZero && asset.holding.balance <= 0) return false
    if (input) {
        const searchTerm = input.toLowerCase()
        let itemText = ""

        itemText += safeObjectRead(asset, 'contract_name')
        itemText += safeObjectRead(asset, 'contract_ticker_symbol')
        itemText += safeObjectRead(asset, 'contract_address')
        res = itemText.toLowerCase().indexOf(searchTerm) !== -1
    }

    return res
}

const safeObjectRead = (object, path = '') =>
    path.split('.')
        .reduce((o, x) => o == undefined ? o : o[x]
            , object)



export { getAssetTransferItems, getWalletBalanceItems, filterAssetsBasedOn, orderAssetsBasedOn, addMetadataToBalanceItem, addMetadataToBalanceItems, orderBalancesBasedOn, filterBalancesBasedOn, ORDER_TYPES }