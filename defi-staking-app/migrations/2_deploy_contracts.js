
const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async (deployer, network, accounts) => {
    // deploy Moke Tether contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();


    // deploy Moke RWD contract
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    // deploy Moke DecentralBank contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed();


    // transfer all RWD tokens to DecentralBank
    await rwd.transfer(decentralBank.address, '1000000000000000000000000'); // 1 milion with 18 decimal points

    // distribute 100 Tether token to investor
    await tether.transfer(accounts[1], '100000000000000000000');

};