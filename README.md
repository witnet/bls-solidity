# bls-solidity [![TravisCI](https://travis-ci.com/witnet/bls-solidity.svg?branch=master)](https://travis-ci.com/witnet/bls-solidity)

`bls-solidity` is an open source fast and effective implementation of the 256-bit Barreto-Naehrig (BN256) curve operations written in Solidity. More precisely, this library implements all the necessary curve arithmetic to perform BLS signatures. Currently only the Elliptic Curve (EC) `bn256` is supported, as this is the only curve for which certain operations are subsidized by the EVM in the form of precompiled functions. However, adding support to new curves should be straight forward.

_DISCLAIMER: This is experimental software. **Use it at your own risk**!_

The solidity library has been designed aiming at decreasing gas consumption and its complexity due to EC operations. For that reasons, the `BN256G1` library makes use of the precompiled functions made available by the EVM. The operations in G2 are not subsidized, and therefore implementations for the most basic operations are available. 

Exported functions in field G1:

- **add**:
  - _Description_: adds two points in Jacobian coordinates in G1
  - _Inputs_:
    - *_input_*: The two points as an array composed of `[pt1-x, pt1-y, pt2-x, pt2-y]`
  - _Output_:
    - an array with pt3 = pt1 + pt2 represented as `[pt3-x, pt3-y]`

- **multiply**:
  - _Description_: Multiplies an input pt with an scalar k.
  - _Inputs_:
    - *_input_*: an array containing the point and scalar represented as `[pt-x, pt-y, k]`
  - _Output_:
    - an array with pt2 = pt*k represented as `[pt2-x, pt2-y]`

- **isOnCurveSubsidized**:
  - _Description_: Checks whether the provided point exists in BN256 G1. It uses the precompiled function.
  - _Inputs_:
    - *_input_*: an array containing the point represented as `[pt-x, pt-y]`
  - _Output_:
    - true if the point provided is valid on the curve.

- **isOnCurve**:
  - _Description_: Checks whether the provided point exists in BN256 G1. It uses the elliptic-curve-solidity library function.
  - _Inputs_:
    - *_input_*: an array containing the point represented as `[pt-x, pt-y]`
  - _Output_:
    - true if the point provided is valid on the curve.

- **bn256CheckPairing**:
  - _Description_: Checks whether e(P, Q) = e(R,S)
  - _Input_:
    - *_input_*: an array containing the points represented as `[P-x, P-y, Q-x-re, Q-x-im, Q-y-re, Q-y-im, R-x, R-y, S-x-re, S-x-im, S-y-re, S-y-im]`
  - _Output_:
    - true if e(P, Q) is equal to e(R, S).

- **bn256CheckPairingBatch**:
  - _Description_: Checks whether e(P, Q) = e(R,S) * e(T, U)...
  - _Input_:
    - *_input_*: an array containing the points represented as `[P-x, P-y, Q-x-re, Q-x-im, Q-y-re, Q-y-im, R-x, R-y, S-x-re, S-x-im, S-y-re, S-y-im, T-x, T-y, U-x-re, U-x-im, U-y-re, U-y-im,...]`
  - _Output_:
    - true if e(P, Q) is equal to e(R, S) * e(T, U) * ....

Exported functions in field G2:

- **ecTwistAdd**:
  - _Description_: adds two points in Jacobian coordinates in G2
  - _Inputs_:
    - *_input_*: The two points as an array composed of `[pt1-x-re, pt1-x-im, pt1-y-re, pt1-y-im, pt1-x-re, pt1-x-im, pt1-y-re, pt1-y-im]`
  - _Output_:
    - an array with pt3 = pt1 + pt2 represented as `[pt3-x-re, pt3-x-im, pt3-y-re, pt3-y-im]`

- **ecTwistMul**:
  - _Description_: Multiplies a point in Jacobian coordinates in G2 with a scalar
  - _Inputs_:
    - *_input_*: The point and the scalar as an array composed of `[pt-x-re, pt-x-im, pt-y-re, pt-y-im, k]`
  - _Output_:
    - an array with pt2 = pt * k represented as `[pt2-x-re, pt2-x-im, pt2-y-re, pt2-y-im]`

## Usage

`BN256G1.sol` and `BN256G2.sol` library can be used directly by importing it.

