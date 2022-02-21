<template>
  <div class="header">
    
    
    
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      connectMsg: "User initiated connection",
      userIntentToConnect: false,
      disableConnectButton: false,
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
  components: {
    VueMetamask,
  },
  created() {
    let array3 = this.mainButtonOptions.concat(this.wallets);
    console.log(array3);
    this.mainButtonOptions = array3;
  },
  computed: {
    connectedWalletAddress() {
      return this.$store.state.walletModule.publicAddress;
    },
    storedWallets() {
      return this.$store.state.accountModule.storedWallets;
    },
  },
  watch: {
    "storedWallets.length": {
      handler() {
        this.storedWallets.forEach((wallet) => {
          // if (this.connectedWalletAddress != wallet.publicAddress) {
            let walletInList = false;
            let newWalletLabel =
              this.addressShortener(wallet.publicAddress);
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
          // }
        });
      },
    },
  },
  methods: {
    switchActiveWallet(walletData) {
      console.log("switchActiveWallet | walletData:", walletData);
      this.disconnectWallet();
      this.makeWalletActive(walletData);
    },
    addressShortener(address) {
      let partOne = address.substring(0, 5);
      let partTwo = "...";
      let partThree = address.substring(address.length - 5, address.length);
      return partOne + partTwo + partThree;
    },
    disconnectWallet() {
      this.$store.dispatch("walletModule/disconnectWallet");
    },
    connectWallet() {
      this.userIntentToConnect = true; // this will trigger out 3rd party connection library for metamas.
      this.disableConnectButton = true;
    },
    onComplete(data) {
      const walletData = {
        publicAddress: data.metaMaskAddress,
        netId: data.netId,
        type: data.type,
        message: data.message,
      };
      this.makeWalletActive(walletData);
    },
    makeWalletActive(walletData) {
      this.userIntentToConnect = false;
      this.disableConnectButton = false;
      // Save data to store (PS! without this 3rd pary component, store should initiate connection via actions)
      this.$store.dispatch("walletModule/connectWallet", walletData);
    },
  },
};
</script>

<style scoped lang="scss">
@use "../../assets/css/variables";

.flex-10 {
  flex: 0 0 10%;
}

.header {
  position: fixed;
  display: flex;
  width: 100%;
  height: 56px;
  top: 0;
  left: 0;
  background: #ffffff;
  border-bottom: 1px solid variables.$neutral-color-white-dark;
  padding: 14px 60px;
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
  z-index: 1;
}

.logo-container {
  display: flex;
  flex: 0 1 auto;
}


.header-logo {
  height: 50pt;
}
</style>
