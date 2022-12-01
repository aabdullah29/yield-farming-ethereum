import React, {Component} from 'react';
import Web3 from 'web3';
import './App.css';
import Navabr from './Navbar';
import Main from './Main';
import Tether from '../truffle_abis/Tether.json';
import Reward from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import ParticleSettings from './ParticleSettings';




class App extends Component {

    // load in web3 and connect metamask when the app loads 
    async loadWeb3() { 
        if(window.ethererum) { // if the browser window detects Ethereum
            window.web3 = new Web3(window.ethererum)  // emable new instance
            await window.ethereum.enable();  // wait for it to enable
        } else if (window.web3) { // or if we detect web3 in the browser
            window.web3 = new Web3(window.web3.currentProvider) // enable current provider 
            await window.web3.currentProvider.enable();  // wait for it to enable
        } else {
            window.alert('No ethereum browser detected. Metamask ');
        }
    }


    // load the blockchain data 
    async loadBlockchainData() {
        const web3 = await window.web3;

        // get the account from metamask
        const account = await web3.eth.getAccounts();  
        this.setState({ account: account[0] });
        console.log("connected account is:", account[0]);

        // set up network ID that we can connect to Tether contract
        const networkID = await web3.eth.net.getId();
        console.log("connected networkID is:", networkID);

        // load Tether Contract
        const tetherData = Tether.networks[networkID];
        if (tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)  // create Tether object using ABI + Address 
            this.setState({ tether: tether });
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call(); // load Tether balance
            this.setState({ tetherBalance: tetherBalance.toString() });  // set to the state of tether.balance{}
            console.log('tether balance is:', tetherBalance.toString());
        } else { // if we dont load tether data
            alert('Error! Tether contract data not available. Consider changing to the Ganache network.')
        }

        // load Reward token Contract
        const rewardData = Reward.networks[networkID];
        if (rewardData) {
            const reward = new web3.eth.Contract(Reward.abi, rewardData.address)  // ABI + Address 
            this.setState({ reward });
            // load Tether balance
            let rewardBalance = await reward.methods.balanceOf(this.state.account).call();
            this.setState({ rewardBalance: rewardBalance.toString() }); 
            console.log('reward balance is:', rewardBalance);
        } else { 
            alert('Error! Reward contract data not available. Consider changing to the Ganache network.')
        }

        // load DecentralBank Contract
        const decentralBankData = DecentralBank.networks[networkID];
        if (decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)  
            this.setState({ decentralBank });
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({ stakingBalance: stakingBalance.toString() });  
            console.log('decentralBank stakingBalance is:', stakingBalance);
        } else { 
            alert('Error! Decentral Bank contract data not available. Consider changing to the Ganache network.')
        }

        this.setState({loading: false });
    }



    // load before the page render
    async UNSAFE_componentWillMount() { // runs when app mounts in browser
        await this.loadWeb3();  // run the loadWeb3 function + connect to metamask
        await this.loadBlockchainData(); // load blockchain data 
    }

    // constructor => set default state
    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            reward: {},
            decentralBank: {},
            tetherBalance: '0',
            rewardBalance: '0',
            stakingBalance: '0',
            loading: true,
        }
    }



    

    // business logic
    // two functions - one that stakes and one that Unstakes
    // use the DecentralBank contract - deposit tokens and unstaking 
    // ALL of this is for the staking: 
    // depositTones transferFrom ....
    // funciton approve transaction hash 
    // Staking Function ?? >> decentralBank.depositTokens(send transactionHash => )

    // staking function 
    stakeTokens = (amount) => {
        let ethAmount = Web3.utils.fromWei(amount, 'ether');
        this.setState({loading: true});
        // set approval for the decentralBank for given amount
        this.state.tether.methods.approval(this.state.decentralBank._address, amount)
        .send({from: this.state.account})
        .on('transactionHash', (hash) => {
            // depositTokens tether token to bank
            this.state.decentralBank.methods.depositTokens(amount)
            .send({from: this.state.account})
            .on('transactionHash', (hash) => {
                this.setState({loading: false});
            })
        })
    }

    // unstaking function 
    unstakeTokens = () => {
        this.setState({loading: true })
        // unstake from decentralBank
        this.state.decentralBank.methods.unstakeTokens()
        .send({from: this.state.account})
        .on('transactionHash', (hash) => {
            this.setState({loading:false})
        }) 
    }








    // web page html design
    render() {

        // check that contracts are load or not
        let content;
        {this.state.loading ? 
            content = <p id="loader" className="text-center" style={{margin: '30px'}}>Loading...</p> 
            :content = <Main 
            // load blockchain data in the state objects that are declared in constructor
                tetherBalance = {this.state.tetherBalance}
                rewardBalance = {this.state.rewardBalance}
                stakingBalance = {this.state.stakingBalance}
                stakeTokens = {this.stakeTokens}
                unstakeTokens={this.unstakeTokens}
            />}


        return (
            <div className="App" style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    <ParticleSettings />
                </div>
                <Navabr account={this.state.account} />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px', minHeight: '100vm'}}>
                            <div>
                               {content}
                            </div>
                        </main>
                    </div>
                </div>
                <div>{console.log(this.state.loading)}</div>
            </div>
        )
    }
}

export default App