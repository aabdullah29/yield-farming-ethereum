// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    constructor() {
        owner= msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner);
         _;
    }
    
    function setOwner(address _address) public restricted{
        owner = _address;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restricted {
        owner = address(this);
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
        owner = msg.sender;
    }
}