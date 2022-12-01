const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

const Web3= require('web3');

contract ('DecentralBank' , ([owner, customer]) =>{

    //before hooks will load contract before every describe block
    let tether, rwd, decentralBank;

    function Tokens(number) {
        return Web3.utils.toWei(number, 'ether');
    }
    before(async () => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        // transfer RWD token to DecentralBank
        await rwd.transfer(decentralBank.address, Tokens('1000000'))
        
        //tansfer tether token to custom account
        await tether.transfer(customer, Tokens('100'), {from: owner})

    });


    // test Tether contract name 
    describe('Tether Contract Name', async()=>{

        it('match is successfully', async()=>{
            const name = await tether.name();
            assert.equal(name, 'Tether Token', "Tether Token name is incorrect.");
        });
    });

    // test RWD contract name 
    describe('RWD Contract Name', async()=>{

        it('match is successfully', async()=>{
            const name = await rwd.name();
            assert.equal(name, 'Reward Token', "Reward Token name is incorrect.");
        });
    });

    // test DecentralBank contract name and transfer token 
    describe('DecentralBank name and transfer token', async()=>{
        it('match is successfully', async()=>{
            // DecentralBank name
            const name= await decentralBank.name();
            assert.equal(name, 'Decentral Bank', "Decentral Bank name is incorrect.");
        });

        it('contract has token', async()=>{
            // RWD token balance for DecentralBank
            let balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, Tokens('1000000'), "decentralBank balance is incorrect.");
        });
    });


    // test the DecentralBank for Yield farming
    describe('Yield Farming', async()=>{
        it('Reward Token for staking', async()=>{
            let result;
            result= await tether.balanceOf(customer);
            assert.equal(result.toString(), Tokens('100'),'Customer balance before for staking is incorrect.');

            // staking customer 100 token and check
            await tether.approval(decentralBank.address, Tokens('100'),{from: customer});
            await decentralBank.depositTokens( Tokens('100'),{from: customer});

            // check customer balance after staking
            result= await tether.balanceOf(customer);
            assert.equal(result.toString(), Tokens('0'),'Customer balance after staking is incorrect.');

            // check bank balance after staking
            result= await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), Tokens('100'), 'Bank balance after staking is incorrect.');
          
            // check customer stake token balance
            result = await decentralBank.stakingBalance(customer);
            assert.equal(result.toString(), Tokens('100'), 'Customer stake token balance is incorrect.');

            // check isStaking falag after staking
            result = await decentralBank.isStaked(customer);
            assert.equal(result.toString(), 'true', 'isStaking falag is false.');

            // only owner can issue
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            // issue token by owner
            await decentralBank.issueTokens({from:owner})

            //unstake token
            await decentralBank.unstakeTokens({from:customer})

            // check customer tether token balance after unstaking
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), Tokens('100'), 'Customer balance after unstake is incorrect.')


            // check customen balance in bank after unstaking
            result= await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), Tokens('0'), 'Customen balance in bank after unstaking is incorrect.')

            // check isStaking falag after unstake
            result = await decentralBank.isStaked(customer)
            assert.equal(result.toString(), 'false', 'isStaking falag is true.')

        });
    });
});