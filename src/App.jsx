import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import KPI from "./pages/KPI";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Exception from "./pages/Exception";
import { Settings } from "lucide-react";

const App = () => {
  return (
    <Routes>
      {/* entry */}
      <Route path="/" element={<Login />} />

      {/* protected app */}
      <Route
        path="/"
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
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
