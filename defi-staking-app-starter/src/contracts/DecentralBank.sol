// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './Tether.sol';
import './RWD.sol';

contract DecentralBank {
    string public name= 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public  rwd;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;


    constructor(RWD _rwd, Tether _tether){
        tether=_tether;
        rwd= _rwd;
        owner=msg.sender;
    }

}