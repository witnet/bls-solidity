const BLS = artifacts.require("BLS")
const BLSHelper = artifacts.require("BLSHelper")


contract("EcGasHelper - Gas consumption analysis", accounts => {
  // /////////////////////////////////////////// //
  // Check auxiliary operations for given curves //
  // /////////////////////////////////////////// //
  describe(`BLS operations`, () => {
    const curveData = require(`./bn256.json`)

    let library
    let helper
      before(async () => {
        library = await BLS.deployed()
        await BLSHelper.link(BLS, library.address)
        helper = await BLSHelper.new()
    })

    // toAffine
    for (const [index, test] of curveData.addition.valid.entries()) {
      it(`should add two points (${index + 1})`, async () => {
        await helper._bn128_add([
          web3.utils.toBN(test.input.x1),
          web3.utils.toBN(test.input.y1),
          web3.utils.toBN(test.input.x2),
          web3.utils.toBN(test.input.y2)])
      })
    }

    for (const [index, test] of curveData.multiplication.valid.entries()) {
      it(`should mul a point with a scalar (${index + 1})`, async () => {
        await helper._bn128_multiply([
          web3.utils.toBN(test.input.x),
          web3.utils.toBN(test.input.y),
          web3.utils.toBN(test.input.k)])
      })
    }

    for (const [index, test] of curveData.pairing.valid.entries()) {
      it(`should check pair (${index + 1})`, async () => {
        await helper._bn128_check_pairing([
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
    // Batch Pair
    for (const [index, test] of curveData.pairing_batch.valid.entries()) {
      it(`should check batch pair (${index + 1})`, async () => {
        await helper._bn128_check_pairing_batch([
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
          web3.utils.toBN(test.input.y3_im_g2)])
      })
    }
  })
})
