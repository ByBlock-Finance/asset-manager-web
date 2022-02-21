export class WalletBalanceItem {
    quote_currency: string;
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    last_transferred_at: string;
    type: string;
    blacklisted: boolean;
    trust_logo: boolean;
    logo_url: string;
    market: {
        marketCapInUsd: number
        dilMarketCapInUsd: number
        priceInUsd: number
        priceInUsd24h: number
    }
    holding: {
        balance: number
        valueInUsd: number
        dca: number
    };
    asset_color: string;
    no_metadata: boolean;
    moralis_data: any;

    constructor({ quote_currency, contract_decimals, contract_name, contract_ticker_symbol, contract_address, last_transferred_at,
        type, balance, quote_rate, quote_rate_24h, quote, quote_24h, blacklisted, logo_url, market, holding, asset_color,no_metadata,trust_logo }) {
        this.quote_currency = quote_currency;
        this.contract_decimals = contract_decimals;
        this.contract_name = contract_name;
        this.contract_ticker_symbol = contract_ticker_symbol;
        this.contract_address = contract_address;
        this.last_transferred_at = last_transferred_at;
        this.type = type;
        this.blacklisted = blacklisted;
        this.logo_url = logo_url;
        this.market = market;
        this.holding = holding;
        this.asset_color = asset_color;
        this.no_metadata = no_metadata;
            this.trust_logo=trust_logo;
    }


}
