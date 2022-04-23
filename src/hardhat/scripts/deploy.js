
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
  [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();

  console.log(owner, addr1, addr2, addr3,addrs)

  const BoredApeYachtClub = await hre.ethers.getContractFactory("BoredApeYachtClub");
  boredApeYachtClub = await BoredApeYachtClub.deploy("BoredApeYachtClub", "BAYC", 50000, 1650479190);
  await boredApeYachtClub.deployed();
  console.log("BoredApeYachtClub deployed to:", boredApeYachtClub.address);

  const MGDC = await hre.ethers.getContractFactory("MGDC");
  mgdc = await MGDC.deploy();
  await mgdc.deployed();
  console.log("mgdc deployed to:", mgdc.address);


  const MGDCbreedBAYC = await hre.ethers.getContractFactory("MGDCbreedBAYC");
  mGDCbreedBAYC = await MGDCbreedBAYC.deploy(boredApeYachtClub.address, mgdc.address);
  await mGDCbreedBAYC.deployed();
  console.log("MGDCbreedBAYC deployed to:", mGDCbreedBAYC.address);
  boredApeYachtClub.flipSaleState()

  // mgdc.setPresaleActive(false)
  // mgdc.setIsActive(true)
  // mGDCbreedBAYC.setIsActive(true)


  // await boredApeYachtClub.connect(addr1).mintApe(3, {
  //   value: hre.ethers.utils.parseEther("0.000006"),
  // });
  // let balance = await boredApeYachtClub.connect(addr1).balanceOf(addr1.address);
  // console.log("balance BAYC: ==>", balance)



  // await mgdc.connect(owner).mintMultipleByOwner([5529,1168,5021], {
  //   value: hre.ethers.utils.parseEther("0.000075"),
  // });
  //  balance = await mgdc.connect(owner).balanceOf(owner.address);
  // console.log("balance MGDC: ==>", balance)


  // await mGDCbreedBAYC.connect(addr2).listBreeding(0, {
  //   value: ethers.utils.parseEther("0.000025"),
  // });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
