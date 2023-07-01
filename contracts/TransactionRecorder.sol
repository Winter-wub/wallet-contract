// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TransactionRecorder is Ownable {
    struct Transaction {
        uint256 timestamp;
        uint256 amount;
        bool isDeposit;
    }

    struct Account {
        uint256 amount;
        bool isActive;
        uint256 updatedAt;
    }

    event Withdraw(string userId, uint256 amount, uint256 currentBalance);
    event Deposit(string userId, uint256 amount, uint256 currentBalance);

    mapping(string => Transaction[]) private transactions;
    mapping(string => Account) private accounts;

    function deposit(string memory userId, uint256 amount) public onlyOwner {
        Transaction memory transaction = Transaction({
            timestamp: block.timestamp,
            amount: amount,
            isDeposit: true
        });
        accounts[userId].amount = accounts[userId].amount + amount;
        transactions[userId].push(transaction);
        emit Deposit(userId, amount, accounts[userId].amount);
    }

    function withdraw(string memory userId, uint256 amount) public onlyOwner {
        Transaction memory transaction = Transaction({
            timestamp: block.timestamp,
            amount: amount,
            isDeposit: false
        });
        require(accounts[userId].amount >= amount);
        accounts[userId].amount = accounts[userId].amount - amount;
        transactions[userId].push(transaction);
        emit Withdraw(userId, amount, accounts[userId].amount);
    }

    function getTransactions(
        string memory userId
    ) public view returns (Transaction[] memory) {
        return transactions[userId];
    }

    function getBalance(string memory userId) public view returns (uint256) {
        return accounts[userId].amount;
    }
}
