pragma solidity ^0.6.0;

import "../contracts/BN256G1.sol";

/**
 * @title Test Helper for the BM256G1 contract
 * @dev The aim of this contract is twofold:
 * 1. Raise the visibility modifier of contract functions for testing purposes
 * 2. Removal of the `pure` modifier to allow gas consumption analysis
 * @author Witnet Foundation
 */
 
contract BN256G1Helper {

  function _add(uint256[4] memory input) public returns (uint256[2] memory result)
  {
    (result[0], result[1]) = BN256G1.add(input);
  }

  function _multiply(uint256[3] memory input) public returns (uint256[2] memory result) {
    (result[0], result[1]) = BN256G1.multiply(input);
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

  function _isOnCurveSubsidized(uint256[2] memory point) public returns (bool) {
     bool valid;
    // checks if the given point is a valid point from the first elliptic curve group
    uint256[4] memory input = [
      point[0],
      point[1],
      1,
      2];

    assembly {
      // 0x06     id of the isOnCurve precompile
      // 0        number of ether to transfer
      // 128      size of call parameters, i.e. 128 bytes total
      // 64       size of call return value, i.e. 64 bytes / 512 bit for a BN256 curve point
      valid := call(not(0), 0x06, 0, input, 128, input, 64)
    }
    return valid;
  }

  function _isOnCurve(uint256[2] memory input) public returns (bool) {
    return BN256G1.isOnCurve(input);
  }
}
