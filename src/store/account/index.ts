/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Commit } from "vuex";
import {WalletData} from '../../model/wallet/walletData'
import { reactive } from 'vue';

interface Account {
    storedWallets: WalletData[];
    uid: string;
    blacklistedAssets: string[];
    whitelistedAssets: string[];
    favoriteAssets: Record<string, string[]>; // walletAddress, contractAddress[]
    walletNames: Record<string, string>;
    nrOfAutoBlackListedAssets: number;
}

export default {
    namespaced: true,
    state: () => ({
        storedWallets: [],
        uid: '',
        blacklistedAssets: [],
        whitelistedAssets: [],
        favoriteAssets: {},
        walletNames: {},
        nrOfAutoBlackListedAssets: 0,
    }),
    getters: {
        storedWallets: state => state.storedWallets,
        uid: state => state.uid,
        blacklistedAssets: state => state.blacklistedAssets,
        whitelistedAssets: state => state.whitelistedAssets,
        favoriteAssets: state => state.favoriteAssets,
        walletNames: state => state.walletNames,
        nrOfAutoBlackListedAssets: state => state.nrOfAutoBlackListedAssets
    },
    mutations: {
        setNrOfAutoBlackListedAssets(state: Account, nrOf: number){
            state.nrOfAutoBlackListedAssets = nrOf;
        },
        incrementNrOfAutoBlacklistedAssets(state: Account){
            state.nrOfAutoBlackListedAssets
        },
        setStoredWallets(state: Account, storedWallets: WalletData[]){
            state.storedWallets = storedWallets;
        },
        setNewStoredWallet(state: Account, walletData: WalletData) {
            let walletAlreadyStored = false
            state.storedWallets.forEach(wallet => {
                if(wallet.publicAddress == walletData.publicAddress) walletAlreadyStored = true
            });

            if(!walletAlreadyStored)state.storedWallets.push(reactive(walletData))
            localStorage.setItem('storedWallets', JSON.stringify(state.storedWallets))

        },
        removeStoredWallet(state: Account, walletAddress: string) {
            if (!walletAddress) return;
            const result :WalletData[] = []
            state.storedWallets.forEach(wallet => {
                if(wallet.publicAddress && wallet.publicAddress.toLowerCase() != walletAddress.toLowerCase()) result.push(wallet) 
            });
            console.log(result)
            state.storedWallets = result            
            localStorage.setItem('storedWallets', JSON.stringify(result))
        },
        setUid(state: Account, uid: string) {
            state.uid = uid;
        },
        setBlacklist(state: Account, list: Array<string>){
            state.blacklistedAssets = list
        },
        addBlacklistedAsset(state: Account, contractAddress: string) {
            state.blacklistedAssets.push(contractAddress)

            // TODO: move to service and backend
            const blacklist = localStorage.getItem('blacklist')
            if(blacklist){
                const bl = JSON.parse(blacklist)
                bl.push(contractAddress)
                localStorage.setItem('blacklist', JSON.stringify(bl))
            } else{
                localStorage.setItem('blacklist', JSON.stringify([contractAddress]))
            }
        },
        removeBlacklistedAsset(state: Account, contractAddress: string) {
            const index = state.blacklistedAssets.indexOf(contractAddress);
            if (index > -1) state.blacklistedAssets.splice(index, 1);

            // TODO: move to service and backend
            const blacklist = localStorage.getItem('blacklist')
            if(blacklist){
                const bl = JSON.parse(blacklist)
                const index = bl.indexOf(contractAddress);
                if (index > -1) bl.splice(index, 1);
                localStorage.setItem('blacklist', JSON.stringify(bl))
            }
        },
        setWhitelist(state: Account, list: Array<string>){
            state.whitelistedAssets = list
        },
        addWhitelistedAsset(state: Account, contractAddress: string) {
            state.whitelistedAssets.push(contractAddress)
            // TODO: move to service and backend
            const whitelist = localStorage.getItem('whitelist')
            if(whitelist){
                const wl = JSON.parse(whitelist)
                wl.push(contractAddress)
                localStorage.setItem('whitelist', JSON.stringify(wl))
            } else{
                localStorage.setItem('whitelist', JSON.stringify([contractAddress]))
            }
        },
        removeWhitelistedAsset(state: Account, contractAddress: string) {
            const index = state.whitelistedAssets.indexOf(contractAddress);
            if (index > -1) state.whitelistedAssets.splice(index, 1);

            // TODO: move to service and backend
            const whitelist = localStorage.getItem('whitelist')
            if(whitelist){
                const wl = JSON.parse(whitelist)
                const index = wl.indexOf(contractAddress);
                if (index > -1) wl.splice(index, 1);
                localStorage.setItem('whitelist', JSON.stringify(wl))
            }
        },
        setWalletName(state: Account, walletAddressAndName: Record<string, string>) {
            state.walletNames[walletAddressAndName.address] = walletAddressAndName.name
        },
        setFavoriteAssets(state: Account, assets: Record<string, string[]>){
            state.favoriteAssets = assets;
        },
        setWalletNames(state: Account, walletNames: Record<string, string>){
            state.walletNames = walletNames;
        },

    },
    actions: {
        addStoredWallet({ commit, dispatch }, walletData: WalletData) {
            // commit('addStoredWallet', walletData);
            dispatch("storeWallet", walletData)
            if(walletData.name) dispatch("nameWallet", {address: walletData.publicAddress, name: walletData.name})
        },
        storeWallet({ commit }: { commit: Commit }, walletData: WalletData){
            commit('setNewStoredWallet', walletData);
        },
        removeStoredWallet({ commit }: { commit: Commit },walletAddress: string) {
            console.log("store removeStoredWallet", walletAddress)
            commit('removeStoredWallet', walletAddress);
        },
        fetchStoredWallets({ commit }: { commit: Commit }) {
            // TODO: connect with servie and move to backend storage
            const storedWallets = localStorage.getItem('storedWallets')
            if(storedWallets) commit('setStoredWallets', JSON.parse(storedWallets));
        },
        fetchBlacklistedAssets({ commit }: { commit: Commit }) {
            // TODO: connect with servie and move to backend storage
            const blacklist = localStorage.getItem('blacklist')
            if(blacklist) commit('setBlacklist', JSON.parse(blacklist));
        },
        fetchWhitelistedAssets({ commit }: { commit: Commit }) {
            // TODO: connect with servie and move to backend storage
            const whitelist = localStorage.getItem('whitelist')
            if(whitelist) commit('setWhitelist', JSON.parse(whitelist));
        },
        fetchFavoriteAssets({ commit }: { commit: Commit }) {
            // TODO: connect with servie and move to backend storage
            const favoriteAssets = localStorage.getItem('favoriteAssets')
            if(favoriteAssets) commit('setHiddenAssets', JSON.parse(favoriteAssets));
        },
        fetchWalletNames({ commit }: { commit: Commit }) {
            // TODO: connect with servie and move to backend storage
            const walletNames = localStorage.getItem('walletNames')
            if(walletNames) commit('setWalletNames', JSON.parse(walletNames));
        },
        favoriteAsset({ commit }: { commit: Commit }, walletAndContractAddress: Record<string, string>){
            try {
                // TODO: move to service and backend
                const favorites = localStorage.getItem('favorites')
                if(favorites){
                    const fav = JSON.parse(favorites)
                    if(!fav[walletAndContractAddress.wallet])fav[walletAndContractAddress.wallet] = [walletAndContractAddress.contract]
                    else fav[walletAndContractAddress.wallet].push(walletAndContractAddress.contract)
                    localStorage.setItem('favorites', JSON.stringify(fav))
                } else{
                    const nfav = {}
                    nfav[walletAndContractAddress.wallet] = [walletAndContractAddress.contract]
                    localStorage.setItem('favorites', JSON.stringify(nfav))
                }
                console.log("asset has been favorited")
            } catch (err) {
                console.error("Error inside account.store.actions.favoriteAsset. Error: ", err)
            }
        },
        blacklistAsset({ commit }: { commit: Commit }, contractAddress: string) {
            try {
                commit('removeWhitelistedAsset', contractAddress);
                commit('addBlacklistedAsset', contractAddress);
            } catch (err) {
                console.error("Error inside account.store.actions.blacklistAsset. Error: ", err)
            }
        },
        whitelistAsset({ commit }: { commit: Commit }, contractAddress: string) {
            try {
                commit('removeBlacklistedAsset', contractAddress);
                commit('addWhitelistedAsset', contractAddress);
            } catch (err) {
                console.error("Error inside account.store.actions.whitelistAsset. Error: ", err)
            }
        },
        nameWallet({ commit }: { commit: Commit }, walletAddressAndName: Record<string, string>) {
            try {
                commit('setWalletName', walletAddressAndName);

                // TODO: move to service and backend
                const walletNames = localStorage.getItem('walletNames')
                if(walletNames){
                    const wns = JSON.parse(walletNames)
                    wns[walletAddressAndName.address] = walletAddressAndName.name
                    localStorage.setItem('walletNames', JSON.stringify(wns))
                } else{
                    const wns = {}
                    wns[walletAddressAndName.address] = walletAddressAndName.name
                    localStorage.setItem('walletNames', JSON.stringify(wns))
                }
            } catch (err) {
                console.error("Error inside account.store.actions.whitelistAsset. Error: ", err)
            }
        },
        setUid({ commit }: { commit: Commit }, uid: string) {
            try {
                commit('setUid', uid);
            } catch (err) {
                console.error("Error inside account.store.actions.setUid. Error: ", err)
            }
        }
    },
}
