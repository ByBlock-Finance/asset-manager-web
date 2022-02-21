<template>
  <div>
    <div class="asset-card">
      <!-- {{ moralis }} -->
      <div class="p-grid">
        <div class="p-col-fixed" style="width: 100px">
          <Avatar :image="tokenIcon" size="xlarge" shape="circle" />
        </div>
        <div class="p-col-3">
          <div class="token-name-avatar mb-2">
            <h4>{{ tokenName }}</h4>
          </div>
          <div class="token-symbol mb-3">
            <h3 class="sub-heading">{{ tokenSymbol }}</h3>
          </div>
          <div class="token-contract" @click="copyContent(contractAddress)">
            <div class="token-chain-icon"></div>
            <span class="token-contract-txt"
              >{{ tokenAddressShortener(contractAddress) }}
            </span>
            <span class="material-icons token-address-copy">content_copy</span>
          </div>
        </div>
        <div class="p-col-3 asset-meta-grid">
          <div class="asset-holdings asset-meta">
            <div class="p-grid">
              <div class="p-col-6 holding-item holding-qty">
                <div class="meta-item-title">quantity</div>
                <div class="holding-item-value">
                  {{ maskNumberCommaSeparator(holding.balance) }}
                </div>
              </div>
              <div class="p-col-4 holding-item holding-value">
                <div class="meta-item-title">value</div>
                <div class="holding-item-value">
                  {{ maskDollarValue(holding.valueInUsd) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-col-4 asset-meta-grid market-container">
          <div class="asset-market asset-meta" v-if="market">
            <div class="p-grid">
              <div class="p-col-5 market-item market-caü">
                <div class="meta-item-title">market cap</div>
                <div class="market-item-value">
                  {{ maskDollarValue(market.marketCapInUsd) }}
                </div>
              </div>
              <div class="p-col-4 market-item market-dcap">
                <div class="meta-item-title">dil. market cap</div>
                <div class="market-item-value">
                  {{ maskDollarValue(market.dilMarketCapInUsd) }}
                </div>
              </div>
              <div class="p-col-3 market-item market-price">
                <div class="meta-item-title">price</div>
                <div class="market-item-value market-price-value">
                  {{ maskDollarValue(market.priceInUsd) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-col-1">
          <div class="asset-action">
            <div class="asset-action-items">
              <Button
                v-if="blacklisted"
                icon="pi pi-wallet"
                v-tooltip="'Bring back to wallet'"
                class="p-button-rounded p-button-success p-button-text"
                @click="unarchiveAsset(contractAddress)"
              ></Button>
              <Button
                v-if="!blacklisted"
                icon="pi pi-trash"
                v-tooltip="'Archive asset'"
                class="p-button-rounded p-button-danger p-button-text"
                @click="archiveAsset(contractAddress)"
              ></Button>
              <!-- <Button
                v-if="blacklisted"
                class="
                  mr-3
                  p-button-raised
                  p-button-rounded
                  p-button-outlined
                  p-button-success
                "
                icon="pi pi-wallet"
                v-tooltip="'Bring back to wallet'"
                @click="unarchiveAsset(contractAddress)"
              /> -->
              <!-- <Button
                v-else
                class="
                  mr-3
                  p-button-raised
                  p-button-rounded
                  p-button-outlined
                  p-button-danger
                "
                icon="pi pi-trash"
                v-tooltip="'Archive asset'"
                @click="archiveAsset(contractAddress)" 
              />-->
              <!-- <Button
                class="p-button-raised p-button-rounded p-button-outlined"
                icon="pi pi-heart"
                v-tooltip="'Position asset on top'"
                @click="favoriteAsset(contractAddress)"
              /> -->

              <!-- <SplitButton label="more" class="p-button-secondary" :model="moreButtonOptions"></SplitButton> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="txn-toggle-btn mt-1">
      <div class="txn-action-bar">
        <div style="display: inline-flex">
          <Button
            iconPos="right"
            icon="pi pi-chevron-down"
            class="p-button-text"
            :label="transactionLableName(tokenSymbol)"
            @click="toggleAssetTransactions()"
          />
          <span v-if="lastTransferDate" class="last-transfer-mark"
            >Last transfer on {{ lastTransferDate }}</span
          >
        </div>
        <Button
          v-if="showAssetTransactions"
          icon="pi pi-download"
          class="p-button-text"
          label="Export"
          @click="exportCSV($event)"
        />
      </div>
    </div>
    <div class="asset-transactions mt-3" v-if="showAssetTransactions">
      <!-- <pre>{{ balanceItemSummaryContracts }}</pre> -->
      <ProgressBar
        v-if="loadingTransferItems"
        mode="indeterminate"
      ></ProgressBar>
      <DataTable
        v-if="balanceItemSummaryContracts.length > 0"
        :value="balanceItemSummaryContracts"
        :resizableColumns="true"
        columnResizeMode="fit"
        showGridlines
        responsiveLayout="scroll"
        ref="dtb"
      >
        <template #header>
          <div>
            <span
              v-tooltip="
                'This is derived from transferd to and from different contracts (not wallets) and is an estimation!'
              "
            >
              Balance on contracts <i class="pi pi-info-circle"></i>
            </span>
          </div>
        </template>
        <Column
          field="contractAddress"
          header="Contract"
          columnResizeMode="fit"
        >
          <template #body="slotProps">
            <div class="otherWalletAdr">
              <span
                v-tooltip="slotProps.data.contractAddress"
                @click="
                  launchLink(
                    'https://bscscan.com/address/' +
                      slotProps.data.contractAddress
                  )
                "
                >{{
                  tokenAddressShortener(slotProps.data.contractAddress)
                }}</span
              >
            </div>
            <!-- <div >{{ tokenAddressShortener(slotProps.data.contractAddress) }}</div> -->
          </template>
        </Column>
        <Column
          field="totalLeftInContract"
          header="Quantity"
          columnResizeMode="fit"
        >
          <template #body="slotProps">
            {{ maskNumberCommaSeparator(slotProps.data.totalLeftInContract) }}
          </template>
        </Column>
        <Column header="Address tag" columnResizeMode="expand">
          <template #body="slotProps">
            <div
              v-for="(tag, index) in getContractTags(
                slotProps.data.contractAddress
              )"
              :key="index"
            >
              <Chip
                :label="tag"
                removable
                @click="removeTag(slotProps.data.contractAddress, tag)"
              />
            </div>
            <Button
              v-if="getContractTags(slotProps.data.contractAddress).length == 0"
              icon="pi pi-plus"
              class="p-button-rounded p-button-success p-button-text"
              @click="addContractTag(slotProps.data.contractAddress)"
            ></Button>
          </template>
        </Column>
        <Column header="DCA" columnResizeMode="fit">
          <template #body="slotProps">
            <span
              v-tooltip="
                'Rough estimated dca in case this contract was used to buy from'
              "
              >{{ slotProps.data.dca }}</span
            >
          </template>
        </Column>
      </DataTable>
      <DataTable
        :value="assetTransferItems"
        :resizableColumns="true"
        columnResizeMode="fit"
        showGridlines
        responsiveLayout="scroll"
        ref="dt"
        class="mt-3 txn-table"
        headerClass="table-header"
      >
        <template #header>
          <div>Transaction history</div>
        </template>
        <Column field="block_signed_at" header="Date" :sortable="true">
          <template #body="slotProps">
            {{ dateStringToDate(slotProps.data.block_signed_at) }}
          </template>
        </Column>
        <Column field="from_address_label" header="From">
          <template #body="slotProps">
            <div :class="fromClass(slotProps.data)">
              <span
                v-tooltip="slotProps.data.from_address"
                v-if="slotProps.data.direction === 'IN'"
                @click="
                  launchLink(
                    'https://bscscan.com/address/' + slotProps.data.from_address
                  )
                "
                >{{ slotProps.data.from_address_label }}</span
              >
              <span v-else>{{ slotProps.data.from_address_label }}</span>
            </div>
          </template>
        </Column>
        <Column field="to_address" header="To">
          <template #body="slotProps">
            <div :class="toClass(slotProps.data)">
              <span
                v-tooltip="slotProps.data.to_address"
                v-if="slotProps.data.direction === 'OUT'"
                @click="
                  launchLink(
                    'https://bscscan.com/address/' + slotProps.data.to_address
                  )
                "
                >{{ slotProps.data.to_address_label }}</span
              >
              <span v-else>{{ slotProps.data.to_address_label }}</span>
            </div>
          </template>
        </Column>
        <Column field="quantity" header="Quantity">
          <template #body="slotProps">
            <div :class="stockClass(slotProps.data)">
              {{ maskNumberCommaSeparator(slotProps.data.quantity) }}
            </div>
          </template>
        </Column>
        <Column field="unit" header="Unit"></Column>
        <Column header="Gas fee">
          <template #body="slotProps">
            <div>
              {{ maskNumberCommaSeparator(slotProps.data.gas.gas_qty) }}
            </div>
          </template>
        </Column>
        <Column field="fee_unit" header="Gas unit"> </Column>
        <Column field="transfer_type" header="Type">
          <template #body="slotProps">
            <div>
              <i
                v-if="getTxnType(slotProps.data.transfer_type) === 'contract'"
                class="pi pi-book"
              ></i>
              <i v-else class="pi pi-wallet"></i>
              {{ getTxnType(slotProps.data.transfer_type) }}
            </div>
          </template>
        </Column>
        <Column field="price" header="@ value">
          <template #body="slotProps">
            <div v-tooltip="'Asset price during transaction'">
              {{ maskDollarValue(slotProps.data.price) }}
            </div>
          </template>
        </Column>
        <Column header="Txn note">
          <template #editor="slotProps">
            <input :value="getTransactionNotes(slotProps.data.tx_hash)" />
          </template>
        </Column>
        <Column header="Address tag">
          <template #body="slotProps">
            <div
              v-for="(tag, index) in getContractTagsDecideContract(
                slotProps.data
              )"
              :key="index"
            >
              <Chip
                :label="tag"
                removable
                @click="removeTagDecideContract(slotProps.data, tag)"
              />
            </div>
            <Button
              v-if="getContractTagsDecideContract(slotProps.data).length == 0"
              icon="pi pi-plus"
              class="p-button-rounded p-button-success p-button-text"
              @click="addContractTagDecideContract(slotProps.data)"
            ></Button>
          </template>
        </Column>
        <Column field="txn_link" header="Txn">
          <template #body="slotProps">
            <span
              v-if="slotProps.data.txn_link"
              class="material-icons clickable"
              @click="launchLink(slotProps.data.txn_link)"
              >launch</span
            >
          </template>
        </Column>
      </DataTable>
      <Toast position="top-left" />
      <Dialog
        header="Tag an address"
        v-model:visible="showWalletTagDialog"
        position="top"
      >
        <p>Use tags to better navigate between contracts</p>
        <InputText type="text" v-model="tagInput" />

        <template #footer>
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="showWalletTagDialog = false"
          />
          <Button label="Add" icon="pi pi-check" autofocus @click="addATag()" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Toast from "primevue/toast";
const DIRECTION_IN = "IN";
const DIRECTION_OUT = "OUT";
export default {
  name: "WalletAsset",
  props: {
    contractAddress: {},
    tokenName: {},
    tokenSymbol: {},
    tokenIcon: {},
    tokenDecimal: {},
    holding: {},
    market: {},
    walletAddress: {},
    blacklisted: {},
    lastTransferAt: {},
    assetColor: {},
    moralis: {},
  },
  components: {
    Toast,
  },
  data() {
    return {
      showAssetTransactions: false,
      transactionsTransformed: [],
      showWalletTagDialog: false,
      tagInput: "",
      stagedTagContract: "",
    };
  },
  emits: [],
  // mounted() {},
  computed: {
    loadingTransferItems() {
      return this.$store.state.walletModule.loadingTransferItems;
    },
    lastTransferDate() {
      if (!this.lastTransferAt) return "";
      return dayjs(this.lastTransferAt).format("DD MMM YY, HH:mm");
    },
    assetTransferItems() {
      return this.$store.state.walletModule.assetTransferItems.filter(
        (item) => item.asset_contract === this.contractAddress
      );
    },
    balanceItemSummary() {
      return this.$store.state.walletModule.balanceItemSummary[
        this.contractAddress
      ];
    },
    balanceItemSummaryContracts() {
      const result = [];
      if (
        !this.$store.state.walletModule.balanceItemSummary[this.contractAddress]
      )
        return [];
      for (const [key, value] of Object.entries(
        this.$store.state.walletModule.balanceItemSummary[this.contractAddress]
          .contractTransfers
      )) {
        if (value.totalLeftInContract > 0) result.push(value);
      }
      return result;
    },
  },
  methods: {
    onCellEditComplete(event) {
      let { data, newValue, field } = event;

      console.log("event.field: ", event.field)
    },
    getTransactionNotes(txnHash) {
      console.log("getTransactionNotes | txnHash: ", txnHash)
      return "My note";
    },
    addATag() {
      this.$store.commit("tokenModule/addTag", {
        contract: this.stagedTagContract,
        tag: this.tagInput,
      });
      this.stagedTagContract = "";
      this.tagInput = "";
      this.showWalletTagDialog = false;
    },
    getContractTagsDecideContract(assetTransferItem) {
      let relevantContract = "";
      if (assetTransferItem.direction === DIRECTION_IN)
        relevantContract = assetTransferItem.from_address;
      if (assetTransferItem.direction === DIRECTION_OUT)
        relevantContract = assetTransferItem.to_address;

      const result = this.getContractTags(relevantContract);
      if (result) return result;
      return [];
    },
    addContractTagDecideContract(assetTransferItem) {
      let relevantContract = "";
      if (assetTransferItem.direction === DIRECTION_IN)
        relevantContract = assetTransferItem.from_address;
      if (assetTransferItem.direction === DIRECTION_OUT)
        relevantContract = assetTransferItem.to_address;
      this.stagedTagContract = relevantContract;
      this.showWalletTagDialog = true;
      // this.addContractTag(relevantContract);
    },
    removeTagDecideContract(assetTransferItem, tag) {
      let relevantContract = "";
      if (assetTransferItem.direction == DIRECTION_IN)
        relevantContract = assetTransferItem.from_address;
      if (assetTransferItem.direction == DIRECTION_OUT)
        relevantContract = assetTransferItem.to_address;
      this.removeTag(relevantContract, tag);
    },
    // TODO: move all 3 tag methos to actions and store in localstorage
    getContractTags(contractAddress) {
      const result = this.$store.state.tokenModule.tags[contractAddress];
      if (result) return result;
      return [];
    },
    addContractTag(contractAddress, tag) {
      this.stagedTagContract = contractAddress;
      this.tagInput = tag;
      this.showWalletTagDialog = true;
    },
    removeTag(contractAddress, tag) {
      this.$store.commit("tokenModule/removeTag", {
        contract: contractAddress,
        tag: tag,
      });
    },
    getHeaderStyle() {
      if (this.assetColor) return "background-color:" + this.assetColor;
      else return "";
    },
    getTxnType(transferType) {
      return transferType;
    },
    unarchiveAsset(contractAddress) {
      this.$store.dispatch("walletModule/unarchiveAsset", contractAddress);
      this.$store.dispatch("addMessage", {
        severity: "info",
        content: "Asset back to wallet",
        sticky: false,
        life: 1000,
      });
    },
    archiveAsset(contractAddress) {
      this.$store.dispatch("walletModule/archiveAsset", contractAddress);
      this.$store.dispatch("addMessage", {
        severity: "info",
        content: "Asset archived",
        sticky: false,
        life: 1000,
      });
    },
    favoriteAsset(contractAddress) {
      console.log("favorite: ", contractAddress);
    },
    transactionLableName(symbol) {
      return "Transactions with " + symbol;
    },
    maskDollarValue(value) {
      try {
        if (!value || isNaN(value) || value <= 0) return "-";
        if (value > 0.01) {
          var formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          });
          return formatter.format(value); /* $2,500.00 */
        } else {
          return "$" + value.toFixed(9);
        }
      } catch (error) {
        return value;
      }
    },
    maskNumberCommaSeparator(value) {
      try {
        if (!value || isNaN(value)) return value;
        if (value > 0.01) {
          return value
            .toFixed(2)
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        } else {
          return value.toFixed(6);
        }
      } catch (error) {
        return value;
      }
    },
    dateStringToDate(timestamp) {
      if (timestamp) return dayjs(timestamp).format("DD.MM.YYYY (HH:mm)");
      return timestamp;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    launchLink(link) {
      console.log("link: ", link);
      window.open(link);
    },
    fromClass(data) {
      return [
        {
          otherWalletAdr: data.direction === DIRECTION_IN,
          thisWalletAdr: data.direction === DIRECTION_OUT,
        },
      ];
    },
    toClass(data) {
      return [
        {
          totalWalletAdr: data.type === "total",
          thisWalletAdr:
            data.direction === DIRECTION_IN && data.type != "total",
          otherWalletAdr:
            data.direction === DIRECTION_OUT && data.type != "total",
        },
      ];
    },
    stockClass(data) {
      return [
        {
          incoming: data.direction === DIRECTION_IN,
          outgoing: data.direction === DIRECTION_OUT,
        },
      ];
    },
    toggleAssetTransactions() {
      if (this.showAssetTransactions) this.showAssetTransactions = false;
      else this.showAssetTransactions = true;
    },
    tokenAddressShortener(address) {
      let partOne = address.substring(0, 5);
      let partTwo = "...";
      let partThree = address.substring(address.length - 5, address.length);
      return partOne + partTwo + partThree;
    },
    copyContent(content) {
      var textArea = document.createElement("textarea");

      //
      // *** This styling is an extra step which is likely not required. ***
      //
      // Why is it here? To ensure:
      // 1. the element is able to have focus and selection.
      // 2. if the element was to flash render it has minimal visual impact.
      // 3. less flakyness with selection and copying which **might** occur if
      //    the textarea element is not visible.
      //
      // The likelihood is the element won't even render, not even a
      // flash, so some of these are just precautions. However DIRECTION_IN
      // Internet Explorer the element is visible whilst the popup
      // box asking the user for permission for the web page to
      // copy to the clipboard.
      //

      // Place DIRECTION_IN the top-left corner of screen regardless of scroll position.
      textArea.style.position = "fixed";
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = "2em";
      textArea.style.height = "2em";

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";

      // Avoid flash of the white box if rendered for any reason.
      textArea.style.background = "transparent";

      textArea.value = content;

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";

        this.$store.dispatch("addMessage", {
          severity: "success",
          content: "Contract address copied",
          sticky: false,
          life: 1000,
        });
      } catch (err) {
        console.log("Oops, unable to copy");
      }
    },
  },
};
</script>

