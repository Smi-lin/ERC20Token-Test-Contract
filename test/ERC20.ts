import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";


describe("ERCToken Test", function () {
    async function deployErcFixture() {
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const Erc = await hre.ethers.getContractFactory("DLToken");
      const erc = await Erc.deploy("MyToken", "MTK");
  
      return { erc, owner, otherAccount };
    }
  
    describe("Deployment", () => {
      it("Should deploy with the correct token name and symbol ", async function () {
        const { erc } = await loadFixture(deployErcFixture);
  
        expect(await erc.getTokenName()).to.equal("MyToken");
        expect(await erc.getSymbol()).to.equal("MTK");
      });


      it("Should assign the total supply to the owner ", async function () {
        const { erc, owner } = await loadFixture(deployErcFixture);
        const ownerBalance = await erc.balanceOf(owner.address)
        
        const expectedSupply = BigInt(1000000) * BigInt(10 ** 18);
        expect(ownerBalance.toString()).to.equal(expectedSupply.toString());

      });


      it("Should get the decimal of each token ", async function () {
        const { erc, owner } = await loadFixture(deployErcFixture);
  
        expect(await erc.getTokenName()).to.equal("MyToken");
        expect(await erc.getSymbol()).to.equal("MTK");
      });

      it("should check if the owner token is in wei", async function () {
        const {erc, owner} = await loadFixture(deployErcFixture)

        const tokenDecimals = await erc.connect(owner).decimal()

        expect(tokenDecimals).to.be.equal(18);

    })

      it("should check the balance of a acct", async function () {
        const {erc, owner} = await loadFixture(deployErcFixture)

        const balance = await erc.connect(owner).balanceOf(owner.address)

        expect(balance).to.be.equal(await erc.balanceOf(owner.address));
    })

      
    });

    describe("Transfers Test", function() {
        it("Should be able to transfer tokens from one token to another", async function() {
            const { erc, otherAccount } = await loadFixture(deployErcFixture);

            await erc.transfer(otherAccount.address, 2000);
            const otherBalance = await erc.balanceOf(otherAccount.address);
            expect(otherBalance).to.equal(1900);
        })  

        it("Should burn 5% of the transferred amount", async function () {
            const { erc, owner, otherAccount } = await loadFixture(deployErcFixture);
            const initialSupply = BigInt(await erc.getTotalSupply());
            await erc.transfer(otherAccount.address, 2000);
            const newSupply = BigInt(await erc.getTotalSupply());
            const amountTransferred = BigInt(2000);
            const burnAmount = amountTransferred * BigInt(5) / BigInt(100);
            const expectedNewSupply = initialSupply - burnAmount;
            expect(newSupply).to.equal(expectedNewSupply);
        });
    })


    describe("Approval & Allowance Test Test", function() {
        it("owner should be able to give delegate approval of funds", async function() {
            const { erc, otherAccount, owner } = await loadFixture(deployErcFixture);
    
            await erc.approve(otherAccount.address, 30);
    
            const approvedAmount = await erc.allowance(owner.address, otherAccount.address);
            expect(approvedAmount).to.equal(30);
        });

      
    });

    describe('Burn & Mint Functionality', function () {
        it("should burn tokens", async function () {
            const { erc, owner } = await loadFixture(deployErcFixture);
            
            const initialBalance = await erc.balanceOf(owner.address);
            const burnAmount = 500n;  
            await erc.burn(owner.address, burnAmount);
    
            const newBalance = await erc.balanceOf(owner.address);
            expect(newBalance).to.equal(initialBalance - burnAmount);  
        });
    
        it("should mint tokens", async function () {
            const { erc, otherAccount } = await loadFixture(deployErcFixture);
            
            const mintAmount = 10000n;  
    
            await erc.mint(mintAmount, otherAccount.address);
    
            const newBalance = await erc.balanceOf(otherAccount.address);
            expect(newBalance).to.equal(mintAmount * 10n ** 18n); 
        });
    });
    
    
    
    

  
});