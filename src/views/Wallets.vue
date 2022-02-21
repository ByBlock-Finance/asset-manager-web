<template>
  <base-layout>
    <div class="home">
      <div class="byb-flex-space-between">
        <div class="view-body-container">
          <h1 class="mr-3">My Wallets</h1>
        </div>
        <div>
          <Button
            class="p-button-raised p-button mt-5"
            label="Add new"
            @click="toggleWalletAddDialog(true)"
          />
        </div>
      </div>
      <div class="mt-5 ml-5 mb-5">
        <p>Manage your stored wallets and their names here</p>

        <div v-if="!storedWallets.length" class="byb-empty-state">
          <h3>No wallets stored. Add your first wallet</h3>
          <Button
            class="p-button-raised p-button mt-5"
            label="Add new wallet"
          autofocus

            @click="toggleWalletAddDialog(true)"
          />
        </div>

        <template
          v-for="storedWallet in storedWallets"
          :key="storedWallet.publicAddress"
        >
          <div
            class="asset-card wallet-frame"
            v-if="storedWallet.publicAddress"
          >
            <div>
              <h2
                v-if="getWalletName(storedWallet.publicAddress)"
                class="wallet-name"
              >
                {{ getWalletName(storedWallet.publicAddress) }}
              </h2>
              <h2 v-else class="wallet-no-name">unnamed</h2>

              <!-- TODO: add @click="copyContent(contractAddress)" -->
              <div class="token-contract mt-3">
                <div class="wallet-icon">
                  <i class="pi pi-wallet"></i>
                </div>

                <span
                  class="token-contract-txt"
                  v-if="storedWallet.publicAddress"
                  :v-tooltip="storedWallet.publicAddress"
                  >{{ tokenAddressShortener(storedWallet.publicAddress) }}
                </span>
                <!-- <span class="material-icons token-address-copy"
                  >content_copy</span
                > -->
              </div>
            </div>
            <hr class="mt-3 mb-3" />

            <div class="">
              <Button
                class="
                  p-button
                  p-component
                  p-button-icon-only
                  p-button-rounded
                  p-button-text
                "
                icon="pi pi-pencil"
                v-tooltip="'Edit stored wallet'"

                @click="
                  toggleWalletNamingDialog(true, storedWallet.publicAddress)
                "
              ></Button>
              <Button
                class="
                  p-button
                  p-button-danger
                  p-component
                  p-button-icon-only
                  p-button-rounded
                  p-button-text
                "
                v-tooltip="'Forget wallet'"
                icon="pi pi-trash"
                @click="deleteWallet(storedWallet.publicAddress)"
              ></Button>
              
            </div>
          </div>
        </template>
                  
      </div>
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
      header="Add new wallet"
      v-model:visible="newWalletDialog"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <p>Store your wallet for ease of use.</p>
      <p>Use names to better navigate between your wallets</p>
      <br />
      <InputText
        type="text"
        v-model="newWalletNameInput"
        placeholder="My wallet name"
      />
      <InputText
        type="text"
        v-model="newWalletAddressInput"
        placeholder="My wallet address"
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
          :disabled="!newWalletNameInput || !newWalletAddressInput"
          @click="saveWalletName(newWalletNameInput, newWalletAddressInput)"
        />
      </template>
    </Dialog>
  </base-layout>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import BaseLayout from "@/layouts/BaseLayout.vue";
@Options({
  components: {
    BaseLayout,
  },
  data() {
    return {
      walletNameDialog: false,
      newWalletDialog: false,
      selectedWalletAddress: "",
      walletNameInput: "",
      newWalletAddressInput: "",
      newWalletNameInput: "",
    };
  },
  created() {
    this.$store.dispatch("accountModule/fetchWalletNames");
    this.$store.dispatch("accountModule/fetchStoredWallets");
  },
  computed: {
    storedWallets() {
      return this.$store.state.accountModule.storedWallets;
    },
    walletNames() {
      return this.$store.state.accountModule.walletNames;
    },
  },
  methods: {
    toggleWalletAddDialog(show) {
      this.newWalletDialog = show;
    },
    deleteWallet(address) {
      console.log("delete: " + address);
      this.$store.dispatch("accountModule/removeStoredWallet", address);
    this.showMessage("Wallet removed", "warn")

    },
    getWalletName(address) {
      return this.$store.state.accountModule.walletNames[address];
    },
    toggleWalletNamingDialog(show, selectedWallet) {
      this.walletNameDialog = show;
      this.selectedWalletAddress = selectedWallet;
    },
    saveWalletName(name, address) {
      console.log(name, address)
      let n, a;
      if (name) n = name;
      else n = this.walletNameInput;

      if (address) a = address;
      else a = this.selectedWalletAddress;

      this.$store.dispatch("accountModule/addStoredWallet", {
        netId: -1,
        publicAddress: a,
        type: "",
        name: n,
        message: "Added manually",
      });
    this.showMessage("Wallet saved", "info")
this.toggleWalletNamingDialog(false);
      this.toggleWalletAddDialog(false);
    },
    tokenAddressShortener(address) {
      if (!address) return;
      let partOne = address.substring(0, 5);
      let partTwo = "...";
      let partThree = address.substring(address.length - 5, address.length);
      return partOne + partTwo + partThree;
    },
    showMessage(message, level){
      this.$store.dispatch("addMessage", {
        severity: level,
        content: message,
        sticky: false,
      });
    }
  },
})
export default class Services extends Vue {}
</script>
<style lang="scss">
@use "../assets/css/variables";
@import "../assets/css/global.scss";

.wallet-frame {
  max-width: 400pt;
}
.wallet-no-name {
  color: grey;
}
.wallet-icon {
  margin-top: 2px;
  height: 22px;
  width: 22px;
  background-size: cover;
  display: inline-block;
  margin-right: 1em;
  border: 0px;
}
.service-item {
  padding: 20pt;
}
.service-item-content {
  text-align: center;
}
.service-image {
  max-height: 100pt;
  // max-width: 250pt;
  margin: auto;
  display: block;
}

.service-item-text {
  margin-top: 20px;
  padding: 1em;
}

pre {
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-left: 3px solid variables.$primary-color-medium;
  color: #666;
  page-break-inside: avoid;
  font-family: monospace;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 1.6em;
  max-width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
}

.ordered-list {
  font-size: 16px;
}
.ordered-list li {
  line-height: 30px;
}
</style>