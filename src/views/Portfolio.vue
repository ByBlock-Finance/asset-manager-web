<template>
  <base-layout>
    <div class="home">
      <div class="byb-flex-space-between">
        <div class="view-body-container">
          <div>
            <h1 class="mr-3">Your Portfolio</h1>
            <p>See aggregrate view of all your assets across wallets. Manage your wallets here.</p>
            <p>Cannot see certain assets? Manage archived assets here.</p>
          </div>
        </div>
        <div>
          <MultiSelect
            v-model="selectedWallets"
            :options="walletSelectOptions"
            optionLabel="name"
            optionValue="address"
            placeholder="Select Wallets"
          />
          <div class="mt-2">
            <Button
              class="p-button-raised p-button"
              label="Show portfolio"
              :disabled="selectedWallets.length == 0 || loadingPortfolio"
              @click="getPortfolio()"
            />
          </div>
        </div>
      </div>

      <div
        class="wallet-total-container mt-5 ml-5"
        v-if="selectedWallets.length > 0"
      >
        <div class="total-dollar">
          <div
            class="total-title"
            v-tooltip="'Total value is only accounted for non-arhived assets'"
          >
            <span>Total value <i class="pi pi-info-circle ml-2"></i></span>
          </div>
          <ProgressSpinner v-if="loadingPortfolio" style="max-width: 10px" />
          <div v-else class="total-value">
            {{ maskDollarValue(totalPortfolioValue) }}
          </div>
        </div>
                <div class="total-dollar ml-10">
          <div
            class="total-title"
          >
            <span>Date <i class="pi pi-info-circle ml-2"></i></span>
          </div>
          <ProgressSpinner v-if="loadingPortfolio" style="max-width: 10px" />
          <div v-else class="total-value">
            {{ currenctDate }}
          </div>
        </div>
        
      </div>

      <!-- <div class="mt-3 byb-flex-space-between">
        
      </div> -->
      <div class="mt-5">
        <ProgressBar v-if="loadingPortfolio" mode="indeterminate"></ProgressBar>
        <DataTable :value="processedBalances" ref="dt">
          <!-- TODO: custom export required -->
          <!-- <template #header>
            <div style="text-align: left">
              <Button
                icon="pi pi-external-link"
                label="Export"
                @click="exportCSV($event)"
              />
            </div>
          </template> -->
          <Column field="" header="">
            <template #body="slotProps">
              <Avatar
                :image="getTokenLogo(slotProps.data.token_address)"
                size="xlarge"
                shape="circle"
              />
            </template>
          </Column>
          <Column field="" header="Symbol">
            <template #body="slotProps">
              {{ toUpperCase(slotProps.data.symbol) }}
            </template>
          </Column>
          <Column field="name" header="Name" :sortable="true"></Column>
          <Column field="" header="Contract" :sortable="true">
            <template #body="slotProps">
              <div v-tooltip="slotProps.data.token_address">
                {{ addressShortener(slotProps.data.token_address) }}
              </div>
            </template>
          </Column>
          <Column field="balance" header="Quantity" :sortable="true">
            <template #body="slotProps">
              {{ getBalanceQTY(slotProps.data.balance) }}
            </template>
          </Column>
          <Column field="" header="Price">
            <template #body="slotProps">
              {{ getTokenPrice(slotProps.data.token_address) }}
            </template>
          </Column>
          <Column field="" header="Value [$]">
            <template #body="slotProps">
              {{ getBalanceValueMasked(slotProps.data) }}
            </template>
          </Column>
          <Column field="" header="Market Cap">
            <template #body="slotProps">
              {{ getTokenMCAP(slotProps.data.token_address) }}
            </template>
          </Column>
          <Column field="" header="Diluted Cap">
            <template #body="slotProps">
              {{ getTokenDMCAP(slotProps.data.token_address) }}
            </template>
          </Column>
          <Column field="" header="Action">
            <template #body="slotProps">
              <Button
                v-tooltip="'Refresh token market and meta data'"
                label=""
                class="p-button-outlined mr-2"
                icon="pi pi-refresh"
                @click="getTokenMetadata(slotProps.data)"
              />
              <Button
                v-tooltip="'Archive irrelevant asset from Portfolio'"
                label=""
                class="p-button-outlined p-button-danger"
                icon="pi pi-trash"
                @click="blacklistToken(slotProps.data.token_address)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- <div>
        <pre>{{ tokens }}</pre>
        <pre>{{ balances }}</pre>
      </div> -->
    </div>
  </base-layout>
