/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Commit } from "vuex";
import * as TokenService from '../../services/token';
import * as AccountService from '../../services/account';
import TokenInputTransformer from '../../transformers/input/token';
import { Token } from '../../model/token'
import { Meta } from '../../model/moralis/meta'

interface Tokens {
    tokens: Record<string, Token>;
    tags: Record<string, string[]>;
    transactionNotes: Record<string, string[]>;
    tokenDetails: Record<string, any>;
}


export default {
    namespaced: true,
    state: () => ({
        tokens: {
            '1': {}
        },
        tags: {
            '-1': []
        },
        transactionNotes: {
            '-1': "My txn note"
        },
        tokenDetails: {
            '-1': {}
        },
    }),
    getters: {
        tags: state => state.tags,
        transactionNotes: state => state.transactionNotes,
        tokenDetails: state => state.tokenDetails,
        tokens: state => state.tokens
    },
    mutations: {
        setTokenDetails(state: Tokens, tokenDetails: Record<string, any>){
            state.tokenDetails = tokenDetails
        },
        addToken(state: Tokens, token: Token) {
            state.tokens[token.contractAddress] = token;
        },
        setTxnNotes(state: Tokens, txnNotes: Record<string, string[]>) {
            state.transactionNotes = txnNotes;
            localStorage.setItem('txnNotes', JSON.stringify(state.transactionNotes))
        },
        addTxnNote(state: Tokens, hashAndNote: any) {
            state.transactionNotes[hashAndNote.hash] = hashAndNote.note
            localStorage.setItem('txnNotes', JSON.stringify(state.transactionNotes))
        },
        addTag(state: Tokens, contractAndTag: any) {
            if (!state.tags[contractAndTag.contract]) state.tags[contractAndTag.contract] = [contractAndTag.tag]
            else state.tags[contractAndTag.contract].push(contractAndTag.tag)
            localStorage.setItem('addressTags', JSON.stringify(state.tags))
        },
        removeTag(state: Tokens, contractAndTag: any) {
            let result: string[] = []
            if (state.tags[contractAndTag.contract]) {
                result = state.tags[contractAndTag.contract].filter(e => e !== contractAndTag.tag); // will return ['A', 'C']
            }
            state.tags[contractAndTag.contract] = result
            localStorage.setItem('addressTags', JSON.stringify(state.tags))
        },
        setTags(state: Tokens, tags: Record<string, string[]>) {
            state.tags = tags
            localStorage.setItem('addressTags', JSON.stringify(state.tags))
        }
    },
    actions: {
        fetchTransactionNotes({ commit, state }) {
            const result = localStorage.getItem('txnNotes')
            if (result) commit('setTags', JSON.parse(result))
        },
        fetchAddressTags({ commit, state }) {
            const result = localStorage.getItem('addressTags')
            if (result) commit('setTags', JSON.parse(result))
        },
        async getTokenMeta({commit, state}, {symbol, contract, refresh}){
            console.log("getTokenMeta | args: ", {symbol, contract, refresh})
            if(refresh || !state.tokens[contract]){
                console.log("inside if")
                const price = await TokenService.getTokenPrice(contract)
                const token = await TokenService.getTokenMetadata({contract, symbol})
                if(price.usdPrice > 0) token.priceInUsd = price.usdPrice;
                commit("addToken", token)
                console.log("getTokenMeta | token:", token)
                return token
            }
            else {
                console.log("else")
                return state.tokens[contract]

            }
        },
        async getTokenMetadataMany({ commit, state }, requests: any[]) {
            // TODO: store result in store for each token
            try {
                const result:Token[] = []
                // get from token service
                const tokenMetaMany = await TokenService.getTokenMetaDataMany(requests);
                console.log("getTokenMetadataMany | tokenMetaMany: ", tokenMetaMany)
                /* @ts-ignore */
                tokenMetaMany.forEach(token => {
                    result.push(TokenInputTransformer.transform(token));
                });
                return result
            } catch (err) {
                return []
            }
        },
    },
}
