import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../components/auth/Login";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Log In</h1>
          <Login />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-800">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
