const Token = artifacts.require("MyToken");
const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({ path: "../.env" });

contract("Token Test", async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.myToken = await Token.new(process.env.INITIAL_TOKENS);
  });

  it("all tokens should be in my account", async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    let balance = await instance.balanceOf(deployerAccount);
    expect(balance).to.be.a.bignumber.equal(totalSupply);
  });

  it("is possible to send tokens between accounts", async () => {
    const sendTokens = new BN(1);
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    let initialBalance = await instance.balanceOf(deployerAccount);
    expect(initialBalance).to.be.a.bignumber.equal(totalSupply);
    await instance.transfer(recipient, sendTokens, { from: deployerAccount });
    expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(totalSupply.sub(sendTokens));
    expect(await instance.balanceOf(recipient)).to.be.a.bignumber.equal(sendTokens);
  });

  it("is not possible to send more tokens than available in total", async () => {
    let instance = this.myToken;
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);
    try {
      await instance.transfer(recipient, balanceOfDeployer.add(new BN(1)), { from: deployerAccount });
      expect.fail("The transfer should have failed");
    } catch (error) {
      expect(error.message).to.include("revert");
    }
    expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(balanceOfDeployer);
    expect(await instance.balanceOf(recipient)).to.be.a.bignumber.equal(new BN(0));
  });
});