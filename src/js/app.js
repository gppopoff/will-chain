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

  announceDeath: function () {
    const passedAawayNIN = $('#passed-away-nin').val();
    const announcerNIN = $('#announcer-nin').val();
    const doctorNIN = $('#doctor-nin').val();

    App.contracts.DeathCertificate.deployed().then(function (instance) {
      return instance.announceDeathUI(announcerNIN, passedAawayNIN, doctorNIN, { from: App.account });
    });
  },

  registerAccount: function () {
    const nin = $('#register-personalNIN-input').val();

    App.contracts.EtherWill.deployed().then(function (instance) {
      return instance.register(nin, { from: App.account });
    });
  },

  viewMyWills: function () {
    App.contracts.EtherWill.deployed().then(async function (instance) {
      const targets = await instance.getMyWillTo({ from: App.account });
      const amounts = await instance.getMyWillAmount({ from: App.account });
      
      const wills = targets.map((target, index) => {
        const amount = amounts[index].toString(10);
        console.log("AMOUNT", amount);
        return amount > 0 ? { target, amount } : null;
      }).filter(will => will !== null);

      const willsContainer = document.getElementById('wills-list-container');

      willsContainer.innerHTML = '';

      wills.forEach(will => {
        const willElement = document.createElement('div');
        willElement.classList.add('row');

        const valueElement = document.createElement('div');
        const targetElement = document.createElement('div');

        targetElement.classList.add('col-md-6', 'will-content');
        valueElement.classList.add('col-md-2', 'will-content');

        targetElement.textContent = `to: ${will.target}`;
        valueElement.textContent = `value: ${will.amount} ETH`;

        willElement.appendChild(targetElement);
        willElement.appendChild(valueElement);
        willsContainer.appendChild(willElement)
      })
    });
  },

  createWill: function () {
    const clauseRows = document.getElementsByClassName('clause-row');

    const targets = [...clauseRows].map(row => row.children[0].firstChild.value);
    const values = [...clauseRows].map(row => parseFloat(row.children[1].firstChild.value));


    const totalAmount = values.reduce((sum, amount) => {
      console.log("AMOUNT", amount)

      sum += amount;
      return sum
    }, 0);

    console.log("TOTAL AMOUNT", totalAmount);

    const personalNIN = $('#create-personal-nin').val();

    App.contracts.EtherWill.deployed().then(async function (instance) {
      await instance.createWillUI(personalNIN, targets , values, { from: App.account, value: totalAmount * 1000000000000000000 });
    })
  },

  deleteWill: function () {
    const personalNIN = $('#delete-personal-nin').val();
    const address = $('#delete-address').val();
    App.contracts.EtherWill.deployed().then(async function (instance) {
      await instance.deleteWillTo(personalNIN, address, { from: App.account });
    })
  },

  addInstitutionAddr: function () {
    const address = $('#certified-institution-addr-imput').val()
    App.contracts.DeathCertificate.deployed().then(async function (instance) {
      await instance.addCertifiedInstitution(address, { from: App.account }); //todo add field value
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