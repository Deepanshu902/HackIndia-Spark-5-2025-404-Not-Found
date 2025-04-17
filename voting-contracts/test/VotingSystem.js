const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
  let votingSystem;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
  });

  describe("Proposal Creation", function () {
    it("Should create a new proposal", async function () {
      await votingSystem.createProposal("Test Proposal", "This is a test", 7);
      
      // Check proposal count
      expect(await votingSystem.getProposalCount()).to.equal(1);
      
      // Get proposal details
      const proposal = await votingSystem.getProposal(1);
      expect(proposal.title).to.equal("Test Proposal");
      expect(proposal.description).to.equal("This is a test");
      expect(proposal.creator).to.equal(owner.address);
      expect(proposal.active).to.equal(true);
    });

    it("Should fail if title is empty", async function () {
      await expect(
        votingSystem.createProposal("", "This is a test", 7)
      ).to.be.revertedWith("Title cannot be empty");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await votingSystem.createProposal("Test Proposal", "This is a test", 7);
    });

    it("Should allow a user to vote", async function () {
      await votingSystem.connect(addr1).vote(1, true);
      
      // Check vote count
      const proposal = await votingSystem.getProposal(1);
      expect(proposal.forVotes).to.equal(1);
      expect(proposal.againstVotes).to.equal(0);
      
      // Check voter status
      const voterStatus = await votingSystem.getVoterStatus(1, addr1.address);
      expect(voterStatus.hasVoted).to.equal(true);
      expect(voterStatus.support).to.equal(true);
    });

    it("Should prevent double voting", async function () {
      await votingSystem.connect(addr1).vote(1, true);
      
      await expect(
        votingSystem.connect(addr1).vote(1, false)
      ).to.be.revertedWith("Already voted on this proposal");
    });
  });

  describe("Closing Proposals", function () {
    beforeEach(async function () {
      await votingSystem.createProposal("Test Proposal", "This is a test", 7);
    });

    it("Should allow creator to close proposal", async function () {
      await votingSystem.closeProposal(1);
      
      const proposal = await votingSystem.getProposal(1);
      expect(proposal.active).to.equal(false);
    });

    it("Should prevent non-creators from closing proposals", async function () {
      await expect(
        votingSystem.connect(addr1).closeProposal(1)
      ).to.be.revertedWith("Only proposal creator or contract owner can close proposal");
    });
  });
});