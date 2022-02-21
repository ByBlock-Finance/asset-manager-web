import axios from 'axios';
import config from '@/constants/config';


const NET_IDS= {
    BSC: 56
}

async function getWalletBalance(netId: number, walletAddress: string){
    try {
        const queryParams: any = {
            key: config.covalenthqApiKey
        }
        const { data } : any = await axios.get(`${config.covalenthqApiURL}/${netId}/address/${walletAddress}/balances_v2/`, { params: queryParams });
        if(data.error) throw new Error(data.error_message);

        console.log("getWalletBalance data: ", data)
        
        return data.data;
    } catch (error) {
        console.error("Cove service | getWalletBalance | error: ", error)
        throw new Error("Error inside cove service method getWalletBalance(). See logs.");
    }

}

async function getAssetTransactions(netId: number, walletAddress: string, assetContract: string){
    try {
        const queryParams: any = {
            'key': config.covalenthqApiKey,
            'contract-address': assetContract
        }
        const { data } : any = await axios.get(`${config.covalenthqApiURL}/${netId}/address/${walletAddress}/transfers_v2/`, { params: queryParams });
        if(data.error) throw new Error(data.error_message);

        return data.data.items;
    } catch (error) {
        console.error("Cove service | getAssetTransactions | error: ", error)
        throw new Error("Error inside cove service method getAssetTransactions(). See logs.");
    }

}

export {getWalletBalance, getAssetTransactions, NET_IDS}