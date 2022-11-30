const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function issueRewards(callback){
    let decentralBank = await DecentralBank.deployed();
    await decentralBank.issueTokens();

    console.log('Token has been issued successfully.');
    callback();
}