// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Token is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    constructor(string memory _name, string memory _symbol, uint256 _totalSupply){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;

        owner = msg.sender;
        balances[owner] = _totalSupply;
        emit OwnershipTransferred(address(0), owner);
        emit Transfer(address(0), owner, _totalSupply);
    }

    modifier onlyOwner() {
        require(owner == _msgSender(), "Ownable: caller is not the owner");
        _;
        
    }

    function transferOwnership(address _newOwner) public virtual onlyOwner {
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(oldOwner, _newOwner);
    }

    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        address from = _msgSender();
        _transfer(from, to, amount);
        return true;
    }

    function allowance(address _owner, address _spender) public view override returns (uint256) {
        return allowances[_owner][_spender];
    }

    function approve(address _spender, uint256 _amount) public override returns (bool) {
        address _owner = _msgSender();
        _approve(_owner, _spender, _amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(_from, spender, _amount);
        _transfer(_from, _to, _amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Token: transfer from the zero address");
        require(to != address(0), "Token: transfer to the zero address");

        uint256 fromBalance = balances[from];
        require(fromBalance >= amount, "Token: transfer amount exceeds balance");
        unchecked {
            balances[from] = fromBalance - amount;
            balances[to] += amount;
        }

        emit Transfer(from, to, amount);
    }

    function _approve(address _owner, address _spender, uint256 _amount) internal {
        require(_owner != address(0), "Token: approve from the zero address");
        require(_spender != address(0), "Token: approve to the zero address");

        allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    function _spendAllowance(address _owner, address _spender, uint256 _amount) internal {
        uint256 currentAllowance = allowance(_owner, _spender);

        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= _amount, "ERC20: insufficient allowance");

            unchecked {
                _approve(_owner, _spender, currentAllowance - _amount);
            }
        }
    }

    function mint(address _account, uint256 amount) public onlyOwner{
        totalSupply += amount;
        balances[_account] += amount;
        emit Transfer(address(0), _account, amount);
    }
}
