<template>
  <base-layout>
    <div class="home">
      <div class="byb-flex-space-between">
        <div class="view-body-container">
          <h1 class="mr-3">{{ connectedWalletName }}</h1>
          <Button
            v-if="connectedWalletName"
            class="
              p-button
              p-component
              p-button-icon-only
              p-button-rounded
              p-button-text
            "
            icon="pi pi-pencil"
            @click="toggleWalletNamingDialog(true)"
          ></Button>
        </div>
        <div class="byb-flex-end">
          <SplitButton
            v-if="connectedWalletAddress"
            :label="addressShortener(connectedWalletAddress)"
            :model="mainButtonOptions"
          ></SplitButton>

          <Button
            v-else
            class="p-button-raised p-button"
            label="Connect"
            :disabled="disableConnectButton"
            @click="connectWallet()"
          />
        </div>
      </div>
      <div
        class="wallet-total-container mt-5 ml-5"
        v-if="connectedWalletAddress"
      >
        <div class="total-dollar">
          <div
            class="total-title"
            v-tooltip="'Total value is only accounted for non-arhived assets'"
          >
            <span>Total value <i class="pi pi-info-circle ml-2"></i></span>
          </div>
          <ProgressSpinner v-if="loadingTxnEvents" style="max-width: 10px" />
          <div v-else class="total-value">
            {{ maskDollarValue(totalActiveValue) }}
          </div>
        </div>
        <div class="total-native">
          <div class="total-title" v-tooltip="'This is the native chain asset'">
            <span>BNB Balance <i class="pi pi-info-circle ml-2"></i></span>
          </div>
          <ProgressSpinner v-if="loadingTxnEvents" style="max-width: 10px" />
          <div v-else class="total-value">
            {{ maskNumberCommaSeparator(nativeAssetBalance) }}
          </div>
        </div>
      </div>
      <div class="assets-header mt-10">
        <div>
          <div class="flex-justify-start">
            <div>
              <div class="assets-title">
                <h2 class="mb-2">Assets</h2>
                <div v-if="loadingTxnEvents" class="loading-container ml-6">
                  <ProgressSpinner style="max-width: 30px" />
                  <span class="ml-2">Fetching assets</span>
                </div>
                <div
                  v-else-if="loadingMoralisData"
                  class="loading-container ml-6"
                >
                  <ProgressSpinner style="max-width: 30px" />
                  <span v-tooltip="'We are attempting to auto-archive assets which are not relvent or may be dangerous. See archived.'" class="ml-2">Analyzing assets</span> 
                </div>
              </div>
              <h3 v-if="!showArchived">
                Showing <b>{{nrOfActiveAssets}}</b> assets and all their transactions.
              </h3>

              <div
                v-else
                class="archived-assets-text"
                v-tooltip="
                  'These assest are considered hazardous (e.g. dust) and not taken into account in the balance'
                "
              >
                <h3>Showing <b>archived</b> assets.</h3>
                <i class="pi pi-info-circle"></i>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            class="search-bar mb-3"
            :class="{ invisible: !connectedWalletAddress }"
          >
            <div class="sort-bar" v-if="connectedWalletAddress">
              <!-- <Button
              class="p-button-link"
              label="Favorites"
              :disabled="!showFavorites"
              @click="showFavorites()"
            /> -->
              <Button
                v-if="!showZero"
                class="p-button-text p-button-plain p-button-sm"
                label="Show 0 balances"
                @click="showZeroBalances(true)"
              />
              <Button
                v-else
                class="p-button-text p-button-plain p-button-sm"
                label="Hide 0 balances"
                @click="showZeroBalances(false)"
              />
              <Button
                v-if="sortBy == this.orderTypes.BALANCE"
                class="p-button-text p-button-plain p-button-sm"
                label="Sort by date"
                @click="setSortBy('date')"
              />
              <Button
                v-else
                class="p-button-text p-button-plain p-button-sm"
                label="Sort by relevance"
                @click="setSortBy('relevance')"
              />
            </div>
            <div>
              <span class="p-input-icon-right">
                <InputText
                  class="search-input"
                  type="text"
                  v-model="searchValue"
                  placeholder="Search"
                />
                <i class="pi pi-search" />
              </span>
            </div>
            <div class="filter-bar">
              <Button
                class="p-button-text p-button-sm"
                label="Active"
                :disabled="!showArchived"
                @click="showActiveAssets()"
              />
              <Button
                class="p-button-text p-button-sm"
                label="Archived"
                :badge="autoArchivedAssets" badgeClass="p-badge-danger"
                :disabled="showArchived"
                @click="showArchivedAssets()"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- <pre>{{walletBalanceItems}}</pre> -->

      <template
        v-for="walletBalanceItem in walletBalanceItems"
        :key="walletBalanceItem.contract_address"
      >
        <!-- TODO:  -->
        <WalletAsset
          :contractAddress="walletBalanceItem.contract_address"
          :tokenName="walletBalanceItem.contract_name"
          :tokenSymbol="walletBalanceItem.contract_ticker_symbol"
          :tokenIcon="walletBalanceItem.logo_url"
          :tokenDecimal="walletBalanceItem.contract_decimals"
          :holding="walletBalanceItem.holding"
          :market="walletBalanceItem.market"
          :walletAddress="connectedWalletAddress"
          :blacklisted="walletBalanceItem.blacklisted"
          :lastTransferAt="walletBalanceItem.last_transferred_at"
          :assetColor="walletBalanceItem.asset_color"
          :moralis="walletBalanceItem.moralis"
        />
      </template>
      <div v-if="!connectedWalletAddress" class="no-assets-container mt-10">
        Connect wallet to see transactions or manually add a wallet address.
        <div>
          <InputText type="text" v-model="walletAddressManualEntry" placeholder="Wallet address" />
          <Dropdown v-model="netIdManualEntry" :options="availableNetIds" optionLabel="name" optionValue="netId" placeholder="Select a chain" />
          <Button
            :disabled="!walletAddressManualEntry"
            label="Search"
            class="p-button-text"
            @click="connectWalletManually()"
          />
        </div>
      </div>
      <div
        v-else-if="!loadingTxnEvents && walletBalanceItems.length == 0"
        class="no-assets-container mt-10"
      >
        No assets found
      </div>
      <div v-else-if="loadingTxnEvents" class="no-assets-container mt-10">
        Fetching transactions from blockchain, may take a moment
        <ProgressBar mode="indeterminate"></ProgressBar>
      </div>

      <Dialog
        header="Name your wallet"
        v-model:visible="walletNameDialog"
        position="top"
      >
        <p>Use names to better navigate between your wallets</p>
        <InputText
          type="text"
          v-model="walletNameInput"
          placeholder="New wallet name"
        />

        <template #footer>
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="walletNameDialog = false"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            autofocus
            @click="saveWalletName()"
          />
        </template>
      </Dialog>

      <Dialog
        header="While you wait..."
        v-model:visible="tutorialDialog"
        :modal="true"
      >
        <p>
          If you notice assets you don't recognice and are not seeing in your
          Metamaks, then this is because in Metamaks, you can only see assets
          you have manually imported while in here, we show you all the assets
          your wallet holds.
        </p>
        <br />
        <p>
          Be careful with some of these as they might be dangerous to sell (read
          about
          <a
            href="https://academy.binance.com/en/articles/what-is-a-dusting-attack"
            taget="_blank"
            >Dust Attacks</a
          >)
        </p>
        <p>
          We have made the best effort to auto archive assets we deemed
          irrelevant, but make sure you review your active as well as archived
          assets. You only have to do this once.
        </p>
        <br />
        <p>
          You can archive or unachive asset using the red or green button on the
          right side of an asset respectivaly.
        </p>

        <template #footer>
          <Button
            label="Dismiss"
            icon="pi pi-times"
            class="p-button-text"
            @click="tutorialDialog = false"
          />
        </template>
      </Dialog>

      <!-- <Message
        class="bottom-message"
        v-for="msg of messages"
        :severity="msg.severity"
        :key="msg.content"
        :life="msg.life"
        :sticky="msg.sticky"
        >{{ msg.content }}</Message
      > -->
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue";
import WalletAsset from "@/components/dashboard/WalletAsset.vue";
// import Message from "primevue/message";
import * as WalletService from "@/services/wallet";
import * as UtilService from "@/utils/presentation";
import { mapState } from "vuex";
const BSC_CHAIN_MM_ID = "0x38";
const ETH_CHAIN_MM_ID = "0x1";
const NATIVE_CHAIN_TOKEN_CONTRACT =
  "0xb8c77482e45f1f44de1745f52c74426c631bdd52";
