import React, { Component } from "react";
import { Wallet, Shield, Coffee, AlertCircle, CheckCircle, Loader } from "lucide-react";
import './App.css'
import MyTokenContract from "./contracts/MyToken.json";
import MyTokenSaleContract from "./contracts/MyTokenSale.json";
import KycContractArtifact from "./contracts/KycContract.json";
import Web3 from "web3";
import TruffleContract from "@truffle/contract";
import getWeb3 from "./getWeb3";

const MyToken = TruffleContract(MyTokenContract);
const MyTokenSale = TruffleContract(MyTokenSaleContract);
const KycContract = TruffleContract(KycContractArtifact);

class App extends Component {
  state = { 
    loaded: false, 
    kycAddress: "", 
    tokenSaleAddress: null,
    userTokens: 0,
    kycStatus: false,
    isLoading: false,
    txHash: "",
    notification: null,
    networkError: false
  };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      const networkId = await this.web3.eth.net.getId();
      MyToken.setProvider(this.web3.currentProvider);
      MyTokenSale.setProvider(this.web3.currentProvider);
      KycContract.setProvider(this.web3.currentProvider);
      try {
        this.tokenInstance = await MyToken.deployed();
        this.tokenSaleInstance = await MyTokenSale.deployed();
        this.kycInstance = await KycContract.deployed();
        this.listenToTokenTransfer();
        await this.updateUserTokens();
        await this.updateKycStatus();
        this.setState({ 
          loaded: true,
          tokenSaleAddress: this.tokenSaleInstance.address 
        });
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', async (accounts) => {
            this.accounts = accounts;
            await this.updateUserTokens();
            await this.updateKycStatus();
          });
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        }
        const expectedNetworkId = '5777';
        const currentNetworkId = await this.web3.eth.net.getId();
        if (currentNetworkId.toString() !== expectedNetworkId) {
          this.showNotification(`Please connect to the correct network. Expected network ID: ${expectedNetworkId}`, "error");
          this.setState({ networkError: true });
        }
      } catch (error) {
        console.error("Contract deployment error:", error);
        this.showNotification(
          `Failed to load contracts. Are you connected to the correct network?`,
          "error"
        );
        this.setState({ loaded: true, networkError: true });
      }
    } catch (error) {
      this.showNotification(
        `Failed to load web3, accounts, or contract. Check console for details.`,
        "error"
      );
      console.error(error);
      this.setState({ loaded: true, networkError: true });
    }
  };

  updateUserTokens = async () => {
    try {
      if (!this.tokenInstance || !this.accounts || this.accounts.length === 0) return;
      const userTokens = await this.tokenInstance.balanceOf(this.accounts[0]);
      this.setState({ userTokens: this.web3.utils.fromWei(userTokens.toString(), 'ether') });
    } catch (error) {
      console.error("Error updating user tokens:", error);
    }
  };

  updateKycStatus = async () => {
    try {
      if (!this.kycInstance || !this.accounts || this.accounts.length === 0) return;
      const kycStatus = await this.kycInstance.kycCompleted(this.accounts[0]);
      this.setState({ kycStatus });
    } catch (error) {
      console.error("Error updating KYC status:", error);
    }
  };

  listenToTokenTransfer = () => {
    if (!this.tokenInstance || !this.accounts || this.accounts.length === 0) return;
    this.tokenInstance.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens);
  }

  handleBuyTokens = async () => {
    if (!this.state.kycStatus) {
      this.showNotification("Please complete KYC verification first", "error");
      return;
    }

    this.setState({ isLoading: true });
    try {
      // Verify KYC status on-chain
      const isWhitelisted = await this.kycInstance.kycCompleted(this.accounts[0]);
      if (!isWhitelisted) {
        this.showNotification("Account not KYC whitelisted on-chain", "error");
        return;
      }

      // Check Crowdsale contract's token balance
      const tokenAddress = await this.tokenSaleInstance.token();
      const token = new this.web3.eth.Contract(MyTokenContract.abi, tokenAddress);
      const rate = await this.tokenSaleInstance.rate();
      const tokensNeeded = this.web3.utils.toWei("1", "ether") * rate;
      const balance = await token.methods.balanceOf(this.tokenSaleInstance.address).call();
      if (balance < tokensNeeded) {
        this.showNotification(`Insufficient tokens in contract. Available: ${this.web3.utils.fromWei(balance, "ether")} CAPPU`, "error");
        return;
      }

      // Check if wallet address can receive ETH
      const wallet = await this.tokenSaleInstance.wallet();
      const walletCode = await this.web3.eth.getCode(wallet);
      if (walletCode !== "0x") {
        this.showNotification("Warning: Wallet may not accept ETH", "error");
      }

      // Verify transaction data
      const txData = this.tokenSaleInstance.buyTokens(this.accounts[0]).encodeABI();
      const weiAmount = this.web3.utils.toWei("1", "ether");
      console.log("Transaction data:", {
        from: this.accounts[0],
        to: this.tokenSaleInstance.address,
        value: this.web3.utils.toHex(weiAmount),
        data: txData,
        gas: "500000",
      });

      // Execute buyTokens using modern MetaMask API
      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: this.accounts[0],
          to: this.tokenSaleInstance.address,
          value: this.web3.utils.toHex(weiAmount), // Ensure value is in hex
          data: txData,
          gas: this.web3.utils.toHex(500000), // Ensure gas is in hex
        }],
      });

      this.setState({ txHash: tx });
      this.showNotification(`Tokens purchased successfully! Transaction: ${tx}`, "success");
      await this.updateUserTokens();
    } catch (error) {
      this.showNotification("Transaction failed. Check console for details.", "error");
      console.error("Transaction error:", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fundCrowdsaleContract = async (amount) => {
    try {
      const tokenAddress = await this.tokenSaleInstance.token();
      const token = new this.web3.eth.Contract(MyTokenContract.abi, tokenAddress);
      const tokenAmount = this.web3.utils.toWei(amount.toString(), "ether");

      await token.methods.transfer(this.tokenSaleInstance.address, tokenAmount).send({
        from: this.accounts[0], // Must be token owner or have tokens
        gas: "100000",
      });

      this.showNotification(`Funded contract with ${amount} CAPPU`, "success");
    } catch (error) {
      this.showNotification("Failed to fund contract", "error");
      console.error(error);
    }
  };

  handleKycWhitelisting = async () => {
    if (!this.state.kycAddress || !this.web3.utils.isAddress(this.state.kycAddress)) {
      this.showNotification("Please enter a valid Ethereum address", "error");
      return;
    }

    this.setState({ isLoading: true });
    try {
      await this.kycInstance.setKycCompleted(this.state.kycAddress, { from: this.accounts[0] });
      this.showNotification(`KYC completed for ${this.state.kycAddress}`, "success");
      this.setState({ kycAddress: "" });
      if (this.state.kycAddress.toLowerCase() === this.accounts[0].toLowerCase()) {
        await this.updateKycStatus();
      }
    } catch (error) {
      this.showNotification("KYC whitelisting failed. Please try again.", "error");
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  showNotification = (message, type) => {
    this.setState({notification: {message, type}});
    setTimeout(() => {
      this.setState({notification: null});
    }, 5000);
  }

  formatAddress = (address) => {
    if (!address) return "Not connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    if (!this.state.loaded) {
      return (
        <div className="app-container loading-container">
          <div className="loading-content">
            <Loader className="loading-spinner" />
            <p className="loading-text">Loading Web3, accounts, and contracts...</p>
          </div>
        </div>
      );
    }

    const { notification, kycStatus, userTokens, kycAddress, isLoading, tokenSaleAddress } = this.state;

    return (
      <div className="app-container">
        {notification && (
          <div className={`notification ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
            {notification.type === 'success' ? 
              <CheckCircle className="notification-icon" /> : 
              <AlertCircle className="notification-icon" />
            }
            <span>{notification.message}</span>
          </div>
        )}

        <div className="container">
          <div className="header">
            <div className="header-title">
              <Coffee className="header-icon" />
              <h1>CofeToken</h1>
            </div>
            <h2 className="header-subtitle">Cappuccino Token Sale</h2>
            <p className="header-description">
              Join the coffee revolution! Get your premium CAPPU tokens and enjoy exclusive benefits.
            </p>
          </div>

          <div className="cards-grid">
            <div className="card">
              <div className="card-header">
                <Wallet className="card-icon card-icon-blue" />
                <h3>Account Information</h3>
              </div>
              
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Your Address:</span>
                  <span className="info-value info-mono">
                    {this.accounts && this.accounts[0] ? this.formatAddress(this.accounts[0]) : "Not connected"}
                  </span>
                
                  <span className="detail-value detail-mono">
                    {tokenSaleAddress ? this.formatAddress(tokenSaleAddress) : "Not available"}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">KYC Status:</span>
                  <div className="status-container">
                    {kycStatus ? (
                      <>
                        <CheckCircle className="status-icon status-icon-green" />
                        <span className="status-text status-verified">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="status-icon status-icon-red" />
                        <span className="status-text status-not-verified">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="info-item info-item-highlight">
                  <span className="info-label">CAPPU Balance:</span>
                  <span className="balance-value">{userTokens} CAPPU</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <Shield className="card-icon card-icon-green" />
                <h3>KYC Verification</h3>
              </div>
              
              <p className="card-description">
                Add Ethereum addresses to the whitelist for token purchases.
              </p>
              
              <div className="form-group">
                <input
                  type="text"
                  name="kycAddress"
                  value={kycAddress}
                  onChange={this.handleInputChange}
                  placeholder="0x1234567890123456789012345678901234567890"
                  className="input-field"
                />
                
                <button
                  type="button"
                  onClick={this.handleKycWhitelisting}
                  disabled={isLoading || !kycAddress}
                  className="btn btn-green"
                >
                  {isLoading ? (
                    <Loader className="btn-icon btn-spinner" />
                  ) : (
                    <Shield className="btn-icon" />
                  )}
                  Add to Whitelist
                </button>
              </div>
            </div>

            <div className="card card-full-width">
              <div className="card-header">
                <Coffee className="card-icon card-icon-amber" />
                <h3>Purchase CAPPU Tokens</h3>
              </div>

              {!kycStatus && (
                <div className="alert alert-error">
                  <div className="alert-header">
                    <AlertCircle className="alert-icon" />
                    <p className="alert-title">KYC verification required</p>
                  </div>
                  <p className="alert-message">
                    Please complete KYC verification by adding your address to the whitelist above.
                  </p>
                </div>
              )}

              <div className="purchase-container">
                <div className="purchase-details">
                  <h4 className="details-title">Token Sale Details</h4>
                  <div className="details-list">
                    <div className="detail-item">
                      <span className="detail-label">Price per Token:</span>
                      <span className="detail-value">1 WEI = 1 CAPPU</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Minimum Purchase:</span>
                      <span className="detail-value">1 ETH</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Contract Address:</span>
                      <span className="detail-value detail-mono">{this.formatAddress(tokenSaleAddress)}</span>
                    </div>
                  </div>
                </div>

                <div className="purchase-action">
                  <button
                    type="button"
                    onClick={this.handleBuyTokens}
                    disabled={!kycStatus || isLoading}
                    className="btn btn-amber btn-large"
                  >
                    {isLoading ? (
                      <Loader className="btn-icon btn-spinner" />
                    ) : (
                      <Coffee className="btn-icon" />
                    )}
                    Buy Tokens (1 ETH)
                  </button>
                  <button
                    type="button"
                    onClick={() => this.fundCrowdsaleContract(1000)}
                    disabled={isLoading}
                    className="btn btn-green"
                  >
                    {isLoading ? (
                      <Loader className="btn-icon btn-spinner" />
                    ) : (
                      <Coffee className="btn-icon" />
                    )}
                    Fund Contract
                  </button>
                  {kycStatus && (
                    <p className="purchase-note">
                      This will purchase tokens with 1 ETH from your connected wallet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="footer">
            <p>© 2025 CafeToken Token Sale. Built with Web3 & React.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;