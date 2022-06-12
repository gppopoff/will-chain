
console.log('aaaa')
const Web3 = require('web3');

// Enter a Goerli / Ropsten Kovan API URL ;
const web3Utils = require('web3-utils');
// Enter a Goerli / Ropsten Kovan API URL ;
const web3 = new Web3('HTTP://127.0.0.1:7545');

(async () =>  {
    console.log('aaaaa')
    const myAddress = '0x2a8EEcbc860f288Eb45435BF4BeA03cb9cac5a5e';
const toAddress = '0xb6989e86566d99978Fec8E96eC6B15937d380c61';
const amount = web3Utils.toWei('0.001', "Ether");
const maxFeePerGas = web3Utils.toWei('12', "Gwei");
const maxPriorityFeePerGas = web3Utils.toWei('11', "Gwei");
const pkey = '0x0c8c6ca96cd6905406d43b4fe1576e1ce1cfef8cca8d1efd8c9621845ba61b70';
const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');

console.log('bbbbb')
    const transaction = {
        'from': myAddress,
        'to': toAddress,
        'value': amount,
        "gas": "0x2dd4d",
        "maxFeePerGas": "0x1a13b862a",
        "maxPriorityFeePerGas": "0x12a05f200",
        'nonce': nonce,
        // optional data field to send message or execute smart contract
       };
      console.log(transaction)
       const signedTx = await web3.eth.accounts.signTransaction(transaction, '0x0c8c6ca96cd6905406d43b4fe1576e1ce1cfef8cca8d1efd8c9621845ba61b70');
       console.log('cccccc')

       web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
       if (!error) {
         console.log("The hash of your transaction is: ", hash, "\n Check the block explorer!");
         console.log("WEI: "+amount+" sent to this address "+ toAddress)
        } else {
          console.log("Something went wrong while submitting your transaction:", error)
        }
       });
       console.log('dddddd')

})()
