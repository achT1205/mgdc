/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function mineBlocks(blockNumber) {
  while (blockNumber > 0) {
    blockNumber--;
    await hre.network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
}


describe("Tests", function () {

  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let boredApeYachtClub;
  let mgdc;
  let mGDCbreedBAYC;
  let mGDCStake;
  let hapebeastToken;
  let mGDCbreedHAPE;

  before(async () => {

    [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    const BoredApeYachtClub = await hre.ethers.getContractFactory("BoredApeYachtClub");
    boredApeYachtClub = await BoredApeYachtClub.deploy("BoredApeYachtClub", "BAYC", 50000, 1650479190);
    await boredApeYachtClub.deployed();
    console.log("BoredApeYachtClub deployed to:", boredApeYachtClub.address);

    const HapebeastToken = await hre.ethers.getContractFactory("HapebeastToken");
    hapebeastToken = await HapebeastToken.deploy();
    await hapebeastToken.deployed();
    console.log("HapebeastToken deployed to:", hapebeastToken.address);

    const MGDC = await hre.ethers.getContractFactory("MGDC");
    mgdc = await MGDC.deploy();
    await mgdc.deployed();
    console.log("mgdc deployed to:", mgdc.address);


    const MGDCbreedBAYC = await hre.ethers.getContractFactory("MGDCbreedBAYC");
    mGDCbreedBAYC = await MGDCbreedBAYC.deploy(boredApeYachtClub.address, mgdc.address);
    await mGDCbreedBAYC.deployed();
    console.log("MGDCbreedBAYC deployed to:", mGDCbreedBAYC.address);
    boredApeYachtClub.flipSaleState()

    const MGDCStake = await hre.ethers.getContractFactory("MGDCStake");
    mGDCStake = await MGDCStake.deploy(mgdc.address);
    await mGDCStake.deployed();


    const MGDCbreedHAPE = await hre.ethers.getContractFactory("MGDCbreedHAPE");
    mGDCbreedHAPE = await MGDCbreedHAPE.deploy("hapekid/not/reveal/uri", mGDCStake.address, mgdc.address, hapebeastToken.address);
    await mGDCbreedHAPE.deployed();


    mgdc.setPresaleActive(false)
    mgdc.setIsActive(true)
    mGDCbreedBAYC.setIsActive(true)
    mGDCbreedHAPE.setIsActive(true)
    mGDCStake.toggle()

  });

  it("Should mint 3 BAYC for addr1", async function () {
    await boredApeYachtClub.connect(addr1).mintApe(3, {
      value: ethers.utils.parseEther("0.00000006"),
    });
    const balance = await boredApeYachtClub.connect(addr1).balanceOf(addr1.address);
    console.log("balance BAYC: ==>", balance)
  });


  it("Should mint 3 MGDC for addr2", async function () {
    await mgdc.connect(owner).mintMultipleByOwner([addr1.address, addr2.address, addr3.address, addr1.address], [1, 2, 3, 4]);
    const balance1 = await mgdc.connect(addr1).balanceOf(addr1.address);
    console.log("balance1 MGDC: ==>", balance1)

    const balance2 = await mgdc.connect(addr2).balanceOf(addr2.address);
    console.log("balance2 MGDC: ==>", balance2)

    const balance3 = await mgdc.connect(addr3).balanceOf(addr3.address);
    console.log("balance3 MGDC: ==>", balance3)
  });

  it("addr1 should list token number 0", async function () {
    await mGDCbreedBAYC.connect(addr1).listBreeding(1, {
      value: ethers.utils.parseEther("0.000000025"),
    });
  });

  it("addr2 should list token number 0", async function () {
    await mGDCbreedBAYC.connect(addr2).listBreeding(2, {
      value: ethers.utils.parseEther("0.000000025"),
    });
  });

  it("addr3 should list token number 0", async function () {
    await mGDCbreedBAYC.connect(addr3).listBreeding(3, {
      value: ethers.utils.parseEther("0.000000025"),
    });
  });


  it("addr1[token 0] shoud breed addr2[token 1]", async function () {
    await mGDCbreedBAYC.connect(addr1).breed(2, {
      value: ethers.utils.parseEther("0.000000025"),
    });
  });


  it("addr1[token 0] shoud breed addr3[token 1]", async function () {
    await mGDCbreedBAYC.connect(addr1).breed(3, {
      value: ethers.utils.parseEther("0.000000025"),
    });
  });

  it("set approval for all ", async function () {
    await mgdc.connect(addr1).setApprovalForAll(mGDCStake.address, true);
  });


  it("ashould stake ", async function () {
    await mGDCStake.connect(addr1).stakeMGDCByIds([1, 4]);
  });

  it("shoud mint 1000 blocks", async function () {
    await mineBlocks(1000);
  });

  it("should get staked tokens ", async function () {
    const list = await mGDCStake.connect(addr1).getMGDCStaked(addr1.address);
    console.log("staked list : ", list)
  });

  it("should get reward", async function () {
    const reward = await mGDCStake.connect(addr1).getAllRewards(addr1.address);
    console.log("staked reward : ", reward)
  });

  /* Breed HAPE start */

  it("Should mint 2 HAPE for addr2", async function () {
    await hapebeastToken.connect(owner).mintbyOwner(2, addr2.address);
    const balance = await hapebeastToken.connect(addr2).balanceOf(addr2.address);
    console.log("balance HAPE: ==>", balance)
  });

  it("Should mint 3 MGDC for addr1", async function () {
    await mgdc.connect(owner).mintMultipleByOwner([addr1.address, addr1.address, addr1.address], [5, 6, 7]);
    const balance1 = await mgdc.connect(addr1).balanceOf(addr1.address);
    console.log("balance1 MGDC: ==>", balance1)
  });

  it("addr1 shoud list 2 MGDCs on MGDCbreedHAPE", async function () {
    await mGDCbreedHAPE.connect(addr1).listBreedingWithMGDCToken(5);
    await mGDCbreedHAPE.connect(addr1).listBreeding(5, {
      value: ethers.utils.parseEther("0.25"),
    });
    await mGDCbreedHAPE.connect(owner).listBreedingByOwner(addr1.address, 6);
    await mGDCbreedHAPE.connect(owner).listBreedingByOwner(addr1.address, 7);
  });

  it("addr2 should breed MGDC 5", async function () {
    await mGDCbreedHAPE.connect(addr2).breed(5, { value: ethers.utils.parseEther("0.25"), });
  });

  it("shoud airdrop mgdcs token to addr2", async function () {
    await mGDCStake.connect(owner).airDropToken(addr2.address, 10);
  });

  it("shoud approve contract to spend token", async function () {
    await mGDCStake.connect(addr2).approve(mGDCbreedHAPE.address, ethers.utils.parseEther("1"));
  });

  it("addr2 should breed MGDC 6", async function () {
    await mGDCbreedHAPE.connect(addr2).breedWithMGDCToken(6);
  });

  it("should breed MGDC 7 by owner", async function () {
    await mGDCbreedHAPE.connect(owner).breedByOwner(addr2.address, 7);
  });

  it("should mint hape kid", async function () {
    await mGDCbreedHAPE.connect(owner).mintHapeKidByOwner(addr2.address);
  });

});