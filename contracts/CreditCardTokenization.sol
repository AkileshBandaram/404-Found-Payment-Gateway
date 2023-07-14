// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";
contract CreditCardTokenization {
  function generateToken(string memory carddata) public pure returns (bytes32) {
    return keccak256(abi.encode(carddata));
  }
}
