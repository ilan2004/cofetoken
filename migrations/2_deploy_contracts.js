const MyToken = artifacts.require("MyToken");
const Crowdsale = artifacts.require("Crowdsale");
const MyTokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

module.exports = async function (deployer) {
  const initialSupply = 1000000;
  const rate = 1000;
  const wallet = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"; // Replace with your truffle develop account

  await deployer.deploy(MyToken, initialSupply);
  const tokenInstance = await MyToken.deployed();
  await deployer.deploy(KycContract);
  const kycInstance = await KycContract.deployed();
  await deployer.deploy(Crowdsale, rate, wallet, tokenInstance.address);
  const crowdsaleInstance = await Crowdsale.deployed();
  await deployer.deploy(MyTokenSale, rate, wallet, tokenInstance.address, kycInstance.address);
};