const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserProfileNFT Contract", function () {
  let UserProfileNFT;
  let userProfileNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    UserProfileNFT = await ethers.getContractFactory("UserProfileNFT");
    [owner, addr1, addr2] = await ethers.getSigners();
    userProfileNFT = await UserProfileNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await userProfileNFT.owner()).to.equal(owner.address);
    });

    it("Token counters should start at 0", async function () {
      expect(await userProfileNFT.tokenCounter()).to.equal(0);
      expect(await userProfileNFT.validCounter()).to.equal(0);
    });
  });

  describe("Minting NFTs", function () {
    it("Owner can mint NFTs", async function () {
      await userProfileNFT.mintNFT(addr1.address, "ipfs://tokenURI0");
      expect(await userProfileNFT.ownerOf(0)).to.equal(addr1.address);
    });

    it("Non-owner cannot mint NFTs", async function () {
      await expect(
        userProfileNFT.connect(addr1).mintNFT(addr1.address, "ipfs://tokenURI1")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Token URI and Expiry", function () {
    beforeEach(async function () {
      await userProfileNFT.mintNFT(addr1.address, "ipfs://tokenURI0");
    });

    it("Should return correct token URI before expiry", async function () {
      expect(await userProfileNFT.tokenURI(0)).to.equal("ipfs://tokenURI0");
    });

    it("Should return 'Token expired' after expiry", async function () {
      // Increase time by 2 days
      await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);
      expect(await userProfileNFT.tokenURI(0)).to.equal("Token expired");
    });
  });

  describe("Purchasing NFTs", function () {
    beforeEach(async function () {
      // Mint NFTs to addr1
      await userProfileNFT.mintNFT(addr1.address, "ipfs://tokenURI0");
      await userProfileNFT.mintNFT(addr1.address, "ipfs://tokenURI1");
    });

    it("Should allow purchasing available NFTs", async function () {
      const nftPrice = await userProfileNFT.pricePerNFT();
      const totalPrice = nftPrice * 2n;

      // addr2 purchases 2 NFTs
      await userProfileNFT
        .connect(addr2)
        .purchaseNFT(2, { value: totalPrice });

      // Check ownership
      expect(await userProfileNFT.ownerOf(0)).to.equal(addr2.address);
      expect(await userProfileNFT.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should not allow purchasing without sufficient payment", async function () {
      const nftPrice = await userProfileNFT.pricePerNFT();
      const insufficientPrice = nftPrice * 1n;

      await expect(
        userProfileNFT.connect(addr2).purchaseNFT(2, { value: insufficientPrice })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Cannot purchase own NFT", async function () {
      const nftPrice = await userProfileNFT.pricePerNFT();
      const totalPrice = nftPrice * 1n;

      await expect(
        userProfileNFT.connect(addr1).purchaseNFT(1, { value: totalPrice })
      ).to.be.revertedWith("Cannot purchase your own NFT");
    });
  });

  describe("Invalidate Expired NFTs", function () {
    beforeEach(async function () {
      // Mint NFTs to addr1
      await userProfileNFT.mintNFT(addr1.address, "ipfs://tokenURI0");
      await userProfileNFT.mintNFT(addr1.address, "ipfs://tokenURI1");
      // Increase time to expire tokens
      await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);
    });

    it("Owner can invalidate expired NFTs", async function () {
      await userProfileNFT.invalidateExpiredNFTs();
      const validCounter = await userProfileNFT.getValidCounter();
      expect(validCounter).to.equal(1);
    });
  });
});
