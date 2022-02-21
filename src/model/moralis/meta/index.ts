export class Meta {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    logo: string;
    logo_hash: string;
    thumbnail: string;
    block_number: string;
    validated: string;

    usdPrice: number;

    constructor() {
        this.usdPrice = -1;
        this.address = "";
        this.name = "";
        this.symbol = "";
        this.decimals = "";
        this.logo = "";
        this.logo_hash = "";
        this.thumbnail = "";
        this.block_number = "";
        this.validated = "";
    
    }


}
