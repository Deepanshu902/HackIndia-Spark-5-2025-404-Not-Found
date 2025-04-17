import { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import VotingContract from "../utils/contracts";
import { useAuth } from "./AuthContext";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkName, setNetworkName] = useState("");
  const [loading, setLoading] = useState(true);
  const { updateUserWallet } = useAuth();

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (!window.ethereum) {
        toast.error("Please install MetaMask to use this app");
        return false;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);

      // Set up ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Get network name
      const network = await provider.getNetwork();
      setNetworkName(
        network.name === "homestead" ? "Ethereum Mainnet" : network.name
      );

      // Set up signer
      const signer = provider.getSigner();
      setSigner(signer);

      // Set up contract
      const votingContract = new ethers.Contract(
        VotingContract.address,
        VotingContract.abi,
        signer
      );
      setContract(votingContract);

      // Update user's wallet in the backend
      updateUserWallet(account);

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
      setLoading(false);
      return false;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setContract(null);
    setNetworkName("");
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          updateUserWallet(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [updateUserWallet]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        networkName,
        loading,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

export default Web3Context;
