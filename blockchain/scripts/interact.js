const hre = require("hardhat");

async function main() {
  const DrugTracker = await hre.ethers.getContractFactory("DrugTracker");
  const contract = await DrugTracker.attach("0xYourContractAddress");

  console.log("Creating batch...");
  const tx1 = await contract.createBatch("batch123", "MedicineA", "India", "Paracetamol", 1720000000);
  await tx1.wait();
  console.log("Batch created.");

  console.log("Transferring batch...");
  const tx2 = await contract.transferBatch("batch123", "0xRecipientAddress");
  await tx2.wait();
  console.log("Batch transferred.");

  console.log("Flagging tamper...");
  const tx3 = await contract.flagTamper("batch123");
  await tx3.wait();
  console.log("Tamper flagged.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

