var Ekatra = artifacts.require("./Ekatra.sol");
var GovtEntity = artifacts.require("./GovtEntity.sol");

module.exports = function(deployer) {
  deployer.deploy(Ekatra);
  deployer.deploy(GovtEntity);
};
