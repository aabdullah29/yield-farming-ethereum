# yield-farming-ethereum


## run the project
- `cd defi-staking-app`
- `yarn`
- `truffle deploy`
- `truffle test`
- `truffle migrate --reset`
- `truffle exec srcipts/issue-tokens.js`
- `npm run start`


## components
all front end react code is in components directory

## contracts
all smart contracts are in contract directory

## migrations
migrations directory have the scripts for deploy the smart contract using truffle

## scripts
script directory has the script for issue RWD tokens to stakers 

## test
test directory has the test script for testing the smart contract





# 22-12-02
- write ParticleSettings script for render the page
- set ParticleSettings in App.js render block
- write the partical-animations script using `react-tsparticles`
- write airdrop script for timer
- if cuctomer stake morethen 50 tether token then wait for timer for withdraw
- write the constructor for Component to set the initial state 
- write startTimer function to calculate time
- writ ecomponentDidMount function for mount the state for specific time
- wiredup the airdrop component with the main component
- write the countDown function for count the secon after each second
- write the startTimer function for start the timer
- ste the airdrop timer on stake using airdropRewardTokens function







