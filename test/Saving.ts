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

  it('Should create deposit correctly', async function () {
    const { save } = await loadFixture(deploySave)
    await save.deposit('uuid12', ethers.toBigInt(1))
    const list = await save.getTransactions('uuid12')
    expect(list.length).to.equal(1)
  });

  it('Should create withdraw correctly', async function () {
    const { save } = await loadFixture(deploySave)
    await save.withdraw('uuid12', ethers.toBigInt(1))
    const list = await save.getTransactions('uuid12')
    console.log(list)
    expect(list.length).to.equal(1)
  });
}

)


