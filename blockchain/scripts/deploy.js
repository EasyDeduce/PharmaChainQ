const hre = require("hardhat");

async function main() {
    const DrugTracker = await hre.ethers.getContractFactory("DrugTracker");
    const drugTracker = await DrugTracker.deploy();

    await drugTracker.waitForDeployment();

    console.log(`DrugTracker deployed to: ${drugTracker.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

