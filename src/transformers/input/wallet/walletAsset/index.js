import store from '../../../../store'
// import Web3 from 'web3';
// const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

const TEN_TO_THE_POWER_OF_18 = 1000000000000000000;
const tokenSymbolBSCMap = {
    'BSC-USD': 'USDT'
}
const tokenNameBSCRemovedKeywords = ["Binance-Peg", "BSC-", "Token"]

const TXN_TYPE_INCOMING = "in"
const TXN_TYPE_OUTGOING = "out"

async function transformTransactionEvent(asset, holdingWalletAddres) {

    // const toCode = await web3.eth.getCode(asset.to)

    const transformed = {
        contractAddress: asset.contractAddress,
        tokenName: transformTokenName(asset.tokenName),
        tokenSymbol: transformTokenSymbol(asset.tokenSymbol),
        tokenDecimal: asset.tokenDecimal,
        blockNumber: asset.blockNumber,
        timeStamp: asset.timeStamp,
        hash: asset.hash,
        nonce: asset.nonce,
        blockHash: asset.blockHash,
        from: asset.from,
        to: asset.to,
        value: asset.value,
        realValue: convertFromWeiToReal(asset.value),
        balanceType: getBalanceType(asset, holdingWalletAddres),
        transactionIndex: asset.transactionIndex,
        gas: asset.gas,
        gasPrice: asset.gasPrice,
        gasUsed: asset.gasUsed,
        cumulativeGasUsed: asset.cumulativeGasUsed,
        input: asset.input,
        confirmations: asset.confirmation,
        // isToEOA: toCode == '0x'       // Externally owned address (e.g. wallet)
    };

    return transformed;
}

function transformTokenSymbol(symbol){
    let s = tokenSymbolBSCMap[symbol]
    if(s) return s
    else return symbol
}

function transformTokenName(name) {
    tokenNameBSCRemovedKeywords.forEach(keyword => {
        name = name.replace(keyword, '')
    });
    return name.trim()
}

async function putEventUnderTransactionsIfMatchingContract(results, txnEvent, holdingWalletAddres) {
    let txnEventFoundInResults = false
    results.forEach((result) => {
        if(result.contractAddress === txnEvent.contractAddress){
            result.transactions.push(txnEvent)
            incrementResultValues(result, txnEvent, holdingWalletAddres)
            txnEventFoundInResults = true
            if(result.holding.balance < 0 ) result.holding.balance = 0.00
        }
    });

    if(!txnEventFoundInResults){
        const blacklistedAssets = store.state.accountModule.blacklistedAssets;
        const blacklisted = (blacklistedAssets && blacklistedAssets.includes(txnEvent.contractAddress))

        let result = {
            contractAddress: txnEvent.contractAddress,
            tokenName: txnEvent.tokenName,
            tokenSymbol: txnEvent.tokenSymbol,
            tokenIcon: "https://eu.ui-avatars.com/api/?background=random&name=" + txnEvent.tokenSymbol,
            tokenDecimal: txnEvent.tokenDecimal,
            transactions: [txnEvent],
            holding: {
                balance: 0.0000,
                valueInUsd: 0.00
            },
            totalGasPaidInNative: 0.000000,
            blacklisted: blacklisted 
        }
        
        incrementResultValues(result, txnEvent, holdingWalletAddres)
        results.push(result)
    }
}

function incrementResultValues(result, txnEvent, holdingWalletAddres){
    if(txnEvent.balanceType === "in"){ // incoming
        const holingBalanceBefore = result.holding.balance
        result.holding.balance = holingBalanceBefore + convertFromWeiToReal(txnEvent.value)
        // incoming txn have gas paid by someone else?
    }else if(sentToContract(txnEvent)){ // outgoing
        const holingBalanceBefore = result.holding.balance
        result.holding.balance = holingBalanceBefore - convertFromWeiToReal(txnEvent.value)
        const gasPriceTemp = result.totalGasPaidInNative
        result.totalGasPaidInNative = gasPriceTemp + (txnEvent.gasUsed * txnEvent.gasPrice) 
    }else if(sentToAnotherWallet(txnEvent)){ // outgoing
        // Never reached until sentToContract() function is finiseshed
    }
}

function convertFromWeiToReal(value){
    return value / TEN_TO_THE_POWER_OF_18
}

function getBalanceType(asset, holdingWalletAddres){
    if(asset.to.toLowerCase() === holdingWalletAddres.toLowerCase()) return TXN_TYPE_INCOMING
    else if(asset.from.toLowerCase() === holdingWalletAddres.toLowerCase()) return TXN_TYPE_OUTGOING
}

