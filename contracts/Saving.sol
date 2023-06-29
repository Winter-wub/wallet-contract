// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionRecorder {
    struct Transaction {
        uint256 timestamp;
        uint256 amount;
        bool isDeposit;
    }

    mapping(string => Transaction[]) private transactions;

    function deposit(string memory userId, uint256 amount) public {
        Transaction memory transaction = Transaction({
            timestamp: block.timestamp,
            amount: amount,
            isDeposit: true
        });
        transactions[userId].push(transaction);
    }

    function withdraw(string memory userId, uint256 amount) public {
        Transaction memory transaction = Transaction({
            timestamp: block.timestamp,
            amount: amount,
            isDeposit: false
        });
        transactions[userId].push(transaction);
    }

    function getTransactions(
        string memory userId
    ) public view returns (Transaction[] memory) {
        return transactions[userId];
    }
}
