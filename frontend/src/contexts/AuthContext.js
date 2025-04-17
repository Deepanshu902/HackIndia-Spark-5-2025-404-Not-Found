import { createContext, useState, useEffect, useContext } from "react";
import {
  getUserProfile,
  loginUser,
  registerUser,
  logoutUser,
} from "../utils/api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData.data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
      setInitialized(true);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials);

      // Store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Set user data
      setUser(response.data.user);

      toast.success("Login successful!");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerUser(userData);

      // Store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Set user data
      setUser(response.data.user);

      toast.success("Registration successful!");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Clear user state
      setUser(null);

      toast.success("Logged out successfully");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if the API call fails, clear local storage and state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);

      setLoading(false);
      return true;
    }
  };

  const updateUserWallet = async (walletAddress) => {
    if (user) {
      try {
        // You might need to create a new API endpoint for this
        // For now, just update the local user state
        setUser({ ...user, walletAddress });
      } catch (error) {
        console.error("Failed to update wallet address:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        login,
        register,
        logout,
        updateUserWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
