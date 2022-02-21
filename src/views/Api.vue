<template>
  <base-layout>
    <div class="home">
      <div class="byb-flex-space-between">
        <div class="view-body-container">
          <h1 class="mr-3">{{ connectedWalletName }}</h1>
        </div>
        <div class="byb-flex-end">
          <!-- TODO: add wallet connect functionality here also -->
        </div>
      </div>
      <div class="access-container mt-5 ml-5">
        <div v-if="apiAccessData.key">
          <div class="bb-card">
            <div class="section">
              <div class="section-title">CONNECTED WALLET</div>
              <div class="section-value">{{ connectedWalletAddressShort }}</div>
            </div>
            <div class="section">
              <div class="section-title">
                <span
                  v-tooltip="
                    'API key can be enabled by holding BYB token on your wallet or purchasing access. Read more in Services'
                  "
                >
                  STATUS <i class="pi pi-info-circle"></i>
                </span>
              </div>
              <div class="section-value">
                {{ statusValue }}
              </div>
            </div>
            <div class="section">
              <div class="section-title">API KEY</div>
              <div class="section-value">{{ apiAccessData.key }}</div>
            </div>
            <div class="section">
              <div class="section-title">CREATED AT</div>
              <div class="section-value">{{ createdAt }}</div>
            </div>

            <div class="enable-button">
              <Button
                v-if="!apiAccessData.enabled"
                class="p-button-raised p-button"
                label="Enable API"
                @click="toggleShowEnableAPIModal(true)"
              />
            </div>
          </div>
        </div>
        <div v-else>Connect your wallet to see your API status</div>
      </div>
    </div>

    <Dialog
      header="Enable API"
      v-model:visible="showEnableAPIModal"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <p>
        ByBlock API key is used to access all ByBlock services available over
        the API. For example, you can use the API key to access ByBlock's Google
        Sheets plugin real-time crypto pricing services. See all available
        services over at
        <router-link to="/services" style="color: #24659B; font-weight: bold"
          >Services page</router-link
        >
      </p>
      <br />
      <p>
        To Enable API key, either hold BYB tokens in your wallet or purchase
        maccess.
      </p>
      <br />
      <hr />
      <p>
        Purchase access by transferring $500.00 worth of BNB to the following
        wallet. Payments are monthly
      </p>
      <p>Receiving wallet: 234567887654234567654</p>
      <p>
        <i
          >Your API key will be enabled in 1 business day after purchase. When
          you hold BYB tokens on your wallet, no payment is necessary</i
        >
      </p>
    </Dialog>
  </base-layout>
</template>

<script>
import { mapState } from "vuex";
import { Options, Vue } from "vue-class-component";
import BaseLayout from "@/layouts/BaseLayout.vue";
import dayjs from "dayjs";

@Options({
  components: { BaseLayout },
  data() {
    return {
      showEnableAPIModal: false,
    };
  },
  created() {
    // console.log("I'm inside api.vue");
    // this.$store.commit("walletModule/setApiAccessData", {
    //   key: "dummykey-asäfnsdknasdäkansdlaskndas",
    //   enabled: false,
    //   createdAt: "2021-12-02T12:45:00Z",
    // });
  },
  computed: {
    ...mapState("walletModule", { walletAssets: "assets" }),
    connectedWalletAddressShort() {
      return this.addressShortener(this.connectedWalletAddress);
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
    apiAccessData() {
      return this.$store.state.walletModule.apiAccessData;
    },
    statusValue() {
      if (this.apiAccessData.enabled) return "Enabled";
      else return "Disabled";
    },
    createdAt() {
      return dayjs(this.apiAccessData.createdAt).format("DD MMM YY");
    },
  },
  methods: {
    toggleShowEnableAPIModal(show) {
      this.showEnableAPIModal = show;
    },
    addressShortener(address) {
      if (!address) return "";
      let partOne = address.substring(0, 5);
      let partTwo = "...";
      let partThree = address.substring(address.length - 5, address.length);
      return partOne + partTwo + partThree;
    },
  },
})
export default class Api extends Vue {}
</script>
<style lang="scss">
@use "../assets/css/variables";
@import "../assets/css/global.scss";
.access-container {
  max-width: 400pt;
}
.bb-card {
  padding: 1em;
  margin-top: 1.5em;
  border: 1px solid #e4e8ed;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12pt;
}

.section {
  margin-top: 1em;
}
.section-title {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 150%;
  /* or 18px */

  display: flex;
  align-items: center;

  /* Neutrals/Gray-4 */

  color: #7f94a9;
}

.section-value {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  /* or 21px */

  display: flex;
  align-items: center;

  /* Neutrals/Black */

  color: #001d38;
}

.enable-button {
  margin-top: 2em;
  width: 100%;
}
</style>