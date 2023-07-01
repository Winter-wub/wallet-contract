import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TransactionRecorder } from "../typechain-types";

describe("Saving", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySave() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const Save = await ethers.getContractFactory("TransactionRecorder");
    const save = await Save.deploy() as TransactionRecorder;

    return { save, owner, otherAccount };
  }

  describe('Functional', () => {
    it('Should create deposit correctly', async function () {
      const userId = 'uuid12'
      const { save } = await loadFixture(deploySave)
      await save.deposit(userId, ethers.toBigInt(1))
      const list = await save.getTransactions(userId)
      expect(list.length).to.equal(1)
    });


    it('Should create withdraw correctly', async function () {
      const userId = 'uuid12'
      const { save } = await loadFixture(deploySave)
      await save.deposit(userId, ethers.toBigInt(1))
      await save.withdraw(userId, ethers.toBigInt(1))
      const list = await save.getTransactions(userId)
      expect(list.length).to.equal(2)
    });

    it('Should not create withdraw correctly when balance is not enough', async function () {
      const userId = 'uuid12'
      const { save } = await loadFixture(deploySave)
      await expect(save.withdraw(userId, ethers.toBigInt(1))).to.be.reverted;
      const list = await save.getTransactions(userId)
      expect(list.length).to.equal(0)
    });

    it('Should get balance currently', async function () {
      const userId = 'uuid12'
      const { save } = await loadFixture(deploySave)
      await save.deposit(userId, ethers.toBigInt(1))
      const balance = await save.getBalance(userId)
      expect(balance).to.equal(ethers.toBigInt(1))
    });
  })

  describe('Event', () => {
    it('Should emit Deposit event', async function () {
      const userId = 'uuid12'
      const { save } = await loadFixture(deploySave)
      await expect(save.deposit(userId, ethers.toBigInt(1)))
        .to.emit(save, 'Deposit')
        .withArgs(userId, ethers.toBigInt(1), ethers.toBigInt(1))
    })

    it('Should emit Withdraw event', async function () {
      const userId = 'uuid12'
      const { save } = await loadFixture(deploySave)
      await save.deposit(userId, ethers.toBigInt(1))
      await expect(save.withdraw(userId, ethers.toBigInt(1)))
        .to.emit(save, 'Withdraw')
        .withArgs(userId, ethers.toBigInt(1), ethers.toBigInt(0))
    })
  })
})


