var bn256g1 = artifacts.require("BN256G1")

module.exports = function (deployer, network) {
  console.log(`> Migrating CBOR and Witnet into ${network} network`)
  deployer.deploy(bn256g1)
}
