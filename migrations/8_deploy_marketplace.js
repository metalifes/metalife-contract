const Marketplace = artifacts.require("Marketplace");

module.exports = async function(deployer) {
    let ownerCutPerMillion = 10000; // 10000/1_000_000 = 1%

    await deployer.deploy(Marketplace, ownerCutPerMillion);
    
    const marketplace = await Marketplace.deployed();
    if (marketplace) {
        // Find a item equa  to the owner
        
        console.log("Marketplace successfully deployed.");
        console.log(`Marketplace address: ${marketplace.address}`);
    }
}
