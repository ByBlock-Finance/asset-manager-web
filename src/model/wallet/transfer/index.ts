export class AssetTransferItem {
    contract: {
        address: string
        name: string
        ticker: string
        decimal: number
    }
    asset_contract: string
    block_signed_at: string
    block_height: number
    tx_hash: string
    tx_offset: number
    successful: boolean
    from_address: string
    from_address_label: string
    to_address: string
    to_address_label: string
    amount: number
    quantity: number
    price: number
    value_is_usd: number
    gas: {
        gas_offered: number
        gas_spent: number
        gas_price: number
        gas_in_usd: number
        gas_quote_rate: number
        gas_qty: number
    }
    interim_from: string
    interim_from_label: string
    interim_to: string
    interim_to_label: string
    direction: string
    txn_link: string
    unit: string
    fee_unit: string
    transfer_type: string

    constructor() {
        this.asset_contract = ""
        this.block_signed_at = ""
        this.block_height = -1
        this.tx_hash = ""
        this.tx_offset = -1
        this.successful = false
        this.from_address = ""
        this.from_address_label = ""
        this.to_address = ""
        this.to_address_label = ""
        this.gas = {
            gas_offered: -1,
            gas_spent: -1,
            gas_price: -1,
            gas_in_usd: -1,
            gas_qty: -1,
            gas_quote_rate: -1
        }
        this.contract = {
            address: "",
            name: "",
            ticker: "",
            decimal: -1
        }
        this.value_is_usd = -1
        this.price = -1
        this.quantity = -1
        this.amount = -1
        this.direction = ""
        this.interim_from = ""
        this.interim_to = ""
        this.interim_to_label = ""
        this.interim_from_label = ""
        this.txn_link = ""
        this.unit = ""
        this.fee_unit = ""
        this.transfer_type = ""
    }

}
