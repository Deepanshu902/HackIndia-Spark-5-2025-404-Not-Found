import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProposal } from "../../utils/api";
import { useWeb3 } from "../../contexts/Web3Context";
import toast from "react-hot-toast";

const CreateProposal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { contract, account } = useWeb3();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setSubmitting(true);

      // First create proposal on backend
      const response = await createProposal(formData);
      const createdProposal = response.data;

      // Then create proposal on blockchain if contract is available
      if (contract) {
        try {
          const tx = await contract.createProposal(
            formData.title,
            formData.description
          );

          toast.success(
            "Proposal submitted to blockchain. Waiting for confirmation..."
          );

          // Wait for transaction confirmation
          await tx.wait();
          toast.success("Proposal confirmed on blockchain!");
        } catch (contractError) {
          console.error(
            "Error creating proposal on blockchain:",
            contractError
          );
          toast.error(
            "Proposal created in database but blockchain submission failed"
          );
        }
      }

      setSubmitting(false);
      toast.success("Proposal created successfully!");
      navigate(`/proposals/${createdProposal._id}`);
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast.error(error.response?.data?.message || "Failed to create proposal");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Proposal
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter proposal title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe your proposal in detail..."
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {!account && (
          <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
            role="alert"
          >
            <p className="font-bold">Wallet Not Connected</p>
            <p>You need to connect your wallet before creating a proposal.</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/proposals")}
            className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || !account}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 ${
              submitting || !account ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Creating..." : "Create Proposal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProposal;
