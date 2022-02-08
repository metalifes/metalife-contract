const { toWei } = web3.utils;
const { exit } = require("process");

const Card = artifacts.require("Card");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function(callback) {
    const cardInstance = await Card.deployed();
    const marketplaceInstance = await Marketplace.deployed();

    if(marketplaceInstance && cardInstance) {
        const owner = await cardInstance.owner.call();

        await cardInstance.mint(owner, 1, '1');
        await cardInstance.mint(owner, 0, '2');
        const cardsOfOwner = (await cardInstance.cardsOf.call(owner));
        console.log('Cards', cardsOfOwner.length);

        await cardInstance.approve(marketplaceInstance.address, cardsOfOwner[0], {from: owner});
        await cardInstance.approve(marketplaceInstance.address, cardsOfOwner[1], {from: owner});

        const block = await web3.eth.getBlock('latest')
        const expiresAt = block.timestamp + 86400*60;

        console.log('expiresAt', expiresAt);

        const publicationFee = toWei('0');
        const price = toWei('0.09');

        await marketplaceInstance.createOrder(
            cardInstance.address,
            cardsOfOwner[0], 
            price,
            expiresAt,
            {from: owner, value: publicationFee}
        );

        await marketplaceInstance.createOrder(
            cardInstance.address,
            cardsOfOwner[1], 
            price,
            expiresAt,
            {from: owner, value: publicationFee}
        );
    }

    exit(0);
}
