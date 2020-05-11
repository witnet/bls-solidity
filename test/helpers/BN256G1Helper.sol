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

  function _bn128_add(uint256[4] memory input)
  public returns (uint256[2] memory result)
  {
    return BN256G1.bn128_add(input);
  }

  function _bn128_multiply(uint256[3] memory input) public returns (uint256[2] memory result) {
    return BN256G1.bn128_multiply(input);
  }
  function _bn128_check_pairing(uint256[12] memory input)
    public returns (bool) {
      return BN256G1.bn128_check_pairing(input);
  }
  function _bn128_check_pairing_batch(uint256[] memory input)
    public returns (bool) {
      return BN256G1.bn128_check_pairing_batch(input);
  }
}
