
const hre = require("hardhat");

async function main() {
  
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let boredApeYachtClub;
  let mgdc;
  let mGDCbreedBAYC;
  let mGDCStake;
  [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();

  console.log(owner, addr1, addr2, addr3,addrs)

  const BoredApeYachtClub = await hre.ethers.getContractFactory("BoredApeYachtClub");
  boredApeYachtClub = await BoredApeYachtClub.deploy("BoredApeYachtClub", "BAYC", 50000, 1650479190);
  await boredApeYachtClub.deployed();
 
  const MGDC = await hre.ethers.getContractFactory("MGDC");
  mgdc = await MGDC.deploy();
  await mgdc.deployed();


  const MGDCbreedBAYC = await hre.ethers.getContractFactory("MGDCbreedBAYC");
  mGDCbreedBAYC = await MGDCbreedBAYC.deploy(boredApeYachtClub.address, mgdc.address);
  await mGDCbreedBAYC.deployed();
  boredApeYachtClub.flipSaleState()

  const MGDCStake = await hre.ethers.getContractFactory("MGDCStake");
  mGDCStake = await MGDCStake.deploy(mgdc.address);
  await mGDCStake.deployed();



  console.log("BoredApeYachtClub deployed to:", boredApeYachtClub.address);
  console.log("mgdc deployed to:", mgdc.address);
  console.log("MGDCbreedBAYC deployed to:", mGDCbreedBAYC.address);
  console.log("MGDCStake deployed to:", mGDCStake.address);

  // mgdc.setPresaleActive(false)
  // mgdc.setIsActive(true)
  // mGDCbreedBAYC.setIsActive(true)
  // mGDCStake.toggle()

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });