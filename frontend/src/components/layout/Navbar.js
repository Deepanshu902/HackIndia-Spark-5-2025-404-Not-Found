import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWeb3 } from "../../contexts/Web3Context";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { account, connectWallet, disconnectWallet } = useWeb3();

  const handleLogout = () => {
    disconnectWallet();
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          DecentralVote
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/proposals" className="hover:text-blue-200">
            Proposals
          </Link>

          {user ? (
            <>
              <Link to="/create-proposal" className="hover:text-blue-200">
                Create Proposal
              </Link>
              <div className="relative group">
                <button className="hover:text-blue-200 flex items-center">
                  <span className="mr-1">{user.username}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg hidden group-hover:block z-10">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200">
                Register
              </Link>
            </>
          )}

          {!account ? (
            <button
              onClick={connectWallet}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="bg-green-500 text-white px-4 py-2 rounded">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
