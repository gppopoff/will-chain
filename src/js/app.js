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
      const a = await instance.getMyWill({ from: App.account });
      console.log("RES", a.toString(10))
    });
  },

  

  //   listenForEvents: function() {
  //     App.contracts.Election.deployed().then(function(instance) {
  //       instance.votedEvent({}, {
  //         fromBlock: 0,
  //         toBlock: 'latest'
  //       }).watch(function(error, event) {
  //         console.log("event triggered", event)
  //         // Reload when a new vote is recorded
  //         App.render();
  //       });
  //     });
  //   },

  // render: function () {
  //   var electionInstance;
  //   var loader = $("#loader");
  //   var content = $("#content");

  //   loader.show();
  //   content.hide();

  //   // Load contract data
  //   App.contracts.Election.deployed().then(function (instance) {
  //     electionInstance = instance;
  //     return electionInstance.candidatesCount();
  //   }).then(function (candidatesCount) {
  //     var candidatesResults = $("#candidatesResults");
  //     candidatesResults.empty();

  //     var candidatesSelect = $('#candidatesSelect');
  //     candidatesSelect.empty();

  //     for (var i = 1; i <= candidatesCount; i++) {
  //       electionInstance.candidates(i).then(function (candidate) {
  //         var id = candidate[0];
  //         var name = candidate[1];
  //         var voteCount = candidate[2];

  //         // Render candidate Result
  //         var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
  //         candidatesResults.append(candidateTemplate);

  //         // Render candidate ballot option
  //         var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
  //         candidatesSelect.append(candidateOption);
  //       });
  //     }
  //     return electionInstance.voters(App.account);
  //   }).then(function (hasVoted) {
  //     // Do not allow a user to vote
  //     if (hasVoted) {
  //       $('form').hide();
  //     }
  //     loader.hide();
  //     content.show();
  //   }).catch(function (error) {
  //     console.warn(error);
  //   });
  // }
};

function addEventListeners() {
  $('#announce-death').click(App.announceDeath)
  $('#register-account').click(App.registerAccount)
  $('#view-my-wills').click(App.viewMyWills)
}

$(function () {
  $(window).load(function () {
    App.init();
    addEventListeners();
  });
});