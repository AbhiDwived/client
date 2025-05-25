import React, { useState } from 'react';
import { useVerifyOtpMutation } from '../../features/auth/authAPI';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = new URLSearchParams(location.search).get('userId');

  const [otp, setOtp] = useState('');
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Basic validation
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await verifyOtp({ userId, otp }).unwrap();

      toast.success("OTP Verified successfully!");

      setTimeout(() => {
        navigate('/user/login');
      }, 2000); // Delay to let toast show before redirect
    } catch (err) {
      console.error('OTP Verification Failed:', err);
      toast.error(err?.data?.message || "OTP Verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <p className="text-center mb-4">Enter the 6-digit OTP sent to your email.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition disabled:opacity-70"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {error && (
            <p className="mt-4 text-red-500 text-center">
              {error.data?.message || 'Invalid OTP'}
            </p>
          )}
        </form>
      </div>

      {/* ✅ Toast container (remove if added globally) */}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default VerifyOTP;
