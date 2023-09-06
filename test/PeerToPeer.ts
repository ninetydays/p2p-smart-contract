import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PeerToPeer", function () {
  const AMOUNT = 10000;
  const DURATION = 30;
  const PAYOFF = 10;
  const INVALID = 0;

  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, lender, borrower] = await ethers.getSigners();

    const PeerToPeer = await ethers.getContractFactory("PeerToPeer");
    const contract = await PeerToPeer.deploy();

    return { contract, owner, lender, borrower };
  }

  describe("deployment", function () {
    it("should set the right balance", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await ethers.provider.getBalance(contract.target)).to.equal(0);
    });

    it("should set the empty request list", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.getRequests()).to.deep.equals([]);
    });

    it("should set the empty loan list", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.getLoans()).to.deep.equals([]);
    });
  });

  describe("Request", function () {
    it("should request a loan", async function () {
      const { contract, borrower } = await loadFixture(deployFixture);
      await expect(contract.connect(borrower).request(AMOUNT, DURATION, PAYOFF))
        .not.to.be.reverted;
    });

    it("should emit a Requested event", async function () {
      const { contract, borrower } = await loadFixture(deployFixture);
      await expect(contract.connect(borrower).request(AMOUNT, DURATION, PAYOFF))
        .to.emit(contract, "Requested")
        .withArgs(borrower.address, AMOUNT, DURATION, PAYOFF); // We accept any value as `when` arg
    });

    it("should add new item in requests", async function () {
      const { contract, borrower } = await loadFixture(deployFixture);
      await contract.connect(borrower).request(AMOUNT, DURATION, PAYOFF);
      const requests = await contract.connect(borrower).getRequests();
      expect(requests.length).to.equal(1);
      expect(requests[0].amount).to.equal(AMOUNT);
      expect(requests[0].duration).to.equal(DURATION);
      expect(requests[0].payoff).to.equal(PAYOFF);
    });

    it("should be rejected if amount is not valid", async function () {
      const { contract, borrower } = await loadFixture(deployFixture);
      await expect(
        contract.connect(borrower).request(INVALID, DURATION, PAYOFF)
      ).to.be.revertedWith("amount has to be bigger than 0");
    });

    it("should be rejected if duration is not valid", async function () {
      const { contract, borrower } = await loadFixture(deployFixture);
      await expect(
        contract.connect(borrower).request(AMOUNT, INVALID, PAYOFF)
      ).to.be.revertedWith("duration has to be bigger than 0");
    });
  });

  describe("Cancel", function () {
    it("should cancel existing loan request", async function () {
      const { contract, borrower } = await loadFixture(deployFixture);
      await contract.connect(borrower).request(AMOUNT, DURATION, PAYOFF);
      await contract.connect(borrower).cancel();
      const requests = await contract.connect(borrower).getRequests();
      expect(requests.length).to.equal(0);
    });
  });

  describe("Pay", function () {
    it("should transfer money to borrower", async function () {
      const { contract, borrower, lender } = await loadFixture(deployFixture);
      await contract.connect(borrower).request(AMOUNT, DURATION, PAYOFF);
      const before = await ethers.provider.getBalance(borrower.address);
      const result = await lender.sendTransaction({
        from: lender.address,
        to: contract.target,
        value: AMOUNT,
      });
      await contract.connect(lender).pay(borrower.address);
      const after = await ethers.provider.getBalance(borrower.address);
      expect(after).to.be.equal(before + BigInt(AMOUNT));
    });

    it("should move item from requests to loans", async function () {
      const { contract, borrower, lender } = await loadFixture(deployFixture);
      await contract.connect(borrower).request(AMOUNT, DURATION, PAYOFF);
      const result = await lender.sendTransaction({
        from: lender.address,
        to: contract.target,
        value: AMOUNT,
      });
      await contract.connect(lender).pay(borrower.address);
      const requests = await contract.connect(borrower).getRequests();
      expect(requests.length).to.equal(0);
      const loans = await contract.connect(borrower).getLoans();
      expect(loans.length).to.equal(1);
    });
  });

  describe("Repay", function () {
    it("should repays a loan", async function () {
      const { contract, borrower, lender } = await loadFixture(deployFixture);
      await contract.connect(borrower).request(AMOUNT, DURATION, PAYOFF);
      await lender.sendTransaction({
        from: lender.address,
        to: contract.target,
        value: AMOUNT,
      });
      await contract.connect(lender).pay(borrower.address);
      const before = await ethers.provider.getBalance(lender.address);
      await borrower.sendTransaction({
        from: borrower.address,
        to: contract.target,
        value: AMOUNT + PAYOFF,
      });
      await contract.connect(borrower).repay();
      const after = await ethers.provider.getBalance(lender.address);
      expect(after).to.be.equal(before + BigInt(AMOUNT + PAYOFF));
    });
  });
});
