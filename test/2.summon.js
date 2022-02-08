const bnChai = require('bn-chai');
const expect = require('chai')
  .use(bnChai(web3.utils.BN))
  .expect;

const Summon = artifacts.require("Summon");
const Fragment = artifacts.require("Fragment");
const MockToken = artifacts.require("MockToken");

contract('Summon', (accounts) => {
  const signer = web3.eth.accounts.create();

  it('set signer\'s address', async () => {
    const summon = await Summon.deployed();
    await summon.setSigner(signer.address);

    currentSigner = await summon.signer.call();
    expect(currentSigner).to.equal(signer.address);
  });

  it('should fail on wrong summon factory address', async () => {
    const user1 = accounts[1];

    const summon = await Summon.deployed();

    const fragment = await Fragment.deployed();
    await fragment.revokeRole( // revokeRole current role
      await fragment.MINTER_ROLE.call(),
      summon.address
    );

    await fragment.setMinterRole(user1); // Set wrong address

    const metadataId = '1c';
    const nftType = 1; // fragment

    // Sign message on server
    const message = await web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ['uint8', 'string', 'address'],
        [nftType, metadataId, user1]
      )
    );

    const signed = signer.sign(message);

    try {
      await summon.create(
        nftType, metadataId, signed.signature,
        {from: user1}
      );

      assert.fail('Expected throw not received');
    }
    catch (error) {
      assert.ok(error.reason == "Summon: failed to mint a nft", 'Expected throw received');
    }
  });

  it('Summon success', async () => {
    const user1 = accounts[1];

    const summon = await Summon.deployed();
    await summon.setFee(web3.utils.toBN(100));

    const token = await MockToken.deployed();
    await token.mint(user1, web3.utils.toBN(100));
    await token.approve(summon.address, web3.utils.toBN(100), {from: user1});

    const fragment = await Fragment.deployed();
    await fragment.setMinterRole(summon.address);

    const beforeUnbox = await fragment.balanceOf.call(user1);

    const metadataId = '1c';
    const nftType = 1; // fragment

    // Sign message on server
    const message = await web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ['uint8', 'string', 'address'],
        [nftType, metadataId, user1]
      )
    );

    const signed = signer.sign(message);

    await summon.create(
      nftType, metadataId, signed.signature,
      {from: user1}
    );

    const afterUnbox = await fragment.balanceOf.call(user1);

    expect(afterUnbox).to.eq.BN(beforeUnbox + 1);

    const balanceOfOwner = await token.balanceOf.call(accounts[0]);
    expect(balanceOfOwner).to.eq.BN(100);
  });

  it('fail on duplicate metadata', async () => {
    const user1 = accounts[1];

    const summon = await Summon.deployed();
    await summon.setFee(web3.utils.toBN(100));

    const token = await MockToken.deployed();
    await token.mint(user1, web3.utils.toBN(100));
    await token.approve(summon.address, web3.utils.toBN(100), {from: user1});

    const fragment = await Fragment.deployed();
    await fragment.setMinterRole(summon.address);

    const beforeUnbox = await fragment.balanceOf.call(user1);

    const metadataId = '1c';
    const nftType = 1; // fragment

    // Sign message on server
    const message = await web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ['uint8', 'string', 'address'],
        [nftType, metadataId, user1]
      )
    );

    const signed = signer.sign(message);

    try {
      await summon.create(
        nftType, metadataId, signed.signature,
        {from: user1}
      );

      assert.fail('Expected throw not received');
    }
    catch (error) {
      assert.ok(error.reason == "Summon: failed to mint a nft", 'Expected throw received');
    }
  });
});
