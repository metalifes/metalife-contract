const Pet = artifacts.require("Pet");

module.exports = async function(deployer) {
    await deployer.deploy(Pet);
    const pet = await Pet.deployed();
    if(pet) {
        console.log("Pet successfully deployed.");
        console.log(`Pet address: ${pet.address}`);
    }
}
