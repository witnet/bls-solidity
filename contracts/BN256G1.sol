// SPDX-License-Identifier: MIT

pragma solidity >=0.5.3 <0.7.0;

import "elliptic-curve-solidity/contracts/EllipticCurve.sol";


/**
 * @title BN256G1 Curve Library
 * @dev Library providing arithmetic operations over G1 in bn256.
 * Provides additional methods like pairing and pairing_batch
 * Heavily influenced by https://github.com/PhilippSchindler/ethdkg
 * Calls to assembly are public and not external because assembly cannot be applied on calldata
 * @author Witnet Foundation
 */

library BN256G1 {

  // Generator coordinate `x` of the EC curve
  uint256 public constant GX = 1;
  // Generator coordinate `y` of the EC curve
  uint256 public constant GY = 2;
  // Constant `a` of EC equation
  uint256 internal constant AA = 0;
  // Constant `b` of EC equation
  uint256 internal constant BB = 3;
  // Prime number of the curve
  uint256 internal constant PP = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47;
  // Order of the curve
  uint256 internal constant NN = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001;

  /// This is 0xf1f5883e65f820d099915c908786b9d3f58714d70a38f4c22ca2bc723a70f263, the last mulitple of the modulus before 2^256
  uint256 internal constant LAST_MULTIPLE_OF_PP_LOWER_THAN_2_256 = 0xf1f5883e65f820d099915c908786b9d3f58714d70a38f4c22ca2bc723a70f263;


  /// @dev  computes P + Q
  /// @param input: 4 values of 256 bits each
  ///  *) x-coordinate of point P
  ///  *) y-coordinate of point P
  ///  *) x-coordinate of point Q
  ///  *) y-coordinate of point Q
  /// @return An array with x and y coordinates of P+Q.
  function add(uint256[4] memory input) internal returns (uint256, uint256) {
    bool success;
    uint256[2] memory result;
    assembly {
      // 0x06     id of the bn256Add precompile
      // 0        number of ether to transfer
      // 128      size of call parameters, i.e. 128 bytes total
      // 64       size of call return value, i.e. 64 bytes / 512 bit for a BN256 curve point
      success := call(not(0), 0x06, 0, input, 128, result, 64)
    }
    require(success, "bn256 addition failed");

    return (result[0], result[1]);
  }

  /// @dev  computes P*k.
  /// @param input: 3 values of 256 bits each:
  ///  *) x-coordinate of point P
  ///  *) y-coordinate of point P
  ///  *) scalar k.
  /// @return An array with x and y coordinates of P*k.
  function multiply(uint256[3] memory input) internal returns (uint256, uint256) {
    bool success;
    uint256[2] memory result;
    assembly {
      // 0x07     id of the bn256ScalarMul precompile
      // 0        number of ether to transfer
      // 96       size of call parameters, i.e. 96 bytes total (256 bit for x, 256 bit for y, 256 bit for scalar)
      // 64       size of call return value, i.e. 64 bytes / 512 bit for a BN256 curve point
      success := call(not(0), 0x07, 0, input, 96, result, 64)
    }
    require(success, "elliptic curve multiplication failed");
    return (result[0], result[1]);
  }

  /// @dev Checks if P is on G1 using the EllipticCurve library.
  /// @param point: 2 values of 256 bits each:
  ///  *) x-coordinate of point P
  ///  *) y-coordinate of point P
  /// @return true if P is in G1.
  function isOnCurve(uint[2] memory point) internal pure returns (bool) {
    // checks if the given point is a valid point from the first elliptic curve group
    // uses the EllipticCurve library
    return EllipticCurve.isOnCurve(
      point[0],
      point[1],
      AA,
      BB,
      PP);
  }

  /// @dev Checks if e(P, Q) = e (R,S).
  /// @param input: 12 values of 256 bits each:
  ///  *) x-coordinate of point P
  ///  *) y-coordinate of point P
  ///  *) x real coordinate of point Q
  ///  *) x imaginary coordinate of point Q
  ///  *) y real coordinate of point Q
  ///  *) y imaginary coordinate of point Q
  ///  *) x-coordinate of point R
  ///  *) y-coordinate of point R
  ///  *) x real coordinate of point S
  ///  *) x imaginary coordinate of point S
  ///  *) y real coordinate of point S
  ///  *) y imaginary coordinate of point S
  /// @return true if e(P, Q) = e (R,S).
  function bn256CheckPairing(uint256[12] memory input) internal returns (bool) {
    uint256[1] memory result;
    bool success;
    assembly {
      // 0x08     id of the bn256CheckPairing precompile    (checking the elliptic curve pairings)
      // 0        number of ether to transfer
      // 0        since we have an array of fixed length, our input starts in 0
      // 384      size of call parameters, i.e. 12*256 bits == 384 bytes
      // 32       size of result (one 32 byte boolean!)
      success := call(sub(gas(), 2000), 0x08, 0, input, 384, result, 32)
    }
    require(success, "elliptic curve pairing failed");
    return result[0] == 1;
  }

  /// @dev Checks if e(P, Q) = e (R,S)*e(T,U)...
  /// @param input: A modulo 6 length array of values of 256 bits each:
  ///  *) x-coordinate of point P
  ///  *) y-coordinate of point P
  ///  *) x real coordinate of point Q
  ///  *) x imaginary coordinate of point Q
  ///  *) y real coordinate of point Q
  ///  *) y imaginary coordinate of point Q
  ///  *) x-coordinate of point R
  ///  *) y-coordinate of point R
  ///  *) x real coordinate of point S
  ///  *) x imaginary coordinate of point S
  ///  *) y real coordinate of point S
  ///  *) y imaginary coordinate of point S
  ///  *) and so forth with additional pairing checks
  /// @return true if e(input[0,1], input[2,3,4,5]) = e(input[6,7], input[8,9,10,11])*e(input[12,13], input[14,15,16,17])...
  function bn256CheckPairingBatch(uint256[] memory input) internal returns (bool) {
    uint256[1] memory result;
    bool success;
    require(input.length % 6 == 0, "Incorrect input length");
    uint256 inLen = input.length * 32;
    assembly {
      // 0x08     id of the bn256CheckPairing precompile     (checking the elliptic curve pairings)
      // 0        number of ether to transfer
      // add(input, 0x20) since we have an unbounded array, the first 256 bits refer to its length
      // 384      size of call parameters, i.e. 12*256 bits == 384 bytes
      // 32       size of result (one 32 byte boolean!)
      success := call(sub(gas(), 2000), 0x08, 0, add(input, 0x20), inLen, result, 32)
    }
    require(success, "elliptic curve pairing failed");
    return result[0] == 1;
  }

  /// @dev Function to transform compressed bytes into a x and a y coordinate in the curve.
  /// @param _point The point bytes
  /// @return The coordinates `x` and `y` in an array
  function fromCompressed(bytes memory _point) internal pure returns (uint256, uint256) {
    require(_point.length == 33, "invalid encoding");
    uint8 sign;
    uint256 x;
    assembly {
      sign := mload(add(_point, 1))
	    x := mload(add(_point, 33))
    }

    return (
      x, deriveY(
        sign,
        x)
      );
  }

  /// @dev Function to convert a `Hash(msg|DATA)` to a point in the curve as defined in [VRF-draft-04](https://tools.ietf.org/pdf/draft-irtf-cfrg-vrf-04).
  /// @param _message The message used for computing the VRF
  /// @return The hash point in affine coordinates
  function hashToTryAndIncrement(bytes memory _message) internal pure returns (uint, uint) {
    // Find a valid EC point
    // Loop over counter ctr starting at 0x00 and do hash
    for (uint8 ctr = 0; ctr < 256; ctr++) {
      // Counter update
      // c[cLength-1] = byte(ctr);
      bytes32 sha = sha256(abi.encodePacked(_message, ctr));
      // Step 4: arbitraty string to point and check if it is on curve
      uint hPointX = uint256(sha);
      // Avoid hashes that are above the last multiple of _PP, otherwise odds are biased
      if (hPointX >= LAST_MULTIPLE_OF_PP_LOWER_THAN_2_256) {
        continue;
      }
      // Do the modulus to avoid excesive iterations of the loop
      hPointX = hPointX % PP;
      uint hPointY = deriveY(2, hPointX);
      // we do not use the subsidized one as it appears to consume more gas
      if (isOnCurve([hPointX,hPointY])) {
        // Step 5 (omitted): calculate H (cofactor is 1 on bn256g1)
        // If H is not "INVALID" and cofactor > 1, set H = cofactor * H
        return (hPointX, hPointY);
      }
    }
    revert("No valid point was found");
  }

  /// @dev Function to derive the `y` coordinate given the `x` coordinate and the parity byte (`0x03` for odd `y` and `0x04` for even `y`).
  /// @param _yByte The parity byte following the ec point compressed format
  /// @param _x The coordinate `x` of the point
  /// @return The coordinate `y` of the point
  function deriveY(uint8 _yByte, uint256 _x) internal pure returns (uint256) {
    return EllipticCurve.deriveY(
      _yByte,
      _x,
      AA,
      BB,
      PP);
  }

}