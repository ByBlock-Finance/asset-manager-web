import axios from 'axios';
import config from '@/constants/config';
import * as lcw from '../../third-party/lcw';
import TokenInputTransformer from '../../transformers/input/token';
import { Token } from '../../model/token'
import Moralis from 'moralis';
let SELECTED_CHAIN;

function init(chain: string) {
    SELECTED_CHAIN = chain
}


async function getTokenMetaDataMany(request) {
    const response = await axios.post(`${config.byblocApiUrl}/bsc/token/meta?key=${config.byblocApiKey}`, request);
    // const response = await axios.post(`localhost:9090/bsc/tokens/meta?key=${config.byblocApiKey}`, request);
    return response.data;
}

/**
 * Do not use Moralis.token.getTokenMetadata is it doesn't return actual useful information.
 * @param param0 
 * @returns 
 */
async function getTokenMetadata({ contract, symbol }): Promise<Token> {
    try {
        // const c = contract.trim().toLowerCase()

        console.log(contract)
        const s = symbol.trim().toUpperCase()
        console.log( s )

        const meta:any = await lcw.getTokenMetaData(s)
        console.log("meta: ", meta)
        meta.contractAddress = contract
        meta.symbol = symbol
        const transformed:Token = TokenInputTransformer.transform(meta);
        return transformed;
    } catch (error) {
        console.error("service / token | getTokenMetadata > error:", error)
        return Promise.reject(error);
    }
}

async function getTokenAllowance(walletAddress: string, contractAddress: string) {
    if (!SELECTED_CHAIN) throw "initialize service first by calling init() function and setting chain id (e.g 'bsc')"

    try {
        const options: any = {
            chain: SELECTED_CHAIN,
            owner_address: walletAddress,
            spender_address: walletAddress,
            address: contractAddress
        };
        return await Moralis.Web3API.token.getTokenAllowance(options);

    } catch (error) {
        console.error("service / token | getTokenAllowance > error:", error)
        return {}

    }
}

async function getTokenPrice(contractAddress: string) {
    if (!SELECTED_CHAIN) throw "initialize service first by calling init() function and setting chain id (e.g 'bsc')"

    try {
        const options: any = {
            address: contractAddress,
            chain: SELECTED_CHAIN,
            exchange: "PancakeSwapv2"
        };
        const price = await Moralis.Web3API.token.getTokenPrice(options);
        console.log("price : ", price )
        return price 
    } catch (error) {
        //@ts-ignore
        console.error("service / token | getTokenPrice > error:", JSON.stringify(error.error))
        return { usdPrice: -1 }
    }
}

async function getTokenBalances(walletAddress: string) {
    if (!SELECTED_CHAIN) throw "initialize service first by calling init() function and setting chain id (e.g 'bsc')"
    let balances: any = []
    try {
        balances = await Moralis.Web3API.account.getTokenBalances({ chain: SELECTED_CHAIN, address: walletAddress });
        return balances
    } catch (error) {
        console.error("service / token | getTokenBalances > error:", error)
        throw "cannot get balances, check logs"
    }
}

// Returns token metadata, allowance, price, etc
async function getTokenDetails(walletAddress, contractAddress, symbol) {
    // TODO: store details in Store, and retrieve them from store.
    if (!SELECTED_CHAIN) throw "initialize service first by calling init() function and setting chain id (e.g 'bsc')"



    const meta = getTokenMetadata({ contract: contractAddress, symbol: symbol })
    const allowance = getTokenAllowance(walletAddress, contractAddress)
    const price = getTokenPrice(contractAddress)

    return Promise.all([meta, allowance, price]).then((values) => {
        return {
            meta: values[0],
            allowance: values[1],
            price: values[2],
        }
    });

}


export { init, getTokenMetaDataMany, getTokenBalances, getTokenDetails, getTokenPrice, getTokenMetadata }
