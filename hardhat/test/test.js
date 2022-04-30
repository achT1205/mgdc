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

  before(async () => {

    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
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

    const MGDCStake = await hre.ethers.getContractFactory("MGDCStake");
    mGDCStake = await MGDCStake.deploy(mgdc.address);
    await mGDCStake.deployed();

    mgdc.setPresaleActive(false)
    mgdc.setIsActive(true)
    mGDCbreedBAYC.setIsActive(true)
    mGDCStake.toggle()

  });

  it("Should mint 3 BAYC for addr1", async function () {
    await boredApeYachtClub.connect(addr1).mintApe(3, {
      value: ethers.utils.parseEther("0.000006"),
    });
    const balance = await boredApeYachtClub.connect(addr1).balanceOf(addr1.address);
    console.log("balance BAYC: ==>", balance)
  });


  it("Should mint 3 MGDC for addr2", async function () {
    await mgdc.connect(owner).mintMultipleByOwner([addr1.address, addr2.address, addr3.address, addr1.address], [1,2,3,4]);
    const balance1 = await mgdc.connect(addr1).balanceOf(addr1.address);
    console.log("balance1 MGDC: ==>", balance1)

    const balance2 = await mgdc.connect(addr2).balanceOf(addr2.address);
    console.log("balance2 MGDC: ==>", balance2)

    const balance3 = await mgdc.connect(addr3).balanceOf(addr3.address);
    console.log("balance3 MGDC: ==>", balance3)
  });

  it("addr1 should list token number 0", async function () {
    await mGDCbreedBAYC.connect(addr1).listBreeding(1, {
      value: ethers.utils.parseEther("0.000025"),
    });
  });

  it("addr2 should list token number 0", async function () {
    await mGDCbreedBAYC.connect(addr2).listBreeding(2, {
      value: ethers.utils.parseEther("0.000025"),
    });
  });

  it("addr3 should list token number 0", async function () {
    await mGDCbreedBAYC.connect(addr3).listBreeding(3, {
      value: ethers.utils.parseEther("0.000025"),
    });
  });


  it("addr1[token 0] shoud breed addr2[token 1]", async function () {
    await mGDCbreedBAYC.connect(addr1).breed(2, {
      value: ethers.utils.parseEther("0.000025"),
    });
  });


  it("addr1[token 0] shoud breed addr3[token 1]", async function () {
    await mGDCbreedBAYC.connect(addr1).breed(3, {
      value: ethers.utils.parseEther("0.000025"),
    });
  });

  it("set approval for all ", async function () {
    await mgdc.connect(addr1).setApprovalForAll(mGDCStake.address, true);
  });


  it("ashould stake ", async function () {
    await mGDCStake.connect(addr1).stakeMGDCByIds([1,4]);
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


});