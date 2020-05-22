const BLSG2Helper = artifacts.require("BN256G2Helper")

contract("EcGasHelper - Gas consumption analysis", accounts => {
  // /////////////////////////////////////////// //
  // Check auxiliary operations for given curves //
  // /////////////////////////////////////////// //
  describe("BN256G2 operations", () => {
    const curveData = require("./data/bn256_g2.json")

    let helper
    before(async () => {
      helper = await BLSG2Helper.new()
    })

    // Add
    for (const [index, test] of curveData.addition.valid.entries()) {
      it(`should add two points (${index + 1})`, async () => {
        const add = await helper._ecTwistAdd.call([
          web3.utils.toBN(test.input.x1_re),
          web3.utils.toBN(test.input.x1_im),
          web3.utils.toBN(test.input.y1_re),
          web3.utils.toBN(test.input.y1_im),
          web3.utils.toBN(test.input.x2_re),
          web3.utils.toBN(test.input.x2_im),
          web3.utils.toBN(test.input.y2_re),
          web3.utils.toBN(test.input.y2_im)])
        assert.equal(add[0].toString(), web3.utils.toBN(test.output.x_re).toString())
        assert.equal(add[1].toString(), web3.utils.toBN(test.output.x_im).toString())
        assert.equal(add[2].toString(), web3.utils.toBN(test.output.y_re).toString())
        assert.equal(add[3].toString(), web3.utils.toBN(test.output.y_im).toString())
      })
    }

    // Ivalid add
    for (const [index, test] of curveData.addition.invalid.entries()) {
      it(`invalid: should add two points (${index + 1})`, async () => {
        const add = await helper._ecTwistAdd.call([
          web3.utils.toBN(test.input.x1_re),
          web3.utils.toBN(test.input.x1_im),
          web3.utils.toBN(test.input.y1_re),
          web3.utils.toBN(test.input.y1_im),
          web3.utils.toBN(test.input.x2_re),
          web3.utils.toBN(test.input.x2_im),
          web3.utils.toBN(test.input.y2_re),
          web3.utils.toBN(test.input.y2_im)])
        assert.notEqual(add[0].toString(), web3.utils.toBN(test.output.x_re).toString())
        assert.notEqual(add[1].toString(), web3.utils.toBN(test.output.x_im).toString())
        assert.notEqual(add[2].toString(), web3.utils.toBN(test.output.y_re).toString())
        assert.notEqual(add[3].toString(), web3.utils.toBN(test.output.y_im).toString())
      })
    }

    // Mul
    for (const [index, test] of curveData.multiplication.valid.entries()) {
      it(`should mul a point with a scalar (${index + 1})`, async () => {
        const mul = await helper._ecTwistMul.call([
          web3.utils.toBN(test.input.k),
          web3.utils.toBN(test.input.x_re),
          web3.utils.toBN(test.input.x_im),
          web3.utils.toBN(test.input.y_re),
          web3.utils.toBN(test.input.y_im)])
        assert.equal(mul[0].toString(), web3.utils.toBN(test.output.x_re).toString())
        assert.equal(mul[1].toString(), web3.utils.toBN(test.output.x_im).toString())
        assert.equal(mul[2].toString(), web3.utils.toBN(test.output.y_re).toString())
        assert.equal(mul[3].toString(), web3.utils.toBN(test.output.y_im).toString())
      })
    }

    // Invalid mul
    for (const [index, test] of curveData.multiplication.invalid.entries()) {
      it(`invalid: should mul a point with a scalar (${index + 1})`, async () => {
        const mul = await helper._ecTwistMul.call([
          web3.utils.toBN(test.input.k),
          web3.utils.toBN(test.input.x_re),
          web3.utils.toBN(test.input.x_im),
          web3.utils.toBN(test.input.y_re),
          web3.utils.toBN(test.input.y_im)])
        assert.notEqual(mul[0].toString(), web3.utils.toBN(test.output.x_re).toString())
        assert.notEqual(mul[1].toString(), web3.utils.toBN(test.output.x_im).toString())
        assert.notEqual(mul[2].toString(), web3.utils.toBN(test.output.y_re).toString())
        assert.notEqual(mul[3].toString(), web3.utils.toBN(test.output.y_im).toString())
      })
    }
  })
})
