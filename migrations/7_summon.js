const Summon = artifacts.require("Summon");
const Fragment = artifacts.require("Fragment");
const Item = artifacts.require("Item");
const Pet = artifacts.require("Pet");
const MockToken = artifacts.require("MockToken");

module.exports = async function (deployer) {
    const fragment = await Fragment.deployed();
    const item = await Item.deployed();
    const pet = await Pet.deployed();

    let tokenAddress = "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684";
    if (deployer.network == 'dev') {
        await deployer.deploy(MockToken, "MetaLife Token", "MLT");
        const token = await MockToken.deployed();
        tokenAddress = token.address;
    }

    await deployer.deploy(Summon, 0, tokenAddress, fragment.address, item.address, pet.address);
    const summon = await Summon.deployed();
    if(summon) {
        console.log("Summon successfully deployed.");
        console.log(`Summon address: ${summon.address}`);

        await fragment.setMinterRole(summon.address);
        await item.setMinterRole(summon.address);
        await pet.setMinterRole(summon.address);
    }
}
