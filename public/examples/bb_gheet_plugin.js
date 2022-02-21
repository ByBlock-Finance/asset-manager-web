/**
 * CODE LICENSED UNDER THE CREATIVE COMMON BY-NC-ND LICENSE.
 * https://creativecommons.org/licenses/by-nc-nd/4.0/
 * 
 * Copyright 2021 by byblock.finance
 */


/**
 * @OnlyCurrentDoc
 */
 function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('ByBlock')
        .addItem('Enter Wallet Address', 'OpenWalletModal')
        .addSeparator()
        .addItem('Enter API Key', 'OpenApiModal')
        .addSeparator()
        .addItem('Documentation', 'OpenDocModal')
        .addToUi();  
  }
  
  
  /**
   * @OnlyCurrentDoc
   */
  function OpenApiModal() {
    var ui = SpreadsheetApp.getUi();
    var userProperties = PropertiesService.getUserProperties();
    var api_key = userProperties.getProperty("BBAPIKEY")
  
    if (api_key) {
      var result = ui.prompt('Enter ByBlock API Key',
                             '✅ Your API '+ api_key +' key is already set.\n\nYou can re-enter it below to override its current value:',
                             ui.ButtonSet.OK_CANCEL);
    }
    else {
      var result = ui.prompt('Enter ByBlock Public API Key',
                             'You can get an API key by connecting your Metamask wallet to assets.byblock.finance page.\n\nEnter your API key below:',
                             ui.ButtonSet.OK_CANCEL);  
    }
    
    var button = result.getSelectedButton();
    var user_input = result.getResponseText().replace(/\s+/g, '');
    if (button == ui.Button.OK) {
      if (user_input && user_input == "__DELETE__") {
        userProperties.deleteProperty("BBAPIKEY");
        ui.alert('API Key Removed',
                 'Your API Key has been sucessfully removed.'
                 ,ui.ButtonSet.OK);
      }
      else if (user_input && (user_input.length > 50)) {
        userProperties.setProperty("BBAPIKEY", user_input);
        ui.alert('API Key successfully saved',
                 'You can get an API key by connecting your Metamask wallet to assets.byblock.finance page.\n\nContact support@byblock.finance if you have any question.'
                 ,ui.ButtonSet.OK);
      }
      else if (user_input) {
        ui.alert('API Key not valid',
                 'The API Key you entered appears to be not valid or not enabled.\nIf you believe this is an error, contact support@byblock.finance.'
                 ,ui.ButtonSet.OK);
      }
    }
  }
  
  
  /**
   * @OnlyCurrentDoc
   */
  function OpenWalletModal() {
    var ui = SpreadsheetApp.getUi();
    var userProperties = PropertiesService.getUserProperties();
    var wallet_adr = userProperties.getProperty("BBWALLETADDRESS")
  
    if (wallet_adr) {
      var result = ui.prompt('Enter your wallet address connected with the API',
                             '✅ Your wallet address '+ wallet_adr +' is already set.\n\nYou can re-enter it below to override its current value:',
                             ui.ButtonSet.OK_CANCEL);
    }
    else {
      var result = ui.prompt('Enter your wallet address connected with the API',
                             'When aquiring the API key, you can see which wallet it is connected to over at the API access page at assets.byblock.finance page.\n\n Enter your public wallet address below:',
                             ui.ButtonSet.OK_CANCEL);  
    }
    
    var button = result.getSelectedButton();
    var user_input = result.getResponseText().replace(/\s+/g, '');
    if (button == ui.Button.OK) {
      if (user_input && user_input == "__DELETE__") {
        userProperties.deleteProperty("BBWALLETADDRESS");
        ui.alert('Wallet address removed',
                 'Your wallet address has been sucessfully removed.'
                 ,ui.ButtonSet.OK);
      }
      else if (user_input && (user_input.length == 42)) {
        userProperties.setProperty("BBWALLETADDRESS", user_input);
        ui.alert('Wallet address successfully saved',
                 'When aquiring the API key, you can see which wallet it is connected to over at the API access page at assets.byblock.finance page. Contact support if you have any question.'
                 ,ui.ButtonSet.OK);
      }
      else if (user_input) {
        ui.alert('Wallet address not valid',
                 'The address you entered appears to be not valid.\nIf you believe this is an error, contact support@byblock.finance.'
                 ,ui.ButtonSet.OK);
      }
    }
  }
  
  
  /**
   * @OnlyCurrentDoc
   */
  function OpenDocModal() {
    var ui = SpreadsheetApp.getUi()
    ui.alert("Documentation and Info",
             'Official website: https://byblock.finance\n\
              Documentation: https://byblock.finance/docs/\n\
              Guide: https://guides.byblock.finance/google-sheets-plugin#how-do-i-get-started\n\
              Support email: support@byblock.finance',
              ui.ButtonSet.OK)
  }
  
  /**
   * Returns cryptocurrencies price and other info.
   */
  function BYBLOCK(chain, baseAddress, option, refresh_cell) {
  
    // Sanitize
    var chain = (chain+"") || "";
    var baseAddress = (baseAddress+"") || "";
    var option = (option+"") || "";
  
    // Get user anonymous token (https://developers.google.com/apps-script/reference/base/session#getTemporaryActiveUserKey())
    // Mandatory to authenticate request origin
    var GSUUID = encodeURIComponent(Session.getTemporaryActiveUserKey());
    // Get Data Availability Service and Historical Plan API Keys, if any
    var userProperties = PropertiesService.getUserProperties();
    var APIKEY = userProperties.getProperty("BBAPIKEY") || "";
    var WALLETADDRESS = userProperties.getProperty("BBWALLETADDRESS") || "";
    
    // Fetch data
    try {
  
      var data = {};
      var CACHE_KEY = "CF__"+ chain.toLowerCase() + "_" + baseAddress.toLowerCase() + "_" + option.toLowerCase();
      // First check if we have a cached version
      var cache = CacheService.getUserCache();
      var cached = cache.get(CACHE_KEY);
      if (cached && cached != null && cached.length > 1) {
        data = JSON.parse(cached)
      }
      // Else, fetch it from API and cache it
      else {
        var url = "https://europe-central2-abms-284306.cloudfunctions.net/api/token/meta?chain="+chain+"&baseAddress="+baseAddress+"&apiKey="+APIKEY+"&walletAddress="+WALLETADDRESS+"&quote=usdt"
        var response = UrlFetchApp.fetch(url)
        
        var responseAsString = response.getContentText()
        data = JSON.parse(responseAsString)
     
        if (responseAsString) cache.put(CACHE_KEY, responseAsString, 60)
      }
  
      // Return with the proper type
      var out = "-";
      if (data["priceInUsd"]) {
        out = parseFloat(data["priceInUsd"]);
      }
      return out;
    }
  
    catch (e) {
      var msg = e.message
      console.log("err:", JSON.stringify(e))
      throw new Error("Something is not right")
    }
  }