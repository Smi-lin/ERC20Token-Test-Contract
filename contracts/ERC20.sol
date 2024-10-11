// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract DLToken{

    //the state variables
    string tokenName;
    string tokenSymbol;
    uint256 totalSupply;
    address owner;

    //making an amount tracable by address
    mapping (address user => uint256) balances;
    //making an amount tracable by address A  and address A traced by address B
    //key => (key => value)
    mapping (address => mapping (address => uint256)) allow;

    constructor(string memory _name, string memory _symbol){
        tokenName = _name;
        tokenSymbol = _symbol;
        owner = msg.sender;
        //mint method
        mint(1_000_000, owner);
    }

    // event for logging
    event Transfer(address indexed sender, address indexed reciever, uint256 amount);

    event Approval(address indexed owner, address indexed spender, uint256 amount);

    
    
    function getTokenName() external view returns (string memory){
        return tokenName;
    }

    function getSymbol() external view returns (string memory){
        return tokenSymbol;
    }

    function getTotalSupply() external view returns (uint256){
        return totalSupply;
    }

    function decimal() external pure returns(uint8){
        return 18;
    }

    //balance check
    function balanceOf(address _address) external view returns (uint256){
        return balances[_address];
    }

    function transfer(address _receiver, uint256 _amountOfToken) external {

    require(_receiver != address(0), "Address is not allowed");
    require(_amountOfToken <= balances[msg.sender], "You can't transfer more than what is available");

    uint256 burnAmount = (_amountOfToken * 5) / 100; 
    uint256 transferAmount = _amountOfToken - burnAmount; 

    balances[msg.sender] -= _amountOfToken;
    balances[_receiver] += transferAmount;

    totalSupply -= burnAmount;

    emit Transfer(msg.sender, _receiver, transferAmount);
    emit Transfer(msg.sender, address(0), burnAmount); 
 }
 



    function approve(address _delegate, uint256 _amountOfToken) external {
        require(balances[msg.sender] > _amountOfToken, "Balance is not enough");

        allow[msg.sender][_delegate] = _amountOfToken;

        emit Approval(msg.sender, _delegate, _amountOfToken);
    }


    function allowance(address _owner, address _delegate) external view returns (uint) {
        return allow[_owner][_delegate];
    }

    function transferFrom(address _owner, address _buyer, uint256 _amountOfToken) external {
        //sanity check
        require(_owner != address(0), "Address is not allowed");
        require(_buyer != address(0), "Address is not allowed");

        uint256 burnAmount = (_amountOfToken * 5) / 100; 
        uint256 transferAmount = _amountOfToken - burnAmount; 

        balances[_owner] -= _amountOfToken;

        allow[_owner][msg.sender] -= _amountOfToken;

        balances[_buyer] += transferAmount;

        totalSupply -= burnAmount;

        emit Transfer(_owner, _buyer, transferAmount);
        emit Transfer(_owner, address(0), burnAmount); 
    }


    function burn(address _address, uint256 _amount) public{
        balances[_address] = balances[_address] - _amount;
        totalSupply = totalSupply - _amount;

        emit Transfer(_address, address(0), _amount);
    }

    //method called in the constructor
    function mint(uint256 _amount, address _addr) public {
        uint256 actualSupply = _amount * (10**18);
        balances[_addr] = balances[_addr] + actualSupply;

        totalSupply = totalSupply + actualSupply;

        emit Transfer(address(0), _addr, actualSupply);
    }
}