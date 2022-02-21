<template>
  <base-layout>
    <div class="home">
      <div class="byb-flex-space-between">
        <div class="view-body-container">
          <h1 class="mr-3">{{ currentModalHeader }}</h1>
        </div>
      </div>
      <div class="mt-5 ml-5 mb-5">
        <p>{{ currentModalDescription }}</p>
        <p>
          All ByBlock services are available for BYB token holders (keep BYB
          tokens on your wallet according to the subscription plans). For API
          access, see<router-link to="api" class="bb-link">
            API Access page</router-link
          >
        </p>
        <!-- <Carousel :value="services" :numVisible="3" :numScroll="1" class="mt-5">
          <template #item="slotProps">
            <div class="service-item">
              <div class="service-item-content">
                <div class="p-mb-3">
                  <img
                    :src="getServiceImage(slotProps.data.id)"
                    :alt="slotProps.data.name"
                    class="service-image"
                  />
                </div>
                <div class="service-item-text">
                  <h4 class="p-mb-1">{{ slotProps.data.name }}</h4>
                  <h6 class="p-mt-0 p-mb-3">
                    {{ slotProps.data.description }}
                  </h6>
                  <Button
                    class="p-button-raised p-button"
                    label="More"
                    @click="openMore(slotProps.data)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Carousel> -->
      </div>
      <h3>Tutorial</h3>

      <div class="mb-5">
        <span v-html="currentModalDetailsHtml"></span>
        <router-link
          v-if="selectedServiceId == 'GSHEET'"
          class="mt-4 mb-4 bb-link"
          to="/gscodeexample"
          target="_blank"
          >OPEN CODE IN NEW TAB</router-link
        >
      </div>
    </div>
    <!-- <Dialog
      :header="currentModalHeader"
      v-model:visible="showMoreModal"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <p>{{ currentModalDescription }}</p>
      <br />
      <h3>Tutorial</h3>
      <span v-html="currentModalDetailsHtml"></span>
      <router-link
      v-if="selectedServiceId=='GSHEET'"
        class="mt-4 mb-4 bb-link"
        to="/gscodeexample"
        target="_blank"
        >OPEN CODE IN NEW TAB</router-link
      >
    </Dialog> -->
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
      selectedServiceId: "",
      currentModalHeader: "",
      currentModalDescription: "",
      currentModalDetailsHtml: "",
      showMoreModal: false,
      services: [
        {
          name: "Google Sheets Crypto Prices",
          description:
            "Get real-time crypto prices to your Google Sheets. Available all ETH, BSC and Polygon tokens.",
          id: "GSHEET",
          image: "../assets/logos/gsheet_logo.png",
        },
      ],
    };
  },
  created() {
    this.populateService(this.services[0]);
  },
  computed: {
    openAppScriptImg() {
      return require("../assets/images/bb_gsheet_tut1.png");
    },
  },
  methods: {
    populateService(service) {
      this.selectedServiceId = service.id;
      if (service.id == "GSHEET") {
        this.currentModalHeader = service.name;
        this.currentModalDescription = service.description;
        this.currentModalDetailsHtml = `
          <p>To set up ByBlock's Crypto Prices in your Google Sheets, follow these steps:</p>
          <ol class="ordered-list">
            <li>1. Enable your API key on the API Access page.</li> 
            <li>
              <p>2. In Google Sheets, go to <b>Extentions</b> -> <b>App Script</b></p>
              <img src="./images/bb_gsheet_tut1.png"/>
            </li>
            <li>3. Name the project "ByBlock"</li>
            <li>
              <p>4. Replace the content of the App Script window with the code attached to the bottom of this tutorial.</p>
            </li>
            <li>
              <p>5. Save and run the project</p>
              <img src="./images/bb_gsheet_tut2.png"/>
            </li>
            <li>5.1 Click "Review permissions"</li>
            <li>5.2 Select Google user</li>
            <li>5.3 If there is a warning page, click <b>Advanced</b></li>
            <li>5.4 Click <b>Go to ByBlock</b> -> <b>Allow</b></li>
            <li>6. Exit App Script tab</li>
            <li>7. Refresh your Google Sheet file and click on the new menu item named <b>ByBlock</b></li>
            <img src="./images/bb_gsheet_tut3.png"/>
            <li>7.1. Add your Wallet Address (get from API Access view)</li>
            <li>7.2. Add your API Key (get from API Access view)</li>
            <li>
              8. In the appropriate cell, add the following formula <pre>=BALANCE(chain, baseAddress)</pre> where<br>
              <b>chain</b> is "eth", "bsc" or "polygon" and <b>baseAddress</b> is the contract address of the asset. You can get the correct contract address for the specific chain on coinmarketcap.com
            </li>
            <li>The cell should now show current asset price in USD</li>
          </ol>
          <hr>
          <br>
          <p>Copy the following code to your App Script project window.</p>
          <pre ><iframe src="./examples/bb_gheet_plugin.js" frameborder="0" width="100%" height="300pt" id="gs_example_code"></iframe></pre>

      `;

        ("/n 1.  ");
      } else if (service.id == "BALANCE") {
        this.currentModalHeader = service.name;
        this.currentModalDescription = service.description;
        this.currentModalDetailsHtml = "Lore ipsum";
      } else if (service.id == "ACCOUNTING") {
        this.currentModalHeader = service.name;
        this.currentModalDescription = service.description;
        this.currentModalDetailsHtml = "Lore ipsum";
      }
    },
    getServiceImage(serviceId) {
      if (serviceId == "GSHEET")
        return require("../assets/logos/gsheet_logo.png");
      else if (serviceId == "BALANCE")
        return require("../assets/logos/metamask.jpg");
      else if (serviceId == "ACCOUNTING")
        return require("../assets/logos/byb_black.png");
    },
    showMore(serviceId) {
      console.log("show more | serviceId:", serviceId);
    },
  },
})
export default class Services extends Vue {}
</script>
<style lang="scss">
@use "../assets/css/variables";
@import "../assets/css/global.scss";

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