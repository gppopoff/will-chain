App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  //   initContract: function() {
  //     $.getJSON("Election.json", function(election) {
  //       // Instantiate a new truffle contract from the artifact
  //       App.contracts.Election = TruffleContract(election);
  //       // Connect provider to interact with contract
  //       App.contracts.Election.setProvider(App.web3Provider);

  //       App.listenForEvents();

  //       return App.render();
  //     });
  //   },

  initContracts: function () {
    $.getJSON("DeathCertificate.json", function (certificate) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.DeathCertificate = TruffleContract(certificate);
      // Connect provider to interact with contract
      App.contracts.DeathCertificate.setProvider(App.web3Provider);

      // App.listenForEvents();

      // return App.render();
    });

    $.getJSON("EtherWill.json", function (will) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.EtherWill = TruffleContract(will);
      // Connect provider to interact with contract
      App.contracts.EtherWill.setProvider(App.web3Provider);

      // App.listenForEvents();

      // return App.render();
    });

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  //   castVote: function() {
  //     var candidateId = $('#candidatesSelect').val();
  //     App.contracts.Election.deployed().then(function(instance) {
  //       return instance.vote(candidateId, { from: App.account });
  //     }).then(function(result) {
  //       // Wait for votes to update
  //       $("#content").hide();
  //       $("#loader").show();
  //     }).catch(function(err) {
  //       console.error(err);
  //     });
  //   },

  announceDeath: function() {
    const passedAawayNIN = $('#passed-away-nin').val();
    const announcerNIN = $('#announcer-nin').val();
    const doctorNIN = $('#doctor-nin').val();

    App.contracts.DeathCertificate.deployed().then(function (instance) {
      return instance.announceDeath(announcerNIN, passedAawayNIN, doctorNIN, { from: App.account });
    });
  },

  registerAccount: function() {
    const nin = $('#register-personalNIN-input').val();

    App.contracts.EtherWill.deployed().then(function (instance) {
      return instance.register(nin, { from: App.account });
    });
  },
  
  viewMyWills: function() {
    App.contracts.EtherWill.deployed().then(async function (instance) {
      const a = await instance.getMyWillTo({ from: App.account });
      const b = await instance.getMyWillAmount({ from: App.account });
      console.log("RES", a)
      for(let i = 0; i < b.length; i++) { 
        console.log("RES2", b[i].toString(10))
      }
    });
  },

  createWill: function() {
    const personalNIN = $('#create-personal-nin').val();
    const address0 = $('#destination-addr-0').val();
    const amount0 = $('#amount-0').val();

    App.contracts.EtherWill.deployed().then(async function(instance) {
      await instance.createWillUI(personalNIN, [address0], [amount0], {from: App.account, value: amount0 * 1000000000000000000});
    })
  },

  deleteWill: function() {
    const personalNIN = $('#delete-personal-nin').val();
    const address = $('#delete-address').val();
    App.contracts.EtherWill.deployed().then(async function(instance) {
      await instance.deleteWillTo(personalNIN, address, {from: App.account, gas: 6500000});
    })
  },

  addInstitutionAddr: function() {
    const address = $('#certified-institution-addr-imput').val()
    App.contracts.DeathCertificate.deployed().then(async function(instance) {
      await instance.addCertifiedInstitution(address, {from: App.account}); //todo add field value
    });
  },
  
};

function addEventListeners() {
  $('#announce-death').click(App.announceDeath)
  $('#register-account').click(App.registerAccount)
  $('#view-my-wills').click(App.viewMyWills)
  $('#create-will').click(App.createWill)
  $('#delete-will').click(App.deleteWill)
  $('#add-institution-addr').click(App.addInstitutionAddr)
}

$(function () {
  $(window).load(function () {
    App.init();
    addEventListeners();
  });
});