export default {
  name: "Home",
  components: {
    BaseLayout,
    WalletAsset,
  },
  data() {
    return {
      netIdManualEntry: "bsc",
      walletAddressManualEntry: "",
      availableNetIds: [{name: 'Binance Smart Chain', netId: 'bsc'}],
      showZero: false,
      sortBy: WalletService.ORDER_TYPES.TXN_TIME,
      selectedChainId: BSC_CHAIN_MM_ID,
      tutorialDialog: false,
      msg: "This is demo net work",
      currentPage: 1,
      searchValue: "",
      showArchived: false,
      showFavorites: false,
      walletNameDialog: false,
      walletNameInput: "",
      wallets: [],
      mainButtonOptions: [
        {
          label: "Disconnect",
          icon: "pi pi-power-off",
          command: () => {
            this.disconnectWallet();
          },
        },
        {
          label: "Add wallet",
          icon: "pi pi-plus",
          command: () => {
            this.connectWallet();
          },
        },
        {
          separator: true,
        },
      ],
    };
  },
  computed: {
    ...mapState("walletModule", { walletAssets: "assets" }),
    orderTypes() {
      return WalletService.ORDER_TYPES;
    },
    totalActiveValue() {
      let total = 0;
      this.$store.state.walletModule.balanceItems.forEach((item) => {
        if (!item.blacklisted) total += item.holding.valueInUsd;
      });

      return total;
    },
    nativeAssetBalance() {
      let total = 0;
      this.$store.state.walletModule.balanceItems.forEach((item) => {
        if (
          !item.blacklisted &&
          item.contract_address === NATIVE_CHAIN_TOKEN_CONTRACT
        )
          total += item.holding.balance;
      });
      return total;
    },
    messages() {
      return this.$store.state.messages;
    },
    storedWallets() {
      return this.$store.state.accountModule.storedWallets;
    },
    connectedWalletName() {
      let res = "";
      if (this.$store.state.accountModule.walletNames)
        res =
          this.$store.state.accountModule.walletNames[
            this.connectedWalletAddress
          ];
      if (!res) res = this.addressShortener(this.connectedWalletAddress);
      return res;
    },
    connectedWalletAddress() {
      return this.$store.state.walletModule.publicAddress;
    },
    nrOfActiveAssets(){
      return this.walletBalanceItems.length
    },
    walletBalanceItems() {
      // return this.$store.state.walletModule.balanceItems; last_transferred_at
      if (!this.searchValue) {
        return WalletService.orderAssetsBasedOn(
          this.$store.state.walletModule.balanceItems,
          this.sortBy,
          this.showArchived,
          this.showZero
        );
      } else {
        return WalletService.filterAssetsBasedOn(
          this.$store.state.walletModule.balanceItems,
          this.sortBy,
          this.searchValue,
          this.showArchived,
          this.showZero
        );
      }
    },
    autoArchivedAssets(){
      return this.$store.state.accountModule.nrOfAutoBlackListedAssets;
    },
    loadingTxnEvents() {
      return this.$store.state.walletModule.loadingTxnEvents;
    },
    loadingMoralisData() {
      return this.$store.state.walletModule.loadingMoralisData;
    },
  },
  created() {
    console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)
    console.log("process.env.VUE_APP_BYBLOCK_API_URL: ", process.env.VUE_APP_BYBLOCK_API_URL)
    if (typeof window.ethereum === "undefined") {
      this.$store.dispatch("addMessage", {
        severity: "warn",
        content: "To use this application, install Metamask extention",
        sticky: true,
      });
    }
    // else if(){

    // }

    this.walletNameInput = this.connectedWalletName;
    this.$store.dispatch("accountModule/fetchBlacklistedAssets");
    this.$store.dispatch("accountModule/fetchWhitelistedAssets");
    this.$store.dispatch("accountModule/fetchFavoriteAssets");
    this.$store.dispatch("accountModule/fetchWalletNames");
    this.$store.dispatch("accountModule/fetchStoredWallets");
    this.$store.dispatch("tokenModule/fetchAddressTags");
    this.$store.dispatch("tokenModule/fetchTransactionNotes");

    let array3 = this.mainButtonOptions.concat(this.wallets);
    console.log(array3);
    this.mainButtonOptions = array3;

    window.ethereum.on("accountsChanged", (addresses) =>
      this.selectedAccountChanged(addresses[0])
    );

    window.ethereum.on("chainChanged", (chainId) =>
      this.selectedChainChanged(chainId)
    );
  },
  watch: {
    "storedWallets.length": {
      handler() {
        this.storedWallets.forEach((wallet) => {
          let walletInList = false;
          let newWalletLabel = this.addressShortener(wallet.publicAddress);
          this.wallets.forEach((existingWallet) => {
            if (existingWallet.label == newWalletLabel) walletInList = true;
          });

          if (!walletInList) {
            this.mainButtonOptions.push({
              label: newWalletLabel,
              icon: "pi pi-wallet",
              command: () => {
                this.switchActiveWallet(wallet);
              },
            });
          }
        });
      },
    },
  },
  methods: {
    maskNumberCommaSeparator(value){
      return UtilService.maskNumberCommaSeparator(value)
    },
    maskDollarValue(value){
      return UtilService.maskDollarValue(value)
    },
    showZeroBalances(show) {
      this.showZero = show;
    },
    setSortBy(sortByMe) {
      if (sortByMe === "date") this.sortBy = WalletService.ORDER_TYPES.TXN_TIME;
      else if (sortByMe === "relevance")
        this.sortBy = WalletService.ORDER_TYPES.BALANCE;
    },
    connectWalletManually(){
      console.log(this.netIdManualEntry)
      if(this.netIdManualEntry && this.walletAddressManualEntry) this.makeWalletConnection(this.walletAddressManualEntry, this.netIdManualEntry.netId, true)
      else {
        this.$store.dispatch("addMessage", {
          severity: "warn",
          content: "Add wallet address and choose network",
          sticky: true,
        });
      }
    },
    disconnectWallet() {
      this.$store.dispatch("walletModule/disconnectWallet");
    },
    async connectWallet() {
      this.disableConnectButton = true;

      if (!localStorage.getItem("hasSeenTutorial")) {
        this.tutorialDialog = true;
        localStorage.setItem("hasSeenTutorial", "true");
      }

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          this.makeWalletConnection(accounts[0], window.ethereum.networkVersion);
        })
        .catch((err) => {
          this.walletConnectionFail(err);
        });
    },
    walletConnectionFail(err) {
      if (err.code === 4001) {
        this.$store.dispatch("addMessage", {
          severity: "warn",
          content: "Please accept connection request in the Metamask extention",
          sticky: true,
        });
      } else {
        this.$store.dispatch("addMessage", {
          severity: "error",
          content: err,
          sticky: true,
        });
      }
      this.disableConnectButton = false;
    },
    makeWalletConnection(account, netId, voidApiAccess) {
      const walletData = {
        publicAddress: account,
        netId: netId,
        message: "User initiated connection",
        voidApiAccess: voidApiAccess
      };
      this.makeWalletActive(walletData);
      this.disableConnectButton = false;
    },
    selectedChainChanged(chainId) {
      if (this.selectedChainId === chainId) return; // chain actually didn't change (needed because MM sometimes calls this multiple times)
      this.selectedChainId = chainId;
      if (chainId != BSC_CHAIN_MM_ID) {
        this.$store.dispatch("addMessage", {
          severity: "warn",
          content:
            "ByBlock asset manager currently only supports Binance Smart Chain",
          sticky: true,
        });
      }
    },
    selectedAccountChanged(addresses) {
      const walletData = {
        publicAddress: addresses,
        netId: window.ethereum.networkVersion,
        message: "User initiated connection",
      };
      // Already connected
      if (this.connectedWalletAddress) this.switchWallet(walletData);
      // No previous connection
      else this.makeWalletActive(walletData);
    },
    switchWallet(walletData) {
      this.disconnectWallet();
      this.makeWalletActive(walletData);
    },
    makeWalletActive(walletData) {
      this.disableConnectButton = false;
      this.$store.dispatch("walletModule/connectWallet", walletData);
    },
    showArchivedAssets() {
      this.showArchived = true;
      this.$store.commit("accountModule/setNrOfAutoBlackListedAssets", 0)
    },
    showActiveAssets() {
      this.showArchived = false;
    },
    addressShortener(address) {
      if (!address) return "";
      let partOne = address.substring(0, 5);
      let partTwo = "...";
      let partThree = address.substring(address.length - 5, address.length);
      return partOne + partTwo + partThree;
    },
    saveWalletName() {
      this.$store.dispatch("accountModule/nameWallet", {
        address: this.connectedWalletAddress,
        name: this.walletNameInput,
      });
      this.toggleWalletNamingDialog(false);
    },
    toggleWalletNamingDialog(show) {
      this.walletNameDialog = show;
    },

  },
};
</script>
<style lang="scss">
@use "../assets/css/variables";
@import "../assets/css/global.scss";

.invisible {
  visibility: hidden;
}

.wallet-total-container {
  display: flex;
  justify-content: flex-start;
  width: 50%;
}
.total-native {
  margin-left: 30pt;
}

.total-title {
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  color: variables.$neutral-color-black-medium;
}

.total-title span {
  display: inline-flex;
  align-items: center;
}
.total-value {
  margin-top: 3pt;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0px;
  text-align: center;
  color: variables.$neutral-color-black-dark;
}

.assets-header {
  display: flex;
  justify-content: space-between;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
}
.filter-bar {
  float: right;
}
.sort-bar {
  width: 100%;
}
.archived-assets-text,
.loading-container,
.assets-title {
  display: flex;
}

.search-input {
  width: 200pt;
}

.loading-container {
  max-width: 150pt;
}
.loading-container span {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.assets-title h2 {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.no-assets-container {
  text-align: center;
  color: grey;
}
</style>