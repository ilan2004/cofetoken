// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale {

    KycContract public kyc;

    event KycContractUpdated(address indexed oldKyc, address indexed newKyc);

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
        Crowdsale(rate, wallet, token)
    {
        require(address(_kyc) != address(0), "MyTokenSale: KYC contract is the zero address");
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(msg.sender), "MyTokenSale: KYC not completed, purchase not allowed");
    }

    /**
     * @dev Allows owner to update the KYC contract address
     * @param _kyc New KYC contract address
     */
    function updateKycContract(KycContract _kyc) external {
        // Note: Add access control here if needed (e.g., onlyOwner modifier)
        require(address(_kyc) != address(0), "MyTokenSale: KYC contract is the zero address");
        
        address oldKyc = address(kyc);
        kyc = _kyc;
        
        emit KycContractUpdated(oldKyc, address(_kyc));
    }

    /**
     * @dev Returns the current KYC contract address
     */
    function getKycContract() external view returns (address) {
        return address(kyc);
    }
}