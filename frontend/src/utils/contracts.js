// Smart contract ABI and address
const VotingContract = {
  address: "0x123...", // Replace with your deployed contract address
  abi: [
    // ABI from your compiled contract
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "title",
          type: "string",
        },
      ],
      name: "ProposalCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "voter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "inSupport",
          type: "bool",
        },
      ],
      name: "Voted",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_title",
          type: "string",
        },
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
      ],
      name: "createProposal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_proposalId",
          type: "uint256",
        },
      ],
      name: "getProposal",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "creator",
              type: "address",
            },
            {
              internalType: "string",
              name: "title",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "forVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "againstVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "createdAt",
              type: "uint256",
            },
          ],
          internalType: "struct VotingContract.Proposal",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProposalCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProposals",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "creator",
              type: "address",
            },
            {
              internalType: "string",
              name: "title",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "forVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "againstVotes",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "createdAt",
              type: "uint256",
            },
          ],
          internalType: "struct VotingContract.Proposal[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_proposalId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_voter",
          type: "address",
        },
      ],
      name: "hasVoted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_proposalId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_inSupport",
          type: "bool",
        },
      ],
      name: "vote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

export default VotingContract;
