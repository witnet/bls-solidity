pragma solidity ^0.6.0;

import "../../contracts/BN256G1.sol";

/**
 * @title Test Helper for the EllipticCurve contract
 * @dev The aim of this contract is twofold:
 * 1. Raise the visibility modifier of contract functions for testing purposes
 * 2. Removal of the `pure` modifier to allow gas consumption analysis
 * @author Witnet Foundation
 */


contract BN256G1Helper {

  function _add(uint256[4] memory input)
  public returns (uint256[2] memory result)
  {
    return BN256G1.add(input);
  }

  function _multiply(uint256[3] memory input) public returns (uint256[2] memory result) {
    return BN256G1.multiply(input);
  }

  function _bn256CheckPairing(uint256[12] memory input) public returns (bool) {

    return BN256G1.bn256CheckPairing(input);
  }

  function _bn256CheckPairingBatch(uint256[] memory input) public returns (bool) {

    return BN256G1.bn256CheckPairingBatch(input);
  }

  function _hashToTryAndIncrement(bytes memory input) public returns (uint256[2] memory result) {
    (result[0], result[1]) = BN256G1.hashToTryAndIncrement(input);
  }
}
