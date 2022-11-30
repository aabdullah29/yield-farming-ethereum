import React, {Component} from 'react';
import './App.css';
import Navabr from './Navbar';
// import Main from './Main';
import Web3 from 'web3';
// import Tether from '../truffle_abis/Tether.json';
// import Reward from '../truffle_abis/Reward.json';
// import DecentralBank from '../truffle_abis/DecentralBank.json';
// import ParticleSettings from './ParticleSettings';




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


    // load in blockchain data 
    async loadBlockchainData() {
        const web3 = await window.web3;
        const account = await web3.eth.getAccounts(); // get the account from our blockchain data 
        this.setState({ account: account[0] });
        console.log("connected account is:", account[0]);
    }



    // load before the page render
    async UNSAFE_componentWillMount() { // runs when app mounts in browser
        await this.loadWeb3();  // run the loadWeb3 function + connect to metamask
        await this.loadBlockchainData(); // load blockchain data 
    }

    // constructor
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


    render() {
        return (
            <div className="App" style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    {/* <ParticleSettings /> */}
                </div>
                <Navabr account={this.state.account} />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px', minHeight: '100vm'}}>
                            <div>
                               {/* {content} */}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App