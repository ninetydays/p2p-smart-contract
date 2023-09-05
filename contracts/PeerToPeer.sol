// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PeerToPeer {
    struct Request {
        uint amount;
        uint duration;
        uint payoff;
    }

    struct Loan {
        uint amount;
        uint duration;
        uint payoff;
        address payable lender;
        address payable borrower;
    }

    mapping(address => Request) private requests;
    mapping(address => Loan) private loans;

    event Requested(
        address indexed borrower,
        uint amount,
        uint duration,
        uint payoff
    );
    event Cancelled(address indexed borrower);
    event Paid(address indexed lender, address indexed borrower, uint amount);
    event Repaid(
        address indexed lender,
        address indexed borrower,
        uint amount,
        uint payoff
    );

    function request(uint amount, uint duration, uint payoff) {
        require(
            requests[msg.sender].amount > 0,
            "You can request only one loan"
        );
        require(amount > 0, "amount has to be bigger than 0");
        require(duration > 0, "duration has to be bigger than 0");

        requests[msg.sender] = Request({
            amount: amount,
            duration: duration,
            payoff: payoff
        });

        emit Requested(msg.sender, amount, duration, payoff);
    }

    function cancel() {
        delete requests[msg.sender];
        emit Cancelled(msg.sender);
    }

    function pay(address payable borrower) payable {
        Request request = requests[borrower];
        (bool succ, ) = payable(this).call{value: request.amount}("");
        require(succ, "Failed to send Ether");
        (bool succ, ) = borrower.call{value: request.amount}("");
        require(succ, "Failed to send Ether");
        loans[borrower] = Loan({
            amount: request.amount,
            duration: request.duration,
            payoff: request.payoff,
            lender: msg.sender,
            borrower: borrower
        });
        emit Paid(msg.sender, borrower, request.amount);
        delete requests[borrower];
    }

    function repay() payable {
        Loan loan = loans[msg.sender];
        (bool succ, ) = loan.lender.call{value: loan.payoff + loan.amount}("");
        require(succ, "Failed to send Ether");
        emit Repaid(loan.lender, msg.sender, loan.amount, loan.payoff);
        delete loans[msg.sender];
    }
}
