export class WalletData {
    publicAddress: string;
    netId: string;
    type: string;
    message: string;
    name: string;
    voidApiAccess: boolean

    constructor({ publicAddress, netId, type, message, voidApiAccess, name }) {
        this.publicAddress = publicAddress;
        this.netId = netId;
        this.type = type;
        this.message = message;
        this.voidApiAccess = voidApiAccess;
        this.name = name;
    }

} 
