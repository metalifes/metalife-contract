const { exit } = require("process");

const Character = artifacts.require("Character");
const Item = artifacts.require("Item");
const Fragment = artifacts.require("Fragment");
const Pet = artifacts.require("Pet");
const Summon = artifacts.require("Summon");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function (callback) {
    const newOwner = "";

    const characterInstance = await Character.deployed();
    if(characterInstance) {
        console.log(`Character address: ${characterInstance.address}`);
        await characterInstance.transferOwnership(newOwner);
    }

    const fragmentInstance = await Fragment.deployed();
    if(fragmentInstance) {
        console.log(`Fragment address: ${fragmentInstance.address}`);
        await fragmentInstance.transferOwnership(newOwner);
    }

    const itemInstance = await Item.deployed();
    if(itemInstance) {
        console.log(`Item address: ${itemInstance.address}`);
        await itemInstance.transferOwnership(newOwner);
    }

    const petInstance = await Pet.deployed();
    if(petInstance) {
        console.log(`Pet address: ${petInstance.address}`);
        await petInstance.transferOwnership(newOwner);
    }

    const summonInstance = await Summon.deployed();
    if(console) {
        console.log(`Summon address: ${summonInstance.address}`);
        await summonInstance.transferOwnership(newOwner);
    }

    const marketplaceInstance = await Marketplace.deployed();
    if(marketplaceInstance) {
        console.log(`Marketplace address: ${marketplaceInstance.address}`);
        await marketplaceInstance.transferOwnership(newOwner);
    }

    exit(0);
}
