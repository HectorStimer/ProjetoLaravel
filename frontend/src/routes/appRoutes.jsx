import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import QueueScreen from "../pages/QueueScreen";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {user ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/queue" element={<QueueScreen />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}
