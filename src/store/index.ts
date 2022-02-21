import { createStore } from 'vuex'
import WalletModule from './wallet'
import TokenModule from './token'
import AccountModule from './account'
import { Commit } from "vuex";

const initialMessages: any[] = []

export default createStore({
  state: {
    test: "test",
    messages: initialMessages
  },
  getters: {
    messages: state => state.messages
  },
  mutations: {
    addMessage(state, message) {
      state.messages.push(message);
    },
  },
  actions: {
    addMessage({ commit }: { commit: Commit }, message) {
      commit('addMessage', message);
    },
  },
  modules: {
    walletModule: WalletModule,
    tokenModule: TokenModule,
    accountModule: AccountModule
  }
})
