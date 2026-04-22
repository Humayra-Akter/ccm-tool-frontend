import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const role = "manager";

  const base =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all";

  const active = "bg-primary text-white shadow-sm";

  const inactive = "text-text hover:bg-primary-soft hover:text-primary";

  return (
    <div className="w-56 h-screen flex flex-col bg-white border-r border-border">
      {/* LOGO */}
      <img src={logo} alt="logo" className="px-5" />
      <div className="px-5 py-2 border-b border-border flex items-center gap-2">
        <div>
          <p className="text-sm font-semibold text-text">CCM Portal</p>
          <p className="text-xs text-muted">Control Monitoring</p>
        </div>
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* OVERVIEW */}
        <div>
          <p className="text-xs text-muted mb-2 px-2 uppercase font-semibold">
            Overview
          </p>

          <NavLink
            to="/"
            end // ✅ IMPORTANT FIX
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        </div>

        {/* CONTROLS */}
        <div>
          <p className="text-xs text-muted mb-2 px-2 uppercase font-semibold">
            Controls
          </p>

          <NavLink
            to="/kpi"
            end // ✅ prevents matching /kpi?type=...
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <BarChart3 size={18} />
            KPI Overview
          </NavLink>

          <NavLink
            to="/kpi-exceptions" // ✅ FIX: separate route (VERY IMPORTANT)
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <AlertTriangle size={18} />
            Exception Tracking
          </NavLink>
        </div>

        {/* DATA */}
        <div>
          <p className="text-xs text-muted mb-2 px-2 uppercase font-semibold">
            Data
          </p>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <Upload size={18} />
            Upload Center
          </NavLink>
        </div>

        {/* ADMIN */}
        {role === "manager" && (
          <div>
            <p className="text-xs text-muted mb-2 px-2 uppercase font-semibold">
              Admin
            </p>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              <Settings size={18} />
              Settings
            </NavLink>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-error hover:bg-red-50 rounded-lg transition">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
