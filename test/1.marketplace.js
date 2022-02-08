const { toWei } = web3.utils;
const bnChai = require('bn-chai');
const expect = require('chai')
  .use(bnChai(web3.utils.BN)) // web3 is provided by the test runner in truffle
  .expect;

const Marketplace = artifacts.require("Marketplace");
const Card = artifacts.require("Card");
const Hero = artifacts.require("Hero");
const Land = artifacts.require("Land");

contract('Marketplace', (accounts) => {
  it('create a order: Card', async () => {
    const user1 = accounts[1];
    const cardInstance = await Card.deployed();    

    // mint a card to user1
    await cardInstance.mint(user1, 1);
    const user1Cards = (await cardInstance.cardsOf.call(user1));

    expect(user1Cards.length).to.eq.BN(1);

    // Create order
    const marketplaceInstance = await Marketplace.deployed();

    const publicationFee = toWei('2');
    await marketplaceInstance.setPublicationFee(publicationFee);

    await cardInstance.approve(marketplaceInstance.address, user1Cards[0], {from: user1});

    const expiresAt = await getEndTime(2);
    const price = toWei('10');
    await marketplaceInstance.createOrder(
      cardInstance.address,
      user1Cards[0], 
      price,
      expiresAt,
      {from: user1, value: publicationFee}
    );

    const order = (await marketplaceInstance.getOrder.call(cardInstance.address, user1Cards[0]));
    expect(order.id).not.to.eq.BN(0);
  });

  it('execute a order: Card', async () => {
    const user2 = accounts[2];
    const cardInstance = await Card.deployed();

    // Execute order
    const marketplaceInstance = await Marketplace.deployed();
    
    const cards = (await cardInstance.cardsOf.call(marketplaceInstance.address));
    const order = (await marketplaceInstance.getOrder.call(cardInstance.address, cards[0]));
    expect(order.id).not.to.eq.BN(0);

    await marketplaceInstance.executeOrder(
      cardInstance.address,
      cards[0],
      {from: user2, value: order.price}
    );

    // const balance = (await cardInstance.balanceOf.call(user2));
    // expect(balance).to.eq.BN(1);
    const user2Cards = (await cardInstance.cardsOf.call(user2));
    expect(user2Cards.length).to.eq.BN(1);
  });

  async function getEndTime(minutesAhead = 1) {
    const block = await web3.eth.getBlock('latest')
    return block.timestamp + minutesAhead*60;
  }
});
