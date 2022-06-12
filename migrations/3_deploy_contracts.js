var EtherWill = artifacts.require("./EtherWill.sol");
var DeathCertificate = artifacts.require("./DeathCertificate.sol")

module.exports = function(deployer) {
  deployer.deploy(EtherWill).then(function(){
    return deployer.deploy(DeathCertificate, EtherWill.address);
  })
};