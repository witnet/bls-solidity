const BN256G1Helper = artifacts.require("BN256G1Helper")

contract("EcGasHelper - Gas consumption analysis", accounts => {
  // /////////////////////////////////////////// //
  // Check auxiliary operations for given curves //
  // /////////////////////////////////////////// //
  describe("BN256G1 operations", () => {
    const curveData = require("./bn256.json")

    let helper
    before(async () => {
      helper = await BN256G1Helper.new()
    })

    // Addition
    for (const [index, test] of curveData.addition.valid.entries()) {
      it(`should add two points (${index + 1})`, async () => {
        await helper._add([
          web3.utils.toBN(test.input.x1),
          web3.utils.toBN(test.input.y1),
          web3.utils.toBN(test.input.x2),
          web3.utils.toBN(test.input.y2)])
      })
    }

    // Multiplication
    for (const [index, test] of curveData.multiplication.valid.entries()) {
      it(`should mul a point with a scalar (${index + 1})`, async () => {
        await helper._multiply([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y),
          web3.utils.toBN(test.input.k)])
      })
    }

    // Pairing
    for (const [index, test] of curveData.pairing.valid.entries()) {
      it(`should check pair (${index + 1})`, async () => {
        await helper._bn256CheckPairing([
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
      })
    }

    // Batch pair
    for (const [index, test] of curveData.pairing_batch.valid.entries()) {
      it(`should check batch pair (${index + 1})`, async () => {
        await helper._bn256CheckPairingBatch([
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
      })
    }

    // isOnCurveSub
    for (const [index, test] of curveData.is_on_curve.valid.entries()) {
      it(`should check wether is on curve (${index + 1})`, async () => {
        await helper._isOnCurveSubsidized([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y)])
      })
    }

    // isOnCurve
    for (const [index, test] of curveData.is_on_curve.valid.entries()) {
      it(`should check wether is on curve (${index + 1})`, async () => {
        await helper._isOnCurve([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y)])
      })
    }
  })
})
