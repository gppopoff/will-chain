const { default: Web3 } = require("web3");
const { isTopic } = require("web3-utils");

var EtherWill = artifacts.require("./EtherWill.sol");
var DeathCertificate = artifacts.require("./DeathCertificate.sol")

contract("DeathCertificate", function(accounts) {
    var electionInstance;
  
    it("MainFlow", function() {
        return EtherWill.deployed().then(function(instance){
            return DeathCertificate.deployed(instance.address).then( async function(ii){
                console.log("DC address: " + ii.address);
                console.log("DC balance: " + await web3.eth.getBalance(ii.address))
                console.log("Wills address: " + instance.address)
                console.log("Wills balance: " + await web3.eth.getBalance(instance.address))

                let accounts = await web3.eth.getAccounts() 
                // console.log("Accounts with ethers: \n"+ accounts)
                console.log("Address[0] balance: "+ await web3.eth.getBalance(accounts[0]));
                console.log("Address[1] balance: "+ await web3.eth.getBalance(accounts[1]));
                
                await instance.register('1234', {from: accounts[0]});
                assert.equal(await instance.amIReggistered('1234'), true);
                console.log('Is 1234 registered: ' + await instance.amIReggistered('1234'))
                await instance.createWill('1234', [{to: accounts[1], amount:3}], {from: accounts[0], value: 3000000000000000000} )
                console.log(await instance.getMyWill({from: accounts[0]}));

                console.log("DC address: " + ii.address);
                console.log("DC balance: " + await web3.eth.getBalance(ii.address))
                console.log("Wills address: " + instance.address)
                console.log("Wills balance: " + await web3.eth.getBalance(instance.address))

                // await instance.setDeathSertificateAddr(ii.address);
                // await instance.setDeathSertificateAddr(accounts[0]);
                // await instance.executeWills('1234');
                await ii.addCertifiedInstitution(accounts[0]);
                await ii.announceDeath({announcer: {NIN: '4321'}, dead: {NIN: '1234'}, doctor: {NIN: '0000'}})

                
                console.log(await instance.getMyWill({from: accounts[0]}));
                console.log("Address[0] balance: "+ await web3.eth.getBalance(accounts[0]));
                console.log("Address[1] balance: "+ await web3.eth.getBalance(accounts[1]));
                console.log("DC address: " + ii.address);
                console.log("DC balance: " + await web3.eth.getBalance(ii.address))
                console.log("Wills address: " + instance.address)
                console.log("Wills balance: " + await web3.eth.getBalance(instance.address))
            });
        })
    })

   
});

contract("Ebi se", function() {
    it("MainFlow", function() {
        return EtherWill.deployed().then(async function(instance){
                console.log("-------------------------------------------------------------------------")
                console.log("Wills address: " + instance.address)
                console.log("Wills balance: " + await web3.eth.getBalance(instance.address))

                let accounts = await web3.eth.getAccounts() 
                // console.log("Accounts with ethers: \n"+ accounts)
                console.log("Address[0] balance: "+ await web3.eth.getBalance(accounts[4]));
                
                await instance.register('2222', {from: accounts[4]});
                console.log('Is 2222 registered: ' + await instance.amIReggistered('2222'))
                // await instance.createWill('2222', [{to: accounts[1], amount:1}], {from: accounts[4], value: 1000000000000000000} )
                await instance.createWill('2222', [{to: accounts[2], amount:1}], {from: accounts[4], value: 1000000000000000000} )
                // await instance.createWill('2222', [{to: accounts[3], amount:1}], {from: accounts[4], value: 1000000000000000000} )
                await instance.createWill('2222', [{to: accounts[2], amount:1}], {from: accounts[4], value: 1000000000000000000} )
                console.log(await instance.getMyWill({from: accounts[4]}));

                console.log("Wills address: " + instance.address)
                console.log("Wills balance: " + await web3.eth.getBalance(instance.address))

                await instance.deleteWillTo('2222', accounts[2], {from: accounts[4]} )
                
                console.log(await instance.getMyWill({from: accounts[4]}));
                console.log("Address[0] balance: "+ await web3.eth.getBalance(accounts[4]));
                console.log("Wills address: " + instance.address)
                console.log("Wills balance: " + await web3.eth.getBalance(instance.address))
        })
    })
})


