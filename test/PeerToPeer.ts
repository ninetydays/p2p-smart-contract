import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PeerToPeer", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, lender, borrower] = await ethers.getSigners();

    const PeerToPeer = await ethers.getContractFactory("PeerToPeer");
    const lock = await PeerToPeer.deploy();

    return { lock, owner, lender, borrower };
  }

  describe("deployment", function () {
    it("should set the right balance", async function () {
      const { lock } = await loadFixture(deployFixture);
      expect(await ethers.provider.getBalance(lock.target)).to.equal(0);
    });

    it("should set the empty request list", async function () {
      const { lock } = await loadFixture(deployFixture);
      expect(await lock.getRequests()).to.deep.equals([]);
    });

    it("should set the empty loan list", async function () {
      const { lock } = await loadFixture(deployFixture);
      expect(await lock.getLoans()).to.deep.equals([]);
    });
  });

  describe("Request", function () {
    it("should request a loan", async function () {});

    it("should be rejected if amount is not duration", async function () {});

    it("should be rejected if amount is not valid", async function () {});
  });

  describe("Cancel", function () {
    it("should cancel existing loan request", async function () {});
  });

  describe("Pay", function () {
    it("should transfer money to borrower", async function () {});
    it("should withdraw money from lender", async function () {});
    it("should remove the request from the list", async function () {});
  });

  describe("Repay", function () {});
});
