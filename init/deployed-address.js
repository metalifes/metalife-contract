const { exit } = require("process");

const Character = artifacts.require("Character");
const Item = artifacts.require("Item");
const Fragment = artifacts.require("Fragment");
const Pet = artifacts.require("Pet");
const Summon = artifacts.require("Summon");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function(callback) {
    const characterInstance = await Character.deployed();
    if(characterInstance) {
        console.log(`Character address: ${characterInstance.address}`);
    }

    const itemInstance = await Item.deployed();
    if(itemInstance) {
        console.log(`Item address: ${itemInstance.address}`);
    }

    const fragmentInstance = await Fragment.deployed();
    if(fragmentInstance) {
        console.log(`Fragment address: ${fragmentInstance.address}`);
    }

    const petInstance = await Pet.deployed();
    if(petInstance) {
        console.log(`Pet address: ${petInstance.address}`);
    }

    const summonInstance = await Summon.deployed();
    if(summonInstance) {
        console.log(`Summon address: ${summonInstance.address}`);
    }

    const marketplaceInstance = await Marketplace.deployed();
    if(marketplaceInstance) {
        console.log(`Marketplace address: ${marketplaceInstance.address}`);
    }

    exit(0);
}
