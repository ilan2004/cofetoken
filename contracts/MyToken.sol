// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        // Convert to proper decimal places (18 is standard for ERC20)
        _mint(msg.sender, initialSupply * 10**18);
    }
}