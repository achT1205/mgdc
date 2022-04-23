/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Tests", function () {

  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let boredApeYachtClub;
  let mgdc;
  let mGDCbreedBAYC;

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

    mgdc.setPresaleActive(false)
    mgdc.setIsActive(true)
    mGDCbreedBAYC.setIsActive(true)

  });

  it("Should mint 3 BAYC for addr1", async function () {
    await boredApeYachtClub.connect(addr1).mintApe(3, {
      value: ethers.utils.parseEther("0.000006"),
    });
    const balance = await boredApeYachtClub.connect(addr1).balanceOf(addr1.address);
    console.log("balance BAYC: ==>", balance)
  });


  it("Should mint 3 MGDC for addr2", async function () {
    await mgdc.connect(addr2).mintNFT(3, {
      value: ethers.utils.parseEther("0.000075"),
    });
    const balance = await mgdc.connect(addr2).balanceOf(addr2.address);
    console.log("balance MGDC: ==>", balance)
  });

  it("addr2 should list token number 0", async function () {
    await mGDCbreedBAYC.connect(addr2).listBreeding(0, {
      value: ethers.utils.parseEther("0.000025"),
    });
  });


  it("addr1[token 0] shoud breed addr2[token 1]", async function () {
    await mGDCbreedBAYC.connect(addr1).breed(0, {
      value: ethers.utils.parseEther("0.000025"),
    });
  });



  

});
