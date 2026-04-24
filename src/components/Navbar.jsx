import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Filter, ChevronRight, Search, CheckCheck } from "lucide-react";

const routeMeta = [
  {
    match: (pathname) => pathname === "/app",
    title: "Dashboard",
    subtitle: "Monitor control performance and risks",
    breadcrumb: ["Home", "Dashboard"],
    showFilters: false,
  },
  {
    match: (pathname) => pathname.includes("/app/kpi"),
    title: "KPI Overview",
    subtitle: "Analyze control outputs, health trends, and exceptions",
    breadcrumb: ["Home", "Controls", "KPI Overview"],
    showFilters: true,
  },
  {
    match: (pathname) => pathname.includes("/app/exception"),
    title: "Exception Tracking",
    subtitle: "Review exceptions, severity, ownership, and status",
    breadcrumb: ["Home", "Controls", "Exception Tracking"],
    showFilters: true,
  },
  {
    match: (pathname) => pathname.includes("/app/upload"),
    title: "Upload Center",
    subtitle: "Upload and process control source data",
    breadcrumb: ["Home", "Data", "Upload Center"],
    showFilters: true,
  },
  {
    match: (pathname) => pathname.includes("/app/settings"),
    title: "Settings",
    subtitle: "Manage portal preferences, access, and configuration",
    breadcrumb: ["Home", "Admin", "Settings"],
    showFilters: false,
  },
];

const fallbackNotifications = [];

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        setUser(null);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageMeta = useMemo(() => {
    return (
      routeMeta.find((item) => item.match(location.pathname)) || {
        title: "CCM Portal",
        subtitle: "Control Monitoring Command Center",
        breadcrumb: ["Home"],
        showFilters: false,
      }
    );
  }, [location.pathname]);

  const displayName = user?.fullName || "Manager";
  const email = user?.email || "Internal Audit";
  const initial = displayName?.charAt(0)?.toUpperCase() || "M";
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="sticky top-0 z-20 border-b border-border bg-card backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-5 lg:px-8">
        <div className="min-w-0">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-primary lg:text-xl">
              {pageMeta.title}
            </h1>
            <p className="text-xs text-muted lg:text-sm">{pageMeta.subtitle}</p>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-3 lg:gap-4">
          {pageMeta.showFilters && (
            <button className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-medium text-text transition hover:bg-primary-soft hover:text-primary md:flex">
              <Filter size={16} />
              Filters
            </button>
          )}

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary transition hover:bg-primary-soft hover:text-primary"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-error" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-1 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-md">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-text">
                      Notifications
                    </p>
                    <p className="text-xs text-muted">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "All caught up"}
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((item) => ({ ...item, read: true })),
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium text-text">
                        No notifications yet
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        System alerts and activity updates will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`px-4 py-3 ${
                            item.read ? "bg-card" : "bg-primary-soft/35"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-text">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {item.message}
                              </p>
                            </div>
                            {!item.read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                            )}
                          </div>
                          <p className="mt-2 text-[11px] text-muted">
                            {item.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white px-3 py-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-text">{displayName}</p>
              <p className="text-xs text-muted">{email}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {initial}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
