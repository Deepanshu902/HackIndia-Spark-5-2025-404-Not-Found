import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../../contexts/Web3Context";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, Spinner } from "../../components/ui";

const ProposalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract } = useWeb3();
  const { user } = useAuth();

  const [proposal, setProposal] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        if (!contract || !id) return;

        // Fetch proposal details
        const proposalData = await contract.getProposal(parseInt(id));

        // Check if user has voted
        const voted = user
          ? await contract.hasVoted(parseInt(id), user.address)
          : false;
        setHasVoted(voted);

        // Get proposal options
        const optionCount = await contract.getOptionCount(parseInt(id));
        const optionsData = [];
        const resultsData = [];

        for (let i = 0; i < optionCount; i++) {
          const option = await contract.getOption(parseInt(id), i);
          optionsData.push({
            id: i,
            name: option.name,
          });

          // If user has voted or proposal is ended, fetch results
          if (voted || !proposalData.active) {
            const votes = await contract.getVoteCount(parseInt(id), i);
            resultsData.push({
              id: i,
              name: option.name,
              votes: votes.toString(),
            });
          }
        }

        setOptions(optionsData);

        if (voted || !proposalData.active) {
          setResults(resultsData);
        }

        // Format proposal data
        setProposal({
          id: parseInt(id),
          title: proposalData.title,
          description: proposalData.description,
          creator: proposalData.creator,
          startTime: new Date(proposalData.startTime * 1000),
          endTime: new Date(proposalData.endTime * 1000),
          status: proposalData.active ? "Active" : "Ended",
        });
      } catch (error) {
        console.error("Error fetching proposal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposalDetails();
  }, [contract, id, user]);

  const handleVote = async () => {
    if (!selectedOption || !user || !contract) return;

    try {
      setVoting(true);

      // Call the vote function in the smart contract
      const tx = await contract.vote(parseInt(id), selectedOption);
      await tx.wait();

      // Update local state
      setHasVoted(true);

      // Fetch results after voting
      const resultsData = [];
      for (let i = 0; i < options.length; i++) {
        const votes = await contract.getVoteCount(parseInt(id), i);
        resultsData.push({
          id: i,
          name: options[i].name,
          votes: votes.toString(),
        });
      }
      setResults(resultsData);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setVoting(false);
    }
  };

  const handleBackToList = () => {
    navigate("/proposals");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold">Proposal not found</h2>
          <Button onClick={handleBackToList} className="mt-4">
            Back to Proposals
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={handleBackToList} variant="text" className="mb-4">
        &larr; Back to Proposals
      </Button>

      <Card className="mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{proposal.title}</h1>
          <p className="text-gray-600 mb-6">{proposal.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{proposal.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Created by</p>
              <p className="font-medium">{`${proposal.creator.substring(
                0,
                6
              )}...${proposal.creator.substring(38)}`}</p>
            </div>
            <div>
              <p className="text-gray-500">Start Time</p>
              <p className="font-medium">
                {proposal.startTime.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">End Time</p>
              <p className="font-medium">{proposal.endTime.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Voting Section or Results Section */}
      <Card>
        <div className="p-6">
          {proposal.status === "Ended" ? (
            <h2 className="text-xl font-semibold mb-4">Final Results</h2>
          ) : hasVoted ? (
            <h2 className="text-xl font-semibold mb-4">Current Results</h2>
          ) : (
            <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
          )}

          {/* Results view */}
          {(hasVoted || proposal.status === "Ended") && results.length > 0 && (
            <div className="space-y-4">
              {results.map((option) => {
                // Calculate total votes
                const totalVotes = results.reduce(
                  (sum, opt) => sum + parseInt(opt.votes),
                  0
                );
                const percentage =
                  totalVotes > 0
                    ? (parseInt(option.votes) / totalVotes) * 100
                    : 0;

                return (
                  <div key={option.id} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>{option.name}</span>
                      <span>
                        {option.votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              <p className="text-gray-500 text-sm mt-4">
                Total votes:{" "}
                {results.reduce((sum, opt) => sum + parseInt(opt.votes), 0)}
              </p>
            </div>
          )}

          {/* Voting form */}
          {!hasVoted && proposal.status === "Active" && user && (
            <div className="space-y-4">
              <div className="space-y-2">
                {options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${option.id}`}
                      name="vote-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`option-${option.id}`}>{option.name}</label>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleVote}
                disabled={selectedOption === null || voting}
                className="w-full"
              >
                {voting ? <Spinner size="sm" /> : "Submit Vote"}
              </Button>
            </div>
          )}

          {/* Not logged in message */}
          {!user && proposal.status === "Active" && (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">
                You need to connect your wallet to vote
              </p>
              <Button onClick={() => navigate("/login")}>Connect Wallet</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProposalDetail;
