import { Token } from '../../../model/token'

function transform(token: any) {
    let dilutedMcap = token.circulatingSupply * token.rate
    if (token.maxSupply) dilutedMcap = token.maxSupply * token.rate

    const transformed: Token = {
        contractAddress: token.contractAddress,
        symbol: token.symbol,
        decimal: token.decimal,
        name: token.name,
        icon: token.png64,
        color: token.color,
        mcap: token.cap,
        dmcap: dilutedMcap,
        priceInUsd: token.rate,
        volume: token.volume,
        maxSupply: token.maxSupply,
        circulatingSupply: token.circulatingSupply,
        allTimeHighUsd: token.allTimeHighUSD,
        pairs: token.pairs,
        nrOfExchanges: token.exchanges,
        nrOfMarkets: token.markets
    };

    return transformed;
}

function moralisTokenMetadataToToken(data: any) {

    const transformed: Token = {
        contractAddress: data.address,
        symbol: data.symbol,
        decimal: data.decimals,
        name: data.name,
        icon: data.logo,
        color: "",
        mcap: -1,
        dmcap: -1,
        priceInUsd: -1,
        volume: -1,
        maxSupply: -1,
        circulatingSupply: -1,
        allTimeHighUsd: -1,
        pairs: -1,
        nrOfExchanges: -1,
        nrOfMarkets: -1
    };

    return transformed;
}

export default { transform, moralisTokenMetadataToToken }