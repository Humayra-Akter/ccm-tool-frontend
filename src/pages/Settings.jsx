import React from "react";
import {
  ShieldCheck,
  Bell,
  Database,
  SlidersHorizontal,
  Lock,
  UserCog,
  FileBarChart2,
  RefreshCcw,
  Save,
} from "lucide-react";
import KPICard from "../components/KPICard";

const settingSections = [
  {
    title: "System Preferences",
    subtitle: "Global portal-level configuration",
    icon: SlidersHorizontal,
    items: [
      { label: "Default landing page", value: "Dashboard" },
      { label: "Default reporting currency", value: "AED" },
      { label: "Timezone", value: "Asia/Dubai" },
      { label: "Date format", value: "DD MMM YYYY" },
    ],
  },
  {
    title: "Power BI & Refresh",
    subtitle: "Report connectivity and refresh behaviour",
    icon: FileBarChart2,
    items: [
      { label: "Embedding mode", value: "Power BI Embed" },
      { label: "Refresh cadence", value: "Hourly" },
      { label: "Workspace mode", value: "Production" },
      { label: "Last metadata sync", value: "24 Apr 2026 • 10:05 AM" },
    ],
  },
  {
    title: "Upload Rules",
    subtitle: "Validation, ingestion, and allowed file policies",
    icon: Database,
    items: [
      { label: "Allowed formats", value: "CSV, XLS, XLSX" },
      { label: "Maximum file size", value: "15 MB" },
      { label: "Duplicate file policy", value: "Warn and continue" },
      { label: "Auto-validation", value: "Enabled" },
    ],
  },
  {
    title: "Security & Access",
    subtitle: "Authentication, session, and control access preferences",
    icon: Lock,
    items: [
      { label: "Session timeout", value: "30 minutes" },
      { label: "Password policy", value: "Strong" },
      { label: "MFA mode", value: "Planned" },
      { label: "Audit logging", value: "Enabled" },
    ],
  },
];

const userAccess = [
  { role: "Admin", access: "Full configuration and operational control" },
  { role: "Analyst", access: "View, upload, exception update, export" },
  { role: "Viewer", access: "Read-only access to dashboard and KPI pages" },
  { role: "Auditor", access: "Read and export access with audit visibility" },
];

const notificationItems = [
  "Upload completed successfully",
  "Validation failed for uploaded file",
  "Power BI refresh completed",
  "Control status changed to critical",
  "Exception due date approaching",
];

const SettingsCard = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft/20 text-primary">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">
            Settings
          </h1>
          <p className="mt-1 text-base text-muted">
            Configure platform preferences, report behavior, upload policies,
            and access controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-soft/20">
            <RefreshCcw size={16} />
            Refresh Config
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
        <KPICard
          title="Active Roles"
          value="4"
          subtitle="Admin, Analyst, Viewer, Auditor"
          icon={UserCog}
          status="info"
          meta="Role matrix enabled"
          className="h-full"
        />

        <KPICard
          title="Control Mappings"
          value="7"
          subtitle="Mapped KPI/report definitions"
          icon={FileBarChart2}
          status="success"
          meta="All active controls mapped"
          className="h-full"
        />

        <KPICard
          title="Upload Policy"
          value="15"
          valueSuffix="MB"
          subtitle="Maximum file size per upload batch"
          icon={Database}
          status="warning"
          meta="Validation rules active"
          className="h-full"
        />

        <KPICard
          title="Audit Logging"
          value="On"
          subtitle="Tracking configuration and user actions"
          icon={ShieldCheck}
          status="success"
          meta="Compliance ready"
          className="h-full"
        />
      </div>

      {/* <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {settingSections.map((section) => (
          <SettingsCard
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            icon={section.icon}
          >
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg px-4 py-3"
                >
                  <span className="text-sm text-text">{item.label}</span>
                  <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-primary">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </SettingsCard>
        ))}
      </div> */}

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <SettingsCard
          title="User Access Matrix"
          subtitle="Role-level permissions visible in the current configuration"
          icon={UserCog}
        >
          <div className="space-y-3">
            {userAccess.map((item) => (
              <div
                key={item.role}
                className="flex items-start justify-between gap-4 rounded-lg border border-border bg-bg px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-text">{item.role}</p>
                  <p className="mt-1 text-sm text-muted">{item.access}</p>
                </div>

                <span className="rounded-full bg-primary-soft/20 px-3 py-1 text-xs font-semibold text-primary">
                  Active
                </span>
              </div>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard
          title="Notification Preferences"
          subtitle="Trigger points for system alerts and activity prompts"
          icon={Bell}
        >
          <div className="space-y-3">
            {notificationItems.map((item) => (
              <label
                key={item}
                className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3"
              >
                <span className="text-sm text-text">{item}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[var(--color-primary)]"
                />
              </label>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard
          title="Compliance Status"
          subtitle="System readiness and governance checkpoints"
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            {[
              "Audit trail enabled",
              "Role matrix configured",
              "Upload validation rules active",
              "Power BI embedding configured",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-success">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-sm text-text">{item}</span>
              </div>
            ))}
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Settings;
