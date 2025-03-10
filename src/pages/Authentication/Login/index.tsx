import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import InstagramIcon from "/auth_logo_instagram.svg";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore"; // Import the auth store
import { auth } from "@/firebase";
import {
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { login, forgotPassword, signup } from "@/api/authentication/auth"; // API functions

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate(); // To navigate programmatically

  // Use auth store for sign in and error handling
  const {
    setError: setStoreError,
    loginWithEmail,
    signUpWithGoogle,
    error: storeError,
    token,
    user,
  } = useAuthStore();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await loginWithEmail(email, password); // Call authStore to handle email login
      if (storeError) {
        setError(storeError); // Handle error if login failed
        return;
      }
      navigate("/home"); // Redirect to home after successful login
    } catch (error: any) {
      setError(error.message); // Set error from the store if something goes wrong
      setStoreError(error.message);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signUpWithGoogle();
      console.log(token);
      // Send the Firebase token to the backend for verification and to check if the user exists
      const response = await login(token!);

      if (response.uid !== null) {
        navigate("/home"); // Redirect to home page after successful login
      } else {
        // If user doesn't exist, call signup API
        const signupResponse = await signup(
          user.email!,
          "",
          user.displayName || ""
        );
        console.log("User registered in backend:", signupResponse);

        navigate("/home"); // Redirect to home after successful sign-up
      }
    } catch (error: any) {
      setError(error.message); // Handle any errors
      console.error("Error logging in with Google:", error.message);
    }
  };

  // Handle Facebook login
  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(); // Get the Firebase token

      // Send the Firebase token to the backend for verification
      const response = await login(token);

      if (response.uid !== null) {
        navigate("/home"); // Redirect to home page after successful login
      } else {
        // If user doesn't exist, call signup API
        const signupResponse = await signup(
          user.email!,
          "",
          user.displayName || ""
        );
        console.log("User registered in backend:", signupResponse);

        navigate("/home"); // Redirect to home after successful sign-up
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error logging in with Facebook:", error.message);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail); // Firebase service to send password reset email
      setIsResettingPassword(false); // Hide the reset form
      alert("Password reset link sent to your email."); // Inform the user
    } catch (error: any) {
      setError(error.message); // Capture and display error message if it occurs
      console.error("Error resetting password:", error.message);
    }
  };

  return (
    <div className="flex-1 space-y-4 px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-gray-800 text-3xl leading-6">
          Welcome back!
        </h1>
        <p className="mt-2 font-bold text-gray-600 text-3xl">
          Login to your account
        </p>
        <p className="mt-4 text-gray-500 text-sm">
          It's nice to see you again. Ready to showcase your art?
        </p>
      </div>

      {/* Password reset logic */}
      {isResettingPassword ? (
        <div>
          <h3 className="text-lg font-bold">Reset your password</h3>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label
                htmlFor="resetEmail"
                className="block font-semibold text-gray-600 text-sm"
              >
                Enter your email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                type="submit"
                className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white"
              >
                Reset Password
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
          <div className="mt-4 text-sm">
            <button
              onClick={() => setIsResettingPassword(false)}
              className="text-blue-600"
            >
              Go back to Login
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-semibold text-gray-600 text-sm"
            >
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-600 text-sm"
            >
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm mt-1 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center text-gray-500 text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <button
              onClick={() => setIsResettingPassword(true)}
              className="text-blue-600 text-sm"
            >
              Forgot password?
            </button>
          </div>
          <Button
            type="submit"
            className="bg-gray-800 hover:bg-gray-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white"
          >
            Login
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      )}

      <div className="flex items-center space-x-4 mt-6 text-center">
        <hr className="border-gray-900 border-t-1 w-full" />
        <div className="text-gray-600 text-sm">Or</div>
        <hr className="border-gray-900 border-t-1 w-full" />
      </div>
      <div className="flex flex-col justify-between space-x-4 space-y-4 mt-4">
        <div className="flex w-full">
          <Button
            variant={"outline"}
            onClick={handleGoogleLogin}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-full h-10 font-normal text-sm"
          >
            <FcGoogle className="mr-2 size-5" />
            <span>Continue with Google</span>
          </Button>
        </div>
        <div className="flex justify-between w-full">
          <Button
            variant={"outline"}
            onClick={handleFacebookLogin}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm"
          >
            <FaFacebookF className="mr-2 size-5 text-blue-700" />
            <span>Facebook</span>
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm"
          >
            <img src={InstagramIcon} alt="Instagram" className="mr-2 size-5" />
            <span>Instagram</span>
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 w-[32%] h-10 font-normal text-sm"
          >
            <FaApple className="mr-2 size-5" />
            <span>Apple</span>
          </Button>
        </div>
      </div>

      <div className="mt-6 text-left">
        <p className="text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="ml-2 text-blue-600">
            Register
          </Link>
        </p>
      </div>
      <div className="mt-4 text-gray-500 text-xs text-left">
        <p>
          By logging in to ArtShare, I confirm that I have read and agree to the
          ArtShare{" "}
          <a href="#" className="text-blue-600">
            Terms of Service
          </a>
          ,{" "}
          <a href="#" className="text-blue-600">
            Privacy Policy
          </a>
          , and to receive emails and updates.
        </p>
      </div>
    </div>
  );
};

export default Login;
