pragma solidity ^0.6.0;


/**
 * @title Elliptic Curve Library
 * @dev Library providing arithmetic operations over elliptic curves.
 * @author Witnet Foundation
 */
library BN256G1 {

  //https://modex.tech/developers/florinotto/go-ethereum/src/a660685746db17a41cd67b05c614cdb29e49340c/core/vm/contracts_test.go

  // Generators for G1 and G2
  uint256 constant g1x = 1;
  uint256 constant g1y = 2;
  uint256 constant g2xx = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
  uint256 constant g2xy = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
  uint256 constant g2yx = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
  uint256 constant g2yy = 8495653923123431417604973247489272438418190587263600148770280649306958101930;

  uint256 constant GROUP_ORDER   = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
  uint256 constant FIELD_MODULUS = 21888242871839275222246405745257275088696311157297823662689037894645226208583;


  function bn128_add(uint256[4] memory input) 
    public returns (uint256[2] memory result) {
        // computes P + Q 
        // input: 4 values of 256 bit each
        //  *) x-coordinate of point P
        //  *) y-coordinate of point P
        //  *) x-coordinate of point Q
        //  *) y-coordinate of point Q

        bool success;   
        assembly {
            // 0x06     id of precompiled bn256Add contract
            // 0        number of ether to transfer
            // 128      size of call parameters, i.e. 128 bytes total
            // 64       size of call return value, i.e. 64 bytes / 512 bit for a BN256 curve point
            success := call(not(0), 0x06, 0, input, 128, result, 64)
        }
        require(success, "elliptic curve addition failed");

        return result;
    }
  function bn128_multiply(uint256[3] memory input) 
    public returns (uint256[2] memory result) {
        // computes P*x 
        // input: 3 values of 256 bit each
        //  *) x-coordinate of point P
        //  *) y-coordinate of point P
        //  *) scalar x

        bool success;
        assembly {
            // 0x07     id of precompiled bn256ScalarMul contract
            // 0        number of ether to transfer
            // 96       size of call parameters, i.e. 96 bytes total (256 bit for x, 256 bit for y, 256 bit for scalar)
            // 64       size of call return value, i.e. 64 bytes / 512 bit for a BN256 curve point
            success := call(not(0), 0x07, 0, input, 96, result, 64)
        }
        require(success, "elliptic curve multiplication failed");
    }

  function bn128_is_on_curve(uint[2] memory point) 
    public returns(bool valid) {
        // checks if the given point is a valid point from the first elliptic curve group
        // by trying an addition with the generator point g1

        uint256[4] memory input = [point[0], point[1], g1x, g1y];
        assembly {
            // 0x06     id of precompiled bn256Add contract
            // 0        number of ether to transfer
            // 128      size of call parameters, i.e. 128 bytes total
            // 64       size of call return value, i.e. 64 bytes / 512 bit for a BN256 curve point
            valid := call(not(0), 0x06, 0, input, 128, input, 64)
        }
    }
  function bn128_check_pairing(uint256[12] memory input) 
    public returns (bool) {
        uint256[1] memory result;
        bool success;
        assembly {
            // 0x08     id of precompiled bn256Pairing contract     (checking the elliptic curve pairings)
            // 0        number of ether to transfer
            // 0        since we have an array of fixed length, our input starts in 0
            // 384      size of call parameters, i.e. 12*256 bits == 384 bytes
            // 32       size of result (one 32 byte boolean!)
            success := call(sub(gas(), 2000), 0x08, 0, input, 384, result, 32)
        }
        require(success, "elliptic curve pairing failed");
        return result[0] == 1;
    }
  // The first point in G1 should be equal to the sum of the following points in G1 inserted
  // Remember the first point in G1 should be negated! -P = (x, q-y)
  function bn128_check_pairing_batch(uint256[] memory input)
    public returns (bool) {
        uint256[1] memory result;
        bool success;
        require(input.length % 6 == 0, "Incorrect input length");
        uint256 inLen = input.length * 32;
        //uint256 inputBytes = input.length*32;
        assembly {
            // 0x08     id of precompiled bn256Pairing contract     (checking the elliptic curve pairings)
            // 0        number of ether to transfer
            // add(input, 0x20) since we have an unbounded array, the first 256 bits refer to its length
            // 384      size of call parameters, i.e. 12*256 bits == 384 bytes
            // 32       size of result (one 32 byte boolean!)
            success := call(sub(gas(), 2000), 0x08, 0, add(input, 0x20), inLen, result, 32)
        }
        require(success, "elliptic curve pairing failed");
        return result[0] == 1;
    }
}
