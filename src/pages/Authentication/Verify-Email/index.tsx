import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const { user } = useAuthStore(); // Access the authenticated user from the store

  const resendVerificationEmail = async () => {
    if (user) {
      await user.sendEmailVerification();
      alert("Verification email has been resent. Please check your inbox.");
    }
  };

  return (
    <div className="flex-1 space-y-4 px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-gray-800 text-3xl leading-6">
          Verify Your Email
        </h1>
        <p className="mt-2 font-bold text-gray-600 text-3xl">
          Please verify your email to continue.
        </p>
        <p className="mt-4 text-gray-500">
          A verification email has been sent to{" "}
          <span className="font-semibold">{user?.email}</span>. Please check
          your inbox and click the verification link.
        </p>
        <p className="mt-4 text-gray-500">
          If you haven't received the email, click the link below to resend the
          verification email.
        </p>
        <button
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
          onClick={resendVerificationEmail}
        >
          Resend Email
        </button>
      </div>

      <div className="mt-6 text-left">
        <p className="text-gray-600 text-sm">
          Already verified?{" "}
          <Link to="/login" className="ml-2 text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
