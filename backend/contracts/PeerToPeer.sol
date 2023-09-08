// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

struct Request {
    uint amount;
    uint duration;
    uint payoff;
    address payable applicant;
}

struct Loan {
    uint amount;
    uint duration;
    uint payoff;
    address payable lender;
    address payable borrower;
}

contract PeerToPeer {
    address[] private applicants;
    mapping(address => Request) private requests;

    address[] private borrowers;
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

    fallback() external payable {}

    receive() external payable {}

    function removeFromArray(address[] storage arr, address value) private {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                arr[i] = arr[arr.length - 1];
                arr.pop();
                break;
            }
        }
    }

    function getRequests() public view returns (Request[] memory) {
        if (applicants.length == 0) {
            return new Request[](0);
        }
        Request[] memory newArray = new Request[](applicants.length);

        for (uint i = 0; i < applicants.length; i++) {
            newArray[i] = requests[applicants[i]];
        }
        return newArray;
    }

    function getLoans() public view returns (Loan[] memory) {
        if (borrowers.length == 0) {
            return new Loan[](0);
        }
        Loan[] memory newArray = new Loan[](borrowers.length);

        for (uint i = 0; i < borrowers.length; i++) {
            newArray[i] = loans[borrowers[i]];
        }
        return newArray;
    }

    function request(uint amount, uint duration, uint payoff) public {
        require(
            requests[msg.sender].amount == 0,
            "You can request only one loan"
        );
        require(amount > 0, "amount has to be bigger than 0");
        require(duration > 0, "duration has to be bigger than 0");

        requests[msg.sender] = Request({
            amount: amount,
            duration: duration,
            payoff: payoff,
            applicant: payable(msg.sender)
        });

        applicants.push(msg.sender);

        emit Requested(msg.sender, amount, duration, payoff);
    }

    function cancel() public {
        delete requests[msg.sender];
        removeFromArray(applicants, msg.sender);
        emit Cancelled(msg.sender);
    }

    function pay(address payable borrower) public payable {
        Request memory item = requests[borrower];
        (bool succ, ) = borrower.call{value: item.amount}("");
        require(succ, "Failed to send Ether");

        loans[borrower] = Loan({
            amount: item.amount,
            duration: item.duration,
            payoff: item.payoff,
            lender: payable(msg.sender),
            borrower: borrower
        });
        emit Paid(msg.sender, borrower, item.amount);
        removeFromArray(applicants, borrower);
        borrowers.push(borrower);
        delete requests[borrower];
    }

    function repay() public payable {
        Loan memory loan = loans[msg.sender];
        (bool succ, ) = loan.lender.call{value: loan.payoff + loan.amount}("");
        require(succ, "Failed to send Ether");
        emit Repaid(loan.lender, msg.sender, loan.amount, loan.payoff);
        removeFromArray(borrowers, msg.sender);
        delete loans[msg.sender];
    }
}
