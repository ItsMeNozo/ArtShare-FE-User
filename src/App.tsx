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

const App: React.FC = () => {
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
          <Route
            path="/home"
            element={<Home />} // Add the Home route
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