<style lang="scss">
@use "../../assets/css/variables";
@use "../../assets/css/global";

.txn-toggle-btn {
  cursor: pointer;
  color: variables.$neutral-color-black-medium;
  display: flex;
}

.asset-container {
  width: 100%;
  min-height: 100pt;
}

.asset-card {
  padding: 1em;
  margin-top: 1.5em;
  border: 1px solid #e4e8ed;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12pt;
}

.market-container {
  border-left: 1px solid variables.$neutral-color-black-light;
  padding-left: 2em;
}
.token-icon {
  width: 28pt;
  height: 28pt;
}
.token-symbol {
  padding: 0.2em 1em 0.2em 1em;
  background-color: variables.$primary-color-light;
  border-radius: 6px;
  color: variables.$primary-color-medium;
  display: inline-block;
}
.token-contract {
  padding: 0.5em;
  background: #f5faff;
  border-radius: 6px;
  max-width: 150pt;
  display: flex;
  justify-content: space-evenly;
  cursor: pointer;
}

.asset-action {
  display: flex;
  justify-content: flex-end;
}
.asset-action-items {
  display: flex;
  justify-content: space-evenly;
}

.token-chain-icon {
  margin-top: 2px;
  height: 22px;
  width: 22px;
  background-image: url("../../assets/logos/bnb.png");
  background-size: cover;
  display: inline-block;
  margin-right: 1em;
  border: 0px;
}

.token-contract-txt {
  line-height: 28px;
}

.asset-meta-grid {
  display: grid;
}
.asset-meta {
  align-self: flex-end;
}

.last-transfer-mark {
  display: inline-flex;
  align-items: center;
}

.meta-item-title {
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: variables.$neutral-color-black-medium;
}

.holding-item-value {
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;
  color: variables.$neutral-color-black-dark;
}

.market-item-value {
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: variables.$primary-color-medium;
}

.market-price-value {
  font-weight: bold;
}

.txn-action-bar Button {
  float: right;
}

.txn-action-bar {
  display: inline-block;
  justify-content: space-between;
  width: 100%;
}

.incoming {
  font-weight: 700;
  color: variables.$semantic-color-green-dark;
}

.outgoing {
  font-weight: 700;
  color: variables.$semantic-color-red-dark;
}

.thisWalletAdr {
  color: variables.$primary-color-medium;
}

.totalWalletAdr {
  color: variables.$primary-color-medium;
  font-weight: 700;
}
.otherWalletAdr {
  color: variables.$neutral-color-black-medium;
  text-decoration: underline;
  cursor: pointer;
}

.table-header {
  background-color: red;
}
</style>
