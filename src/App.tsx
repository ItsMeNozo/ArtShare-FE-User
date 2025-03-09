import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "@/layouts";
import React from "react";
import Login from "@/pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import { AuthenLayout } from "./layouts/public/AuthenLayout";
import Home from "./pages/home"; // Add the Home component
import VerifyEmail from "./pages/Authentication/Verify-Email"; // Import the VerifyEmail component
import { useAuthStore } from "@/stores/authStore"; // Import the auth store

const App: React.FC = () => {
  const { user } = useAuthStore((state) => state); // Get user from the auth store

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthenLayout>
                <Login />
              </AuthenLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthenLayout>
                <SignUp />
              </AuthenLayout>
            }
          />

          {/* Protected route for /home */}
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/login" />} // Only allow access if user is logged in
          />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
