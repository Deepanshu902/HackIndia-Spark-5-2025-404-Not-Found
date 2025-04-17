import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Allows cookies to be sent with requests
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // If we get a new token, update it and retry the request
        if (response.data && response.data.data.accessToken) {
          localStorage.setItem("accessToken", response.data.data.accessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Proposals API calls
export const getProposals = async () => {
  const response = await api.get("/proposals");
  return response.data;
};

export const fetchRecentProposals = async () => {
  const response = await api.get("/proposals/recent");
  return response.data;
};

export const fetchAllProposals = async () => {
  const response = await api.get("/proposals/all");
  return response.data;
};

export const fetchProposalById = async (id) => {
  const response = await api.get(`/proposals/${id}`);
  return response.data;
};

export const getProposal = async (id) => {
  const response = await api.get(`/proposals/${id}`);
  return response.data;
};

export const createProposal = async (proposalData) => {
  const response = await api.post("/proposals", proposalData);
  return response.data;
};

export const updateProposal = async (id, proposalData) => {
  const response = await api.patch(`/proposals/${id}`, proposalData);
  return response.data;
};

export const deleteProposal = async (id) => {
  const response = await api.delete(`/proposals/${id}`);
  return response.data;
};

// Votes API calls
export const castVote = async (voteData) => {
  const response = await api.post("/votes", voteData);
  return response.data;
};

export const getProposalVotes = async (proposalId) => {
  const response = await api.get(`/votes/proposal/${proposalId}`);
  return response.data;
};

export const checkUserVote = async (proposalId) => {
  const response = await api.get(`/votes/check/${proposalId}`);
  return response.data;
};

export default api;
