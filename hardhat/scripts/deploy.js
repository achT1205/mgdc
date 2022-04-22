const hre = require("hardhat");

async function main() {
  const BAYC = await hre.ethers.getContractFactory("BoredApeYachtClub"); // 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
  const bayc = await BAYC.deploy(
    "BoredApeYachtClub",
    "BAYC",
    10000,
    Date.parse("2022-01-01")
  );
  await bayc.deployed();
  console.log("BAYC deployed to:", bayc.address);

  const HAPE = await hre.ethers.getContractFactory("HapeBeastToken"); // 0x4Db1f25D3d98600140dfc18dEb7515Be5Bd293Af
  const hape = await HAPE.deploy("0x609dfe72eef3ccb069bc2682b3114763e6f25b8f ");
  await hape.deployed();
  console.log("HAPE deployed to:", hape.address);

  const MGDC = await hre.ethers.getContractFactory("MGDC"); // 0x0191c41DBceB20a612b25137133ca719E84f7933
  const mgdc = await MGDC.deploy();
  await mgdc.deployed();
  console.log("MGDC deployed to:", mgdc.address);

  const BKID = await hre.ethers.getContractFactory("MGDCbreedBAYC"); // 0x563cb938f8945d01c1795bb7e457123e65983c06
  const bkid = await BKID.deploy();
  await bkid.deployed();
  console.log("BKID deployed to:", bkid.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to deploy smart contracts", error);
    process.exit(1);
  });
