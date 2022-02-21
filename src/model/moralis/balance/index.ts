export class Balance {
    token_address: string;
    name:  string;
    symbol:  string;
    logo:  string;
    thumbnail:  string;
    decimals:  string;
    balance:  number;
    
    constructor() {
        this.token_address = "";
        this.name = "";
        this.symbol = "";
        this.logo = "";
        this.thumbnail = "";
        this.decimals = "";
        this.balance = -1;
    }
}