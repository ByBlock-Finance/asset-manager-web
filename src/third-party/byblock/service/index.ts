import axios from 'axios';
import config from '@/constants/config';


const NET_IDS= {
    BSC: "bsc"
}
async function checkServerHealth() {
    try {
        const { data } : any = await axios.get(`${config.byblocApiUrl}/health/`);
        return data
    } catch (error) {
        console.error("ByBlock service | checkServerHealth | error: ", error)
        throw new Error("Error inside ByBlock service method checkServerHealth(). See logs.");
    }

}
async function getWalletBalance(netId: string, walletAddress: string){
    try {
        const queryParams: any = {
            key: config.byblocApiKey
        }
        const { data } : any = await axios.get(`${config.byblocApiUrl}/${netId}/wallet/${walletAddress}/balance/`, { params: queryParams });
        if(data.error) throw new Error(data.error_message);

        console.log("BBSerivce | getWalletBalance() data: ", data)
        
        return data;
    } catch (error) {
        console.error("ByBlock service | getWalletBalance | error: ", error)
        throw new Error("Error inside ByBlock service method getWalletBalance(). See logs.");
    }

}

async function getAssetTransactions(netId: string, walletAddress: string, assetContract: string){
    try {
        const queryParams: any = {
            'key': config.byblocApiKey,
            'asset': assetContract
        }
        const { data } : any = await axios.get(`${config.byblocApiUrl}/${netId}/wallet/${walletAddress}/transfers/`, { params: queryParams });
        if(data.error) throw new Error(data.error_message);

        return data;
    } catch (error) {
        console.error("ByBlock service | getAssetTransactions | error: ", error)
        throw new Error("Error inside ByBlock service method getAssetTransactions(). See logs.");
    }
}

async function getApiAccessData(walletAddress: string){
    console.log("getApiAccessData | process.env.VUE_APP_BYBLOCK_API_URL:", process.env.VUE_APP_BYBLOCK_API_URL)
    console.log("getApiAccessData | config.byblocApiUrl:", config.byblocApiKey)
    try {
        const queryParams: any = {
            'key': config.byblocApiKey
        }
        const { data } : any = await axios.get(`${config.byblocApiUrl}/account/key/${walletAddress}`, { params: queryParams });
        console.log("getApiAccessData | data:", data)
        if(data.error) throw new Error(data.error_message);

        return data;
    } catch (error) {
        console.error("ByBlock service | getApiAccessData | error: ", error)
        throw new Error("Error inside ByBlock service method getApiAccessData(). See logs.");
    }
}

export {getWalletBalance, getAssetTransactions, getApiAccessData, checkServerHealth, NET_IDS}