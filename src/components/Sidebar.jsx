import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Upload,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const role = "manager";
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const base =
    "flex items-center rounded-xl text-sm font-medium transition-all duration-200";
  const expandedBase = "gap-3 px-4 py-2.5";
  const collapsedBase = "justify-center px-3 py-3";

  const active = "bg-primary text-white shadow-sm";
  const inactive = "text-text hover:bg-primary-soft hover:text-primary";

  const navItems = [
    {
      section: "Overview",
      items: [
        {
          to: "/app",
          label: "Dashboard",
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },
    {
      section: "Controls",
      items: [
        {
          to: "/app/kpi",
          label: "KPI Overview",
          icon: BarChart3,
        },
        {
          to: "/app/exception",
          label: "Exception Tracking",
          icon: AlertTriangle,
        },
      ],
    },
    {
      section: "Data",
      items: [
        {
          to: "/app/upload",
          label: "Upload Center",
          icon: Upload,
        },
      ],
    },
  ];

  if (role === "manager") {
    navItems.push({
      section: "Admin",
      items: [
        {
          to: "/app/settings",
          label: "Settings",
          icon: Settings,
        },
      ],
    });
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div
      className={`h-screen shrink-0 border-r border-border bg-card transition-all duration-300 ${
        collapsed ? "w-20" : "w-56"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border px-3 py-2">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!collapsed ? (
              <>
                <div className="flex items-center">
                  <img src={logo} alt="logo" className="h-12 w-auto" />
                </div>

                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary transition hover:bg-primary-soft"
                >
                  <PanelLeftClose size={18} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-primary-soft"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {navItems.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  {group.section}
                </p>
              )}

              <div className="space-y-2">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      title={collapsed ? item.label : ""}
                      className={({ isActive }) =>
                        `${base} ${collapsed ? collapsedBase : expandedBase} ${
                          isActive ? active : inactive
                        }`
                      }
                    >
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
            className={`flex w-full items-center rounded-xl text-sm font-medium text-error transition ${
              collapsed
                ? "justify-center px-3 py-3 hover:bg-red-50"
                : "gap-3 px-4 py-2.5 hover:bg-red-50"
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
