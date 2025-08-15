import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import LandingPage from "../page/LandingPage";
import Login from "../page/Login";
import AdminDash from "../page/adminDash";
import PetugasDash from "../page/petugasDash";
import NasabahDash from "../page/nasabahDash";
import ForgotPassword from "../page/ForgotPassword";
import ResetPassword from "../page/ResetPassword";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, role }) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
};

const DashRoutes = () => {
  return (
    <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />}/>
  <Route path="/reset-password/:token" element={<ResetPassword />} />

  <Route
    path="/dashboard/admin"
    element={
      <ProtectedRoute role="admin">
        <AdminDash />
      </ProtectedRoute>
    }
  />
  <Route
    path="/dashboard/petugas"
    element={
      <ProtectedRoute role="petugas">
        <PetugasDash />
      </ProtectedRoute>
    }
  />
  <Route
    path="/dashboard/nasabah"
    element={
      <ProtectedRoute role="nasabah">
        <NasabahDash />
      </ProtectedRoute>
    }
  />
 
  <Route path="*" element={<Navigate to="/" />} />
</Routes>

  );
};

export default DashRoutes;