function sentToContract(txnEvent){
    // TODO: finalize this function
    return true
}
function sentToAnotherWallet(txnEvent){
    // TODO: finalize this function
    return false
}

function tokenAddressShortener(address) {
    let partOne = address.substring(0, 5);
    let partTwo = "...";
    let partThree = address.substring(address.length - 5, address.length);
    return partOne + partTwo + partThree;
}

async function transform(assets, holdingWalletAddres) {
    const results = [];

    for (let i = 0; i < assets.length; i++) {
        const transformed = await transformTransactionEvent(assets[i], holdingWalletAddres);
        if (!transformed) {
            return;
        }

        await putEventUnderTransactionsIfMatchingContract(results, transformed, holdingWalletAddres)
    }

    return results;
}

function getTxnType(txn){
    // TODO: figure out wallet to wallet or contract to wallet transaction logic. Return accordingly
    // Driect, Swap, Yield, etc... 
    return "Drop"
}

function transformSingleTransactionToView(txn, walletAddress){
    let txnDirection = getBalanceType(txn, walletAddress)
    let to, from
    if(txnDirection === TXN_TYPE_INCOMING){
        to = "This wallet"
        from = tokenAddressShortener(txn.from)
    } else if(txnDirection === TXN_TYPE_OUTGOING){
        from = "This wallet"
        to = tokenAddressShortener(txn.from)
    } 

    let gasFee = txn.gasUsed * txn.gasPrice / TEN_TO_THE_POWER_OF_18

    return {
        timestamp: txn.timeStamp,
        to: txn.to,
        from: txn.from,
        fromDisplay: from,
        toDisplay: to,
        quantity: convertFromWeiToReal(txn.value),
        base: txn.tokenSymbol,
        gasFee: gasFee,
        feesTotal: gasFee,
        feeUnit: "BNB",     // TODO: replace with dynamic value
        type: getTxnType(txn),
        moreLink: "https://bscscan.com/tx/" + txn.hash,
        direction: txnDirection,
        isToEOA: txn.isToEOA
    }
}

function transformTransactionsToViewLayer(transactions, walletAddress){
    let totalGasFees = 0.00, totalFeesTotal = 0.00, totalInQty = 0.00, totalOutQty = 0.00
    let transformed = []
    let base

    transactions.forEach((txn) => {
        let tnxTransed = transformSingleTransactionToView(txn, walletAddress)
        transformed.push(tnxTransed);
        totalGasFees+=tnxTransed.gasFee
        totalFeesTotal+=tnxTransed.feesTotal
        if(tnxTransed.direction === TXN_TYPE_INCOMING) totalInQty+=tnxTransed.quantity
        else if(tnxTransed.direction === TXN_TYPE_OUTGOING) totalOutQty+=tnxTransed.quantity
        base = tnxTransed.base
    });

    transformed.push({
        date: "",
        to: "",
        from: "",
        fromDisplay: "",
        toDisplay: "TOTAL IN",
        quantity: totalInQty,
        base: base,
        gasFee: totalGasFees,
        feesTotal: totalFeesTotal,
        feeUnit: "BNB",     // TODO: replace with dynamic value
        type: "total",
        moreLink: "",
        direction: TXN_TYPE_INCOMING
    })

    transformed.push({
        date: "",
        to: "",
        from: "",
        fromDisplay: "",
        toDisplay: "TOTAL OUT",
        quantity: totalOutQty,
        base: base,
        gasFee: totalGasFees,
        feesTotal: totalFeesTotal,
        feeUnit: "BNB",     // TODO: replace with dynamic value
        type: "total",
        moreLink: "",
        direction: TXN_TYPE_OUTGOING
    })

    return transformed
}

export default { transform, transformTransactionsToViewLayer }

// {
//     "blockNumber": "7997047",
//     "timeStamp": "1622791706",
//     "hash": "0x8cf9383baa2266eec6e5d2b1b1aa4f2a58f466c8cb2b704c252d81ed72443de8",
//     "nonce": "1",
//     "blockHash": "0x61f1e915e67eefe57286b4be338629881012c772498b1d690a06b12bb20070e2",
//     "from": "0x0097c72afb28a9d8db9223ecf3c2d91b0176694b",
//     "contractAddress": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
//     "to": "0xec89be665c851ffbae2a8ded03080f3e64116539",
//     "value": "1900000000000000000000",
//     "tokenName": "Binance-Peg Dai Token",
//     "tokenSymbol": "DAI",
//     "tokenDecimal": "18",
//     "transactionIndex": "106",
//     "gas": "279072",
//     "gasPrice": "5000000000",
//     "gasUsed": "171048",
//     "cumulativeGasUsed": "21933442",
//     "input": "deprecated",
//     "confirmations": "4053867"
// }