Similarly to the [`BN256G1Helper.sol`](https://github.com/witnet/bls-solidity/blob/master/test/BN256G1Helper.sol) from the [`test`][test-folder] project folder, a contract may use the library by instantiation as follows:

```solidity
pragma solidity 0.6.8;

import "bls-solidity/contracts/BN256G1.sol";


contract BN256G1Helper {

  function functionUsingBN256G1(
    uint256[4] memory public _input)
  public returns (uint256[2] memory)
  {
    return BN256G1.add(_input);
  }
}
```

The tests under the [`test`][test-folder] folder can be seen as additional examples for interacting with the contract using Solidity and Javascript.

## Benchmark

Gas consumption analysis was conducted in order  to understand the associated costs to the usage of the `bls-solidity` library. Only `public or external` functions were object of study as they are the only functions meant to be called by other parties.

Gas consumption and USD price estimation with a gas price of 20 Gwei, derived from [ETH Gas Station](https://ethgasstation.info/):

```
·············································|···························|·············|·····························
|  Methods                                   ·               20 gwei/gas               ·       213.78 usd/eth       │
·················|···························|·············|·············|·············|··············|··············
|  Contract      ·  Method                   ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
·················|···························|·············|·············|·············|··············|··············
|  BN256G2Helper · _bn128_g2_add             ·        -    ·        -    ·  54401      ·     8         ·  0.2       │ 
·················|···························|·············|·············|·············|··············|··············
|  BN256G2Helper · _bn128_g2_multiply        ·  2944704    ·  3140352    ·  3057658    ·    15        ·  10.31      │
·················|···························|·············|·············|·············|··············|··············
|  Deployments                               ·                                         ·  % of limit  ·             │
·············································|·············|·············|·············|··············|··············
|  BN256G2Helper                             ·        -    ·        -    ·  214244     ·     3.2 %    ·   0.9       │
·--------------------------------------------|-------------|-------------|-------------|--------------|-------------·
```

```
·············································|···························|·············|·····························
|  Methods                                   ·               20 gwei/gas               ·       213.78 usd/eth       │
·················|···························|·············|·············|·············|··············|··············
|  Contract      ·  Method                   ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
·················|···························|·············|·············|·············|··············|··············
|  BN256G1Helper ·  _add                     ·   23374     ·   24910     ·   24154     ·     12       ·   0.1       │
·················|···························|·············|·············|·············|··············|··············
|  BN256G1Helper ·  _bn256CheckPairing       ·  140843     ·  141587     ·  141433     ·     10       ·   0.6       │
·················|···························|·············|·············|·············|··············|··············
|  BN256G1Helper ·  _bn256CheckPairingBatch  ·  179150     ·  179186     ·  179170     ·      5       ·   0.8       │
·················|···························|·············|·············|·············|··············|··············
|  BN256G1Helper ·  _isOnCurve               ·   21981     ·   22966     ·   22747     ·      9       ·   0.1       │
·················|···························|·············|·············|·············|··············|··············
|  BN256G1Helper ·  _isOnCurveSubsidized     ·   22844     ·   23612     ·   23458     ·     10       ·   0.1       │
·················|···························|·············|·············|·············|··············|··············
|  BN256G1Helper ·  _multiply                ·   29902     ·   30286     ·   30075     ·     36       ·   0.1       │
·················|···························|·············|·············|·············|··············|··············
|  Deployments                               ·                                         ·  % of limit  ·             │
·············································|·············|·············|·············|··············|··············
|  BN256G1Helper                             ·       -     ·       -     ·  710293     ·     10.6 %   ·   2.9       │
·--------------------------------------------|-------------|-------------|-------------|--------------|-------------·
```

## Test Vectors

The following resources have been used for test vectors:

- [go-ethereum](https://github.com/ethereum/go-ethereum/blob/7b189d6f1f7eedf46c6607901af291855b81112b/core/vm/contracts_test.go)
- [asecurity](https://asecuritysite.com/encryption/go_bn256)

## Acknowledgements

Some bn256 operations have been adapted from the following resources:

- [ETHDKG](https://github.com/PhilippSchindler/ethdkg)
- [solidity-BN256G2](https://github.com/musalbas/solidity-BN256G2)

## License

`bls-solidity` is published under the [MIT license][license].

[license]: https://github.com/witnet/bls-solidity/blob/master/LICENSE
[test-folder]: https://github.com/witnet/vrf-solidity/blob/master/test
