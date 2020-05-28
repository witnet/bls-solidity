const BN256G1Helper = artifacts.require("BN256G1Helper")

contract("EcGasHelper - Gas consumption analysis", accounts => {
  // /////////////////////////////////////////// //
  // bn56g1 test suite //
  // /////////////////////////////////////////// //

  // Test vectors taken from
  // eslint-disable-next-line
  // https://modex.tech/developers/florinotto/go-ethereum/src/a660685746db17a41cd67b05c614cdb29e49340c/core/vm/contracts_test.go
  // https://asecuritysite.com/encryption/go_bn256

  describe("BN256G1 operations", () => {
    const curveData = require("./data/bn256_g1.json")

    let bn256g1helper
    before(async () => {
      bn256g1helper = await BN256G1Helper.new()
    })

    // Add
    for (const [index, test] of curveData.addition.valid.entries()) {
      it(`should add two points (${index + 1})`, async () => {
        const add = await bn256g1helper._add.call([
          web3.utils.toBN(test.input.x1),
          web3.utils.toBN(test.input.y1),
          web3.utils.toBN(test.input.x2),
          web3.utils.toBN(test.input.y2)])
        assert.equal(add[0].toString(), web3.utils.toBN(test.output.x).toString())
        assert.equal(add[1].toString(), web3.utils.toBN(test.output.y).toString())
      })
    }

    // Invalid add
    for (const [index, test] of curveData.addition.invalid.entries()) {
      it(`invalid: should add two points (${index + 1})`, async () => {
        const add = await bn256g1helper._add.call([
          web3.utils.toBN(test.input.x1),
          web3.utils.toBN(test.input.y1),
          web3.utils.toBN(test.input.x2),
          web3.utils.toBN(test.input.y2)])
        assert.notEqual(add[0].toString(), web3.utils.toBN(test.output.x).toString())
        assert.notEqual(add[1].toString(), web3.utils.toBN(test.output.y).toString())
      })
    }

    // Mul
    for (const [index, test] of curveData.multiplication.valid.entries()) {
      it(`should mul a point with a scalar (${index + 1})`, async () => {
        const mul = await bn256g1helper._multiply.call([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y),
          web3.utils.toBN(test.input.k)])
        assert.equal(mul[0].toString(), web3.utils.toBN(test.output.x).toString())
        assert.equal(mul[1].toString(), web3.utils.toBN(test.output.y).toString())
      })
    }

    // Invalid mul
    for (const [index, test] of curveData.multiplication.invalid.entries()) {
      it(`invalid: should mul a point with a scalar (${index + 1})`, async () => {
        const mul = await bn256g1helper._multiply.call([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y),
          web3.utils.toBN(test.input.k)])
        assert.notEqual(mul[0].toString(), web3.utils.toBN(test.output.x).toString())
        assert.notEqual(mul[1].toString(), web3.utils.toBN(test.output.y).toString())
      })
    }

    // Pair
    for (const [index, test] of curveData.pairing.valid.entries()) {
      it(`should check pair (${index + 1})`, async () => {
        const pair = await bn256g1helper._bn256CheckPairing.call([
          web3.utils.toBN(test.input.x1_g1),
          web3.utils.toBN(test.input.y1_g1),
          web3.utils.toBN(test.input.x1_re_g2),
          web3.utils.toBN(test.input.x1_im_g2),
          web3.utils.toBN(test.input.y1_re_g2),
          web3.utils.toBN(test.input.y1_im_g2),
          web3.utils.toBN(test.input.x2_g1),
          web3.utils.toBN(test.input.y2_g1),
          web3.utils.toBN(test.input.x2_re_g2),
          web3.utils.toBN(test.input.x2_im_g2),
          web3.utils.toBN(test.input.y2_re_g2),
          web3.utils.toBN(test.input.y2_im_g2)])
        assert.equal(pair, test.output.success)
      })
    }

    // Invalid pair
    for (const [index, test] of curveData.pairing.invalid.entries()) {
      it(`invalid: should check pair (${index + 1})`, async () => {
        const pair = await bn256g1helper._bn256CheckPairing.call([
          web3.utils.toBN(test.input.x1_g1),
          web3.utils.toBN(test.input.y1_g1),
          web3.utils.toBN(test.input.x1_re_g2),
          web3.utils.toBN(test.input.x1_im_g2),
          web3.utils.toBN(test.input.y1_re_g2),
          web3.utils.toBN(test.input.y1_im_g2),
          web3.utils.toBN(test.input.x2_g1),
          web3.utils.toBN(test.input.y2_g1),
          web3.utils.toBN(test.input.x2_re_g2),
          web3.utils.toBN(test.input.x2_im_g2),
          web3.utils.toBN(test.input.y2_re_g2),
          web3.utils.toBN(test.input.y2_im_g2)])
        assert.equal(pair, test.output.success)
      })
    }

    // Batch Pair
    for (const [index, test] of curveData.pairing_batch.valid.entries()) {
      it(`should check batch pair (${index + 1})`, async () => {
        const pair = await bn256g1helper._bn256CheckPairingBatch.call([
          web3.utils.toBN(test.input.x1_g1),
          web3.utils.toBN(test.input.y1_g1),
          web3.utils.toBN(test.input.x1_re_g2),
          web3.utils.toBN(test.input.x1_im_g2),
          web3.utils.toBN(test.input.y1_re_g2),
          web3.utils.toBN(test.input.y1_im_g2),
          web3.utils.toBN(test.input.x2_g1),
          web3.utils.toBN(test.input.y2_g1),
          web3.utils.toBN(test.input.x2_re_g2),
          web3.utils.toBN(test.input.x2_im_g2),
          web3.utils.toBN(test.input.y2_re_g2),
          web3.utils.toBN(test.input.y2_im_g2),
          web3.utils.toBN(test.input.x3_g1),
          web3.utils.toBN(test.input.y3_g1),
          web3.utils.toBN(test.input.x3_re_g2),
          web3.utils.toBN(test.input.x3_im_g2),
          web3.utils.toBN(test.input.y3_re_g2),
          web3.utils.toBN(test.input.y3_im_g2),
        ])
        assert.equal(pair, test.output.success)
      })
    }

    // Hash to curve
    for (const [index, test] of curveData.hash_to_try.valid.entries()) {
      it(`should check hash_to_try (${index + 1})`, async () => {
        const hash = await bn256g1helper._hashToTryAndIncrement.call(
          test.input.message
        )
        assert.equal(hash[0].toString(), web3.utils.toBN(test.output.hash).toString())
      })
    }

    // isOnCurve
    for (const [index, test] of curveData.is_on_curve.valid.entries()) {
      it(`should check wether is on curve (${index + 1})`, async () => {
        const valid = await bn256g1helper._isOnCurve.call([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y)])
        assert.equal(valid, test.output)
      })
    }

    // Invalid isOnCurve
    for (const [index, test] of curveData.is_on_curve.invalid.entries()) {
      it(`invalid: should check wether is on curve (${index + 1})`, async () => {
        const valid = await bn256g1helper._isOnCurve.call([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y)])
        assert.equal(valid, test.output)
      })
    }

    // fromCompressed
    for (const [index, test] of curveData.from_compressed.valid.entries()) {
      it(`should check from compressed (${index + 1})`, async () => {
        const uncompressed = await bn256g1helper._fromCompressed.call(
          test.input.point)

        assert.equal(uncompressed[0].toString(), web3.utils.toBN(test.output.x).toString())
        assert.equal(uncompressed[1].toString(), web3.utils.toBN(test.output.y).toString())
      })
    }
  })
})
