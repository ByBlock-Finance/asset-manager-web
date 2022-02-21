/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Commit } from "vuex";
import * as WalletService from '../../services/wallet';
import { WalletData } from '../../model/wallet/walletData'
import { AssetTransferItem } from '@/model/wallet/transfer';
import WalletBalanceInputTransformer from '@/transformers/input/wallet/balance';
import store from '../../store'
import { WalletBalanceItem } from "@/model/wallet/balance";
import { Balance } from "@/model/moralis/balance";
import * as AccountService from "../../services/account";
import * as TokenService from "../../services/token";

interface Wallet {
    netId: string;
    type: string;
    publicAddress: string;
    connectionMessageLog: string;
    balanceItems: WalletBalanceItem[];
    assetTransferItems: AssetTransferItem[];
    loadingTxnEvents: boolean;
    loadingTransferItems: boolean;
    loadingMoralisData: boolean;
    loadingPortfolio: boolean;
    balanceItemSummary: Record<string, any>;
    apiAccessData: any;
    balances: Balance[] //TODO: move balances to Account module

}

export default {
    namespaced: true,
    state: () => ({
        netId: '',
        type: '',
        publicAddress: '',
        connectionMessageLog: '',
        balanceItems: [],
        assetTransferItems: [],
        loadingTxnEvents: false,
        loadingTransferItems: false,
        loadingMoralisData: false,
        loadingPortfolio: false,
        balanceItemSummary: {},
        apiAccessData: {},
        balances: []

    }),
    getters: {
        apiAccessData: state => state.apiAccessData,
        publicAddress: state => state.publicAddress,
        balanceItems: state => state.balanceItems,
        assetTransferItems: state => state.assetTransferItems,
        loadingTxnEvents: state => state.loadingTxnEvents,
        loadingTransferItems: state => state.loadingTransferItems,
        loadingMoralisData: state => state.loadingMoralisData,
        loadingPortfolio: state => state.loadingPortfolio,
        balanceItemSummary: state => state.balanceItemSummary,
        balances: state => state.balances
    },
    mutations: {
        setBalances(state: Wallet, balances: Balance[]) {
            state.balances = balances;
        },
        addToBalances(state: Wallet, balances: Balance[]) {

            // TODO: combine same assets into 1
            const balancesUpdated: Balance[] = []
            if (!state.balances) state.balances = []

            for (let i = 0; i < balances.length; i++) {
                const newBalance = balances[i];
                let matchedIndex
                let matchedBalance
                state.balances.forEach(balance => {
                    if (balance.token_address === newBalance.token_address) {
                        matchedIndex = i
                        matchedBalance = balance
                    }
                });
                if (matchedIndex >= 0) {
                    const b: Balance = {
                        token_address: matchedBalance.token_address,
                        name: matchedBalance.name,
                        symbol: matchedBalance.symbol,
                        logo: matchedBalance.logo,
                        thumbnail: matchedBalance.thumbnail,
                        decimals: matchedBalance.decimals,
                        balance: Number(matchedBalance.balance) + Number(balances[i].balance)
                    }
                    balancesUpdated.push(b)
                } else {
                    balancesUpdated.push(newBalance)
                }
            }

            state.balances = balancesUpdated
        },
        emptyBalanceItemSummaries(state: Wallet) {
            state.balanceItemSummary = {}
        },
        setBalanceItemSummary(state: Wallet, balanceItemSummary: any) {
            state.balanceItemSummary[balanceItemSummary.contractAddress] = balanceItemSummary
        },
        setAssetTransferItems(state: Wallet, assetTransferItems: AssetTransferItem[]) {
            state.assetTransferItems = assetTransferItems;
        },
        addAssetTransferItems(state: Wallet, assetTransferItems: AssetTransferItem[]) {
            const newArray = state.assetTransferItems.concat(assetTransferItems);
            state.assetTransferItems = newArray;
        },
        addAssetTransferItem(state: Wallet, assetTransferItem: AssetTransferItem) {
            state.assetTransferItems.push(assetTransferItem)
        },
        replaceBalanceItem(state: Wallet, balanceItem: WalletBalanceItem) {
            const result: any = [];
            state.balanceItems.forEach((existingAsset) => {
                const targetAsset = balanceItem.contract_address === existingAsset.contract_address ? balanceItem : existingAsset;
                result.push(targetAsset);
            });
            state.balanceItems = result;
        },
        setBalanceItems(state: Wallet, balanceItems: WalletBalanceItem[]) {
            if (!balanceItems) state.balanceItems = [];  //sanitize
            else state.balanceItems = balanceItems;
        },
        setAssetAsArchived(state: Wallet, contractAndArchived: any) {
            state.balanceItems.forEach((balanceItem) => {
                if (balanceItem.contract_address == contractAndArchived.contract) balanceItem.blacklisted = contractAndArchived.archived
            });
        },
        setNetId(state: Wallet, netId: string) {
            state.netId = netId;
        },
        setType(state: Wallet, type: string) {
            state.type = type;
        },
        setPublicAddress(state: Wallet, publicAddress: string) {
            state.publicAddress = publicAddress;
        },
        setConnectionMessageLog(state: Wallet, connectionMessageLog: string) {
            state.connectionMessageLog = connectionMessageLog;
        },
        setLoadingState(state: Wallet, loadingStatus: boolean) {
            state.loadingTxnEvents = loadingStatus
        },
        setLoadingTranferItemsState(state: Wallet, loadingStatus: boolean) {
            state.loadingTransferItems = loadingStatus
        },
        setLoadingMoralisData(state: Wallet, loadingStatus: boolean) {
            state.loadingMoralisData = loadingStatus
        },
        setLoadingPortfolio(state: Wallet, loadingStatus: boolean) {
            state.loadingPortfolio = loadingStatus
        },
        updateAsset(state: Wallet, newAsset: WalletBalanceItem) {
            const result: any = [];
            state.balanceItems.forEach((existingAsset) => {
                const targetAsset = newAsset.contract_address === existingAsset.contract_address ? newAsset : existingAsset;
                result.push(targetAsset);
            });
            state.balanceItems = result;
        },
        setApiAccessData(state: Wallet, apiAccessData: any) {
            state.apiAccessData = apiAccessData
        }
    },
    actions: {
        disconnectWallet({ commit }: { commit: Commit }) {
            try {
                commit('setNetId', '');
                commit('setType', '');
                commit('setPublicAddress', '');
                commit('setBalanceItems', []);
                commit('emptyBalanceItemSummaries', []);
                commit('setAssetTransferItems', []);
                commit('setConnectionMessageLog', '');
            } catch (err) {
                console.error("Error inside wallet.store.actions.disconnectWallet. Error: ", err)
            }
        },
        async getWalletPortfolio({ commit }: { commit: Commit }, { walletAddresses, netId }) {
            commit('setLoadingPortfolio', true);

            TokenService.init(netId)
            console.log("getWalletPortfolio > walletAddresses:", walletAddresses)
            for (let i = 0; i < walletAddresses.length; i++) {
                const address = walletAddresses[i];
                const balances: Balance[] = await TokenService.getTokenBalances(address)
                commit('addToBalances', balances);

                for (let i = 0; i < balances.length; i++) {
                    const balance = balances[i];
                    store.dispatch("tokenModule/getTokenMeta", { symbol: balance.symbol, contract: balance.token_address });
                    //@ts-ignore
                    setTimeout(() => {
                        console.log("timeout")
                    }, 200);  // tokenModule/getTokenMeta cannot handle so many multiple requests, artifical break
                }

            }
            commit('setLoadingPortfolio', false);

        },
        async connectWallet({ commit }: { commit: Commit }, walletData: WalletData) {
            try {
                TokenService.init("bsc")

                // TODO: Export and refactor this monolithic function to sub-parts
                if (walletData) {
                    console.log("1")
                    commit('setNetId', walletData.netId);
                    commit('setType', walletData.type);
                    commit('setPublicAddress', walletData.publicAddress);
                    commit('setConnectionMessageLog', walletData.message);

                    store.dispatch("accountModule/addStoredWallet", walletData);
                    console.log("2")

                    if (!walletData.voidApiAccess) {
                        const accessData = await AccountService.getApiAccessData(walletData.publicAddress)
                        if (accessData) commit('setApiAccessData', accessData)
                    }
                    console.log("3")

                    const walletAssetsRequest = {
                        page: 1,
                        offset: 500,
                        filteredContract: "",
                        address: walletData.publicAddress,
                    };
                    console.log("4")

                    commit('setLoadingState', true);
                    commit('setLoadingTranferItemsState', true);
                    const walletBalanceItems: WalletBalanceItem[] = await WalletService.getWalletBalanceItems(walletAssetsRequest.address);
                    commit('setBalanceItems', walletBalanceItems);
                    commit('setLoadingState', false);

                    WalletService.addMetadataToBalanceItems(walletData.publicAddress, walletBalanceItems)
                    console.log("5")

                    for (let i = 0; i < walletBalanceItems.length; i++) {
                        const balanceItem = walletBalanceItems[i];

                        const assetTransferItemsRaw: AssetTransferItem[] = await WalletService.getAssetTransferItems(walletAssetsRequest.address, balanceItem)

                        const balanceItemSummary = {
                            totalIn: 0,
                            totalOut: 0,
                            totalGas: 0,
                            contractAddress: balanceItem.contract_address,
                            contractTransfers: {
                                contractAddress: {
                                    contractAddress: "",
                                    totalIntoContract: 0,
                                    totalOutFromContract: 0,
                                    totalLeftInContract: 0,
                                    nrOfTransfersOutFromContract: 0,
                                    totalPriceWhenOutFromContract: 0,
                                    dca: 0
                                }
                            }
                        }
                        console.log("6")

                        for (let i = 0; i < assetTransferItemsRaw.length; i++) {
                            const assetTransferItem: AssetTransferItem = await WalletBalanceInputTransformer.transformAssetTransferItem(assetTransferItemsRaw[i], walletAssetsRequest.address, balanceItem.contract_address)
                            commit("addAssetTransferItem", assetTransferItem)

                            // Increment summary values
                            if (assetTransferItem.direction == "IN") balanceItemSummary.totalIn += assetTransferItem.quantity;
                            else if (assetTransferItem.direction == "OUT") balanceItemSummary.totalOut += assetTransferItem.quantity;
                            balanceItemSummary.totalGas += assetTransferItem.gas.gas_qty;

                            if (assetTransferItem.transfer_type == "contract" && assetTransferItem.direction == "OUT") {
                                if (balanceItemSummary.contractTransfers[assetTransferItem.to_address]) {
                                    balanceItemSummary.contractTransfers[assetTransferItem.to_address].totalIntoContract += assetTransferItem.quantity;
                                    balanceItemSummary.contractTransfers[assetTransferItem.to_address].totalLeftInContract += assetTransferItem.quantity;
                                } else {
                                    balanceItemSummary.contractTransfers[assetTransferItem.to_address] = {
                                        totalIntoContract: assetTransferItem.quantity,
                                        totalOutFromContract: 0,
                                        totalLeftInContract: assetTransferItem.quantity,
                                        nrOfTransfersOutFromContract: 0,
                                        totalPriceWhenOutFromContract: 0,
                                        dca: 0,
                                        contractAddress: assetTransferItem.to_address
                                    }
                                }
                            }
                            else if (assetTransferItem.transfer_type == "contract" && assetTransferItem.direction == "IN") {
                                let price = 0
                                if (!isNaN(assetTransferItem.price)) price = assetTransferItem.price
                                if (balanceItemSummary.contractTransfers[assetTransferItem.from_address]) {
                                    balanceItemSummary.contractTransfers[assetTransferItem.from_address].totalLeftInContract -= assetTransferItem.quantity;
                                    balanceItemSummary.contractTransfers[assetTransferItem.from_address].totalOutFromContract += assetTransferItem.quantity;
                                    balanceItemSummary.contractTransfers[assetTransferItem.from_address].totalPriceWhenOutFromContract += price;
                                    balanceItemSummary.contractTransfers[assetTransferItem.from_address].nrOfTransfersOutFromContract += 1;
                                } else {
                                    balanceItemSummary.contractTransfers[assetTransferItem.from_address] = {
                                        totalIntoContract: 0,
                                        totalOutFromContract: assetTransferItem.quantity,
                                        totalLeftInContract: -assetTransferItem.quantity,
                                        nrOfTransfersOutFromContract: 1,
                                        totalPriceWhenOutFromContract: price,
                                        dca: 0,
                                        contractAddress: assetTransferItem.from_address
                                    }
                                }
                            }
                        }

                        console.log("7")

                        for (const [key, value] of Object.entries(balanceItemSummary.contractTransfers)) {
                            if (balanceItemSummary.contractTransfers[key].nrOfTransfersOutFromContract > 0) {
                                balanceItemSummary.contractTransfers[key].dca = value.totalPriceWhenOutFromContract / value.nrOfTransfersOutFromContract
                            }
                        }

                        commit("setBalanceItemSummary", balanceItemSummary)
                        commit('setLoadingTranferItemsState', false);

                        console.log("8")


                    }
                } else {
                    // start connection here
                    console.log("Starting wallet connection from store action")
                }
            } catch (err) {
                console.error("Error inside wallet.store.actions.connectWallet. Error: ", err)
            }
        },
        /*
        * Gets wallet balance
        * Gets wallet transactions
        * Composes balance item summary
        */
        // async getWalletAssets({ commit }: { commit: Commit }, walletAssetsRequest: WalletAssetsRequest) {
        //     try {


        //     } catch (error) {
        //         console.error("Store | wallet | getWalletAssets | error: ", error)
        //     } finally {
        //         commit('setLoadingState', false);
        //     }
        // },
        setNetId({ commit }: { commit: Commit }, netId: string) {
            commit('setNetId', netId);
        },
        setType({ commit }: { commit: Commit }, type: string) {
            commit('setType', type);
        },
        setPublicAddress({ commit }: { commit: Commit }, publicAddress: string) {
            commit('setPublicAddress', publicAddress);
        },
        setConnectionMessageLog({ commit }: { commit: Commit }, connectionMessageLog: string) {
            commit('setConnectionMessageLog', connectionMessageLog);
        },
        archiveAsset({ commit }: { commit: Commit }, contractAddress: string) {
            commit('setAssetAsArchived', { contract: contractAddress, archived: true });
            store.dispatch("accountModule/blacklistAsset", contractAddress);
        },
        unarchiveAsset({ commit }: { commit: Commit }, contractAddress: string) {
            commit('setAssetAsArchived', { contract: contractAddress, archived: false });
            store.dispatch("accountModule/whitelistAsset", contractAddress);
        }
    },
}
