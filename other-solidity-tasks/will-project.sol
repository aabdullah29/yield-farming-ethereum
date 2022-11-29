// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

contract Will{
    address owner;
    uint fortune;
    bool deceased;

    constructor() payable {
        owner = msg.sender;
        fortune = msg.value;
        deceased = false;
    }


    modifier OnlyOwner {
        require(msg.sender == owner, "caller should be owner");
        _;
    }

    modifier MustBeDeceased {
        require(deceased == true, "deceased is not true");
        _;
    }

    address payable [] familyMembers;
    mapping (address => uint) inheritance;

    // set new inheritance account for will
    function setInheritance(address payable wallet, uint amount) public {
        familyMembers.push(wallet);
        inheritance[wallet] = amount;
    }

    // distribute will amount
    function payout() private MustBeDeceased{
        for(uint i=0; i<familyMembers.length; i++){
            familyMembers[i].transfer(inheritance[familyMembers[i]]);
        }
    }

    // oracle function call for payout
    function hasDeceased() public OnlyOwner {
        deceased = true;
        payout();
    }
}