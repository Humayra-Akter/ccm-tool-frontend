import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import KPI from "./pages/KPI";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Exception from "./pages/Exception";
import SettingsPage from "./pages/Settings";

const App = () => {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />

      {/* protected */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="kpi" element={<KPI />} />
        <Route path="exception" element={<Exception />} />
        <Route path="upload" element={<Upload />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
