import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Filter } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  // Dynamic page title logic
  const getTitle = () => {
    if (location.pathname === "/") return "Dashboard";
    if (location.pathname.includes("/kpi")) return "KPI Analysis";
    if (location.pathname.includes("/upload")) return "Upload Center";
    if (location.pathname.includes("/settings")) return "Settings";
    return "CCM Portal";
  };

  const getSubtitle = () => {
    if (location.pathname === "/")
      return "Monitor control performance and risks";
    if (location.pathname.includes("/kpi"))
      return "Analyze control outputs and exceptions";
    if (location.pathname.includes("/upload"))
      return "Upload and process control data";
    return "Control Monitoring Command Center";
  };

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      {/* LEFT SECTION */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-primary">{getTitle()}</h1>
        <p className="text-xs text-muted">{getSubtitle()}</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* FILTER BUTTON (important for KPI pages) */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50 transition">
          <Filter size={16} />
          Filters
        </button>

        {/* NOTIFICATIONS */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-muted hover:text-text transition" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full"></span>
        </div>

        {/* USER */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text">Manager</p>
            <p className="text-xs text-muted">Internal Audit</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
            M
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
