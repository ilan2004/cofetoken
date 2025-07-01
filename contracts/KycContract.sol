// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) private allowed;
    
    event KycCompleted(address indexed user);
    event KycRevoked(address indexed user);

    constructor() Ownable(msg.sender) {}

    function setKycCompleted(address _addr) public onlyOwner {
        require(_addr != address(0), "KycContract: address is the zero address");
        allowed[_addr] = true;
        emit KycCompleted(_addr);
    }

    function setKycRevoked(address _addr) public onlyOwner {
        require(_addr != address(0), "KycContract: address is the zero address");
        allowed[_addr] = false;
        emit KycRevoked(_addr);
    }

    function kycCompleted(address _addr) public view returns(bool) {
        return allowed[_addr];
    }
}