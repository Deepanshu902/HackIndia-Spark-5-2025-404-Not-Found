// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingSystem is Ownable {
    uint256 private _proposalIdCounter;
    
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        address creator;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }
    
    struct Vote {
        bool hasVoted;
        bool support;
    }
    
    // Proposal ID => Proposal
    mapping(uint256 => Proposal) public proposals;
    
    // Proposal ID => Voter Address => Vote
    mapping(uint256 => mapping(address => Vote)) public votes;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        address indexed creator,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );
    
    event ProposalStatusChanged(
        uint256 indexed proposalId,
        bool active
    );
    
    constructor() Ownable(msg.sender) {
        _proposalIdCounter = 0;
    }
    
    function createProposal(
        string memory title,
        string memory description,
        uint256 durationInDays
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(durationInDays > 0, "Duration must be greater than 0");
        
        // Increment proposal ID counter
        _proposalIdCounter += 1;
        uint256 newProposalId = _proposalIdCounter;
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (durationInDays * 1 days);
        
        proposals[newProposalId] = Proposal({
            id: newProposalId,
            title: title,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            creator: msg.sender,
            startTime: startTime,
            endTime: endTime,
            active: true
        });
        
        emit ProposalCreated(
            newProposalId,
            title,
            msg.sender,
            startTime,
            endTime
        );
        
        return newProposalId;
    }
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal does not exist");
        require(proposal.active, "Proposal is not active");
        require(block.timestamp >= proposal.startTime, "Voting has not started");
        require(block.timestamp <= proposal.endTime, "Voting has ended");
        
        Vote storage userVote = votes[proposalId][msg.sender];
        require(!userVote.hasVoted, "Already voted on this proposal");
        
        userVote.hasVoted = true;
        userVote.support = support;
        
        if (support) {
            proposal.forVotes += 1;
        } else {
            proposal.againstVotes += 1;
        }
        
        emit VoteCast(proposalId, msg.sender, support);
    }
    
    function closeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal does not exist");
        require(
            msg.sender == proposal.creator || msg.sender == owner(),
            "Only proposal creator or contract owner can close proposal"
        );
        require(proposal.active, "Proposal is already closed");
        
        proposal.active = false;
        emit ProposalStatusChanged(proposalId, false);
    }
    
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        address creator,
        uint256 startTime,
        uint256 endTime,
        bool active
    ) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id == proposalId, "Proposal does not exist");
        
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.creator,
            proposal.startTime,
            proposal.endTime,
            proposal.active
        );
    }
    
    function getVoterStatus(uint256 proposalId, address voter) external view returns (bool hasVoted, bool support) {
        Vote storage voterInfo = votes[proposalId][voter];  // Changed 'vote' to 'voterInfo'
        return (voterInfo.hasVoted, voterInfo.support);
    }
    
    function getProposalCount() external view returns (uint256) {
        return _proposalIdCounter;
    }
}