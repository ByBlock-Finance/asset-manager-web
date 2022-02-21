export class WalletAsset {
    contractAddress: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    tokenIcon: string;
    tokenColor: string;
    market: {
        marketCapInUsd: number;
        dilMarketCapInUsd: number;
        priceInUsd: number
    };
    holding: {
        balance: number;
        valueInUsd: number;
        dca: number
    };
    transactions: [];
    noMetadataFound: boolean;
    blacklisted: boolean;
    
    constructor({contractAddress, tokenName, tokenSymbol, tokenDecimal, tokenIcon, tokenColor, market, holding, transactions, noMetadataFound, blacklisted}) {
        this.contractAddress= contractAddress ;
        this.tokenName= tokenName ;
        this.tokenSymbol= tokenSymbol ;
        this.tokenDecimal= tokenDecimal ;
        this.tokenIcon= tokenIcon ;
        this.tokenColor= tokenColor ;
        this.market= market;
        this.holding= holding ;
        this.transactions= transactions ;
        this.noMetadataFound= noMetadataFound ;
        this.blacklisted = blacklisted
    }

} 