</template>

<script>
import * as TokenService from "../services/token";
import * as AccountService from "../services/account";
import BaseLayout from "@/layouts/BaseLayout.vue";
import * as UtilService from "@/utils/presentation";
import * as WalletService from "@/services/wallet";
import dayjs from "dayjs";

// import WalletAsset from "@/components/dashboard/WalletAsset.vue";
// import Message from "primevue/message";
import { mapState } from "vuex";
const BSC_CHAIN_MM_ID = "0x38";
const ETH_CHAIN_MM_ID = "0x1";
const NATIVE_CHAIN_TOKEN_CONTRACT =
  "0xb8c77482e45f1f44de1745f52c74426c631bdd52";
export default {
  name: "Home",
  components: {
    BaseLayout,
  },
  data() {
    return {
      selectedSortType: "",
      selectedWallets: [],
      walletSelectOptions: [],
      searchValue: "",
      sortBy: WalletService.ORDER_TYPES.PRICE,
      showArchived: false,
      showZero: true,
      sortOptions: [
        { label: "Sort", type: "" },
        { label: "Price", type: WalletService.ORDER_TYPES.PRICE },
        { label: "Value", type: WalletService.ORDER_TYPES.VALUE },
      ],
    };
  },
  computed: {
    ...mapState("walletModule", { walletAssets: "assets" }),
    loadingPortfolio() {
      return this.$store.state.walletModule.loadingPortfolio;
    },
    storedWallets() {
      return this.$store.state.accountModule.storedWallets;
    },
    walletNames() {
      return this.$store.state.accountModule.walletNames;
    },
    balances() {
      return this.$store.state.walletModule.balances;
    },
    nonBlacklistedBalances() {
      const allBalances = this.$store.state.walletModule.balances;
      const nonBlackListedBalances = [];
      allBalances.forEach((balance) => {
        if (
          !this.$store.state.accountModule.blacklistedAssets.includes(
            balance.token_address
          )
        )
          nonBlackListedBalances.push(balance);
      });
      return nonBlackListedBalances;
    },
    processedBalances() {
      if (!this.searchValue) {
        return WalletService.orderBalancesBasedOn(
          this.nonBlacklistedBalances,
          this.selectedSortType,
          this.showArchived,
          this.showZero
        );
      } else {
        return WalletService.filterBalancesBasedOn(
          this.nonBlacklistedBalances,
          this.selectedSortType,
          this.searchValue,
          this.showArchived,
          this.showZero
        );
      }
    },
    totalPortfolioValue() {
      let totalValue = 0
      this.processedBalances.forEach(balance => {
        totalValue += this.getBalanceValue(balance)
      });
      return totalValue;
    },
    currenctDate(){
      return dayjs(new Date()).format("DD MMMM YY");
    },
    tokens() {
      return this.$store.state.tokenModule.tokens;
    },
  },
  created() {
    TokenService.init("bsc");

    if (typeof window.ethereum === "undefined") {
      this.$store.dispatch("addMessage", {
        severity: "warn",
        content: "To use this application, install Metamask extention",
        sticky: true,
      });
    }

    this.$store.dispatch("accountModule/fetchBlacklistedAssets");
    this.$store.dispatch("accountModule/fetchWhitelistedAssets");
    this.$store.dispatch("accountModule/fetchFavoriteAssets");
    this.$store.dispatch("accountModule/fetchWalletNames");
    this.$store.dispatch("accountModule/fetchStoredWallets");
    this.$store.dispatch("tokenModule/fetchAddressTags");
    this.$store.dispatch("tokenModule/fetchTransactionNotes");

    window.ethereum.on("accountsChanged", (addresses) =>
      this.selectedAccountChanged(addresses[0])
    );

    window.ethereum.on("chainChanged", (chainId) =>
      this.selectedChainChanged(chainId)
    );

    this.composeStoredWalletMultiselect();
  },
  watch: {},
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async getTokenMetadata(token) {
      // TODO: move this to global space
      const user = await AccountService.loginMoralis();
      console.log("user: ", user);
      this.$store.dispatch("tokenModule/getTokenMeta", {
        symbol: token.symbol,
        contract: token.token_address,
        refresh: true,
      });
    },
    blacklistToken(contract) {
      this.$store.dispatch("walletModule/archiveAsset", contract);
      this.$store.dispatch("addMessage", {
        severity: "info",
        content: "Asset archived",
        sticky: false,
        life: 1000,
      });
    },
    toUpperCase(value) {
      return value.toUpperCase();
    },
    maskNumberCommaSeparator(value) {
      return UtilService.maskNumberCommaSeparator(value);
    },
    maskDollarValue(value) {
      return UtilService.maskDollarValue(value);
    },
    getTokenDMCAP(contract) {
      const token = this.tokens[contract];
      if (token && token.mcap) return UtilService.maskDollarValue(token.dmcap);
      else return "unknown";
    },
    getTokenMCAP(contract) {
      const token = this.tokens[contract];
      if (token && token.mcap) return UtilService.maskDollarValue(token.mcap);
      else return "unknown";
    },
    getBalanceQTY(balance) {
      return UtilService.maskNumberCommaSeparator(
        UtilService.convertGweiToRealQty(balance)
      );
    },
    getTokenPrice(contract) {
      const token = this.tokens[contract];
      if (token && token.priceInUsd)
        return UtilService.maskDollarValue(token.priceInUsd);
      else return "unknown";
    },
    getTokenLogo(contract) {
      const token = this.tokens[contract];
      if (token && token.icon) return token.icon;
      else if (token)
        return (
          "https://eu.ui-avatars.com/api/?background=random&name=" +
          token.symbol
        );
      else return "";
    },
    getToken(contract) {
      return this.tokens[contract];
    },
    getBalanceValue(balance){
      try {
        const token = this.tokens[balance.token_address];
        const realBalance = UtilService.convertGweiToRealQty(balance.balance);
        if (realBalance && token && token.priceInUsd) return realBalance * token.priceInUsd;
        else return 0;
      } catch (error) {
        return 0;
      }
    },
    getBalanceValueMasked(balance) {
      return UtilService.maskDollarValue(this.getBalanceValue(balance));
    },
    composeStoredWalletMultiselect() {
      if (this.storedWallets) {
        this.storedWallets.forEach((walletData) => {
          let name = this.addressShortener(walletData.publicAddress);
          if (this.walletNames[walletData.publicAddress])
            name = this.walletNames[walletData.publicAddress];
          this.walletSelectOptions.push({
            name: name,
            address: walletData.publicAddress,
          });
        });
      }
    },
    async getPortfolio() {
      this.$store.dispatch("walletModule/getWalletPortfolio", {
        walletAddresses: this.selectedWallets,
        netId: "bsc",
      });
    },
    connectWalletManually() {
      console.log(this.netIdManualEntry);
      if (this.netIdManualEntry && this.walletAddressManualEntry)
        this.makeWalletConnection(
          this.walletAddressManualEntry,
          this.netIdManualEntry.netId,
          true
        );
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
          this.makeWalletConnection(
            accounts[0],
            window.ethereum.networkVersion
          );
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
        voidApiAccess: voidApiAccess,
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
      this.$store.commit("accountModule/setNrOfAutoBlackListedAssets", 0);
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