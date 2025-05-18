import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MyAttendancePage from "./pages/MyAttendancePage";
import AuthGuard from "./components/AuthGuard";
import GuestGuard from "./components/GuestGuard";

import "./index.css";
import ApplyLeavePage from "./pages/ApplyLeavePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Only unauthenticated users can access LoginPage */}
        <Route
          path="/"
          element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          }
        />

        {/* Only authenticated users can access Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        {/* attendance page route */}
        <Route
          path="/attendance"
          element={
            <AuthGuard>
              <MyAttendancePage />
            </AuthGuard>
          }
        />
        {/* attendance page route */}
        <Route
          path="/leave"
          element={
            <AuthGuard>
              <ApplyLeavePage />
            </AuthGuard>
          }
        />
        {/* Fallback: redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
