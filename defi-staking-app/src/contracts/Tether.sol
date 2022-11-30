// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Tether {
    string public name = "Tether Token";
    string public symbol = "USDT";
    uint256 totalSuply = 100000000000000000000000000; // 1 milion tokens
    uint8 decimals = 18;

    // map bor account balance
    mapping(address => uint256) public balanceOf;
    // map for approval
    mapping(address => mapping(address => uint256)) private _allowances;

    // events
    event Transfer(address indexed _from, address indexed _t0, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor() {
        balanceOf[msg.sender] = totalSuply;
    }

    // transfer the Tether token from msg.sender to other account
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balanceOf[msg.sender], "Not enough balance to transfer.");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // approve the other account to transfer some tokens
    function approval(address _spender, uint256 _token) public returns (bool success) {
        require(_token <= balanceOf[msg.sender], "Not enough balance to approve.");
        _allowances[msg.sender][_spender] = _token;
        emit Approval(msg.sender, _spender, _token);
        return true;
    }

    // approval account transfer Tether token from owner to other account
    function transferFrom(address _from, address _to, uint256 _token) public returns (bool success) {
        uint256 allowance = _allowances[_from][msg.sender];
        require(balanceOf[_from] >= _token && allowance >= _token, "Not enough balance to transfer or approved.");
        balanceOf[_to] += _token;
        balanceOf[_from] -= _token;
        _allowances[_from][msg.sender] -= _token;
        emit Transfer(_from, _to, _token);
        return true;
    }
}