var bn256g2 = artifacts.require("BN256G2")

module.exports = function (deployer, network) {
  console.log(`> Migrating CBOR and Witnet into ${network} network`)
  deployer.deploy(bn256g2)
}
