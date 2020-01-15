var bls = artifacts.require("BLS")

module.exports = function (deployer, network) {
  console.log(`> Migrating CBOR and Witnet into ${network} network`)
  deployer.deploy(bls)
}
