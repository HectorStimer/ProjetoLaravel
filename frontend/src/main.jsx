import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);