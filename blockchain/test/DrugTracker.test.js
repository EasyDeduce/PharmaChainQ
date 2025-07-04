const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DrugTracker Contract", function () {
    let drugTracker;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const DrugTracker = await ethers.getContractFactory("DrugTracker");
        drugTracker = await DrugTracker.deploy(); // No need for deployed() in ethers v6
    });

    it("should create a batch", async function () {
        await drugTracker.createBatch("batch1", "MedA", "India", "Paracetamol", 1720000000);
        const batchOwner = await drugTracker.getBatchOwner("batch1");
        expect(batchOwner).to.equal(owner.address);
    });

    it("should transfer a batch", async function () {
        await drugTracker.createBatch("batch1", "MedA", "India", "Paracetamol", 1720000000);
        await drugTracker.transferBatch("batch1", addr1.address);
        const newOwner = await drugTracker.getBatchOwner("batch1");
        expect(newOwner).to.equal(addr1.address);
    });

    it("should allow non-owner to flag tamper", async function () {
        await drugTracker.createBatch("batch1", "MedA", "India", "Paracetamol", 1720000000);
        await drugTracker.transferBatch("batch1", addr1.address);
        await drugTracker.connect(addr2).flagTamper("batch1");
        const tampered = await drugTracker.isBatchTampered("batch1");
        expect(tampered).to.equal(true);
    });
});
