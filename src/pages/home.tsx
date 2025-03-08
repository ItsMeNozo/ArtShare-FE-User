// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "@/firebase"; // Import Firebase authentication
import { signOut } from "firebase/auth"; // Import Firebase signOut function

const Home = () => {
  const navigate = useNavigate(); // Use navigate to redirect user

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      console.log("Logged out successfully");
      navigate("/login"); // Redirect to login page
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="flex-1 space-y-4 px-20 py-8">
      <h1 className="font-bold text-gray-800 text-3xl leading-6">
        Welcome to ArtShare!
      </h1>
      <p className="mt-2 text-gray-600">Your art showcase starts here.</p>

      <button
        onClick={handleLogout} // Call logout function when clicked
        className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
