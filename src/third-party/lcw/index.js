import axios from 'axios';
import config from '@/constants/config';
const TOKEN_META_ENDPOINT = 'coins/single';


async function getTokenMetaData(tokenSymbol) {
    
    const body = {
        currency: "USD",
        code: tokenSymbol,
        meta: true
    }

    const headers = {
        'x-api-key': config.liveCoinWatchApiKey,
        'Content-Type': 'application/json'
    }

    const response = await axios.post(`${config.liveCoinWatchApiURL}/${TOKEN_META_ENDPOINT}`, body, {
        headers: headers
      });

    return response.data;
}

export {getTokenMetaData}