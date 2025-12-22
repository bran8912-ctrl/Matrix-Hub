// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 Matrix-HubCoin (MTX)
  Utility token for the Matrix-Hub ecosystem.
   No minting. No taxes. No admin privileges.
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MatrixHubCoin is ERC20, Ownable {
    // Max supply is fixed at deployment
    uint256 public immutable MAX_SUPPLY;

    constructor(uint256 initialSupply) ERC20("Matrix-HubCoin", "MTX") Ownable(msg.sender) {
        MAX_SUPPLY = initialSupply * 10 ** decimals();
        _mint(msg.sender, MAX_SUPPLY);
    }

    /*
     Burn function (optional utility)
     Allows users to permanently destroy MTX
    */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
