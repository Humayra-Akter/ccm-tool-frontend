import React, { useEffect, useMemo, useState } from "react";
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
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import KPICard from "../components/KPICard";
import {
  fetchSettings,
  updateSettings,
  resetSettings,
} from "../services/dashboard";

const defaultSettings = {
  system: {
    defaultLandingPage: "Dashboard",
    defaultCurrency: "AED",
    timezone: "Asia/Dubai",
    dateFormat: "DD MMM YYYY",
  },
  powerbi: {
    embeddingMode: "Power BI Embed",
    refreshCadence: "Hourly",
    workspaceMode: "Production",
    metadataSync: "Enabled",
  },
  upload: {
    allowedFormats: ["CSV", "XLS", "XLSX"],
    maxFileSizeMb: 15,
    duplicatePolicy: "Warn and continue",
    autoValidation: true,
  },
  security: {
    sessionTimeout: 30,
    passwordPolicy: "Strong",
    mfaMode: "Planned",
    auditLogging: true,
  },
  notifications: {
    uploadCompleted: true,
    validationFailed: true,
    powerBiRefreshCompleted: true,
    controlCritical: true,
    exceptionDueDateApproaching: true,
  },
};

const userAccess = [
  { role: "Admin", access: "Full configuration and operational control" },
  { role: "Analyst", access: "View, upload, exception update, export" },
  { role: "Viewer", access: "Read-only access to dashboard and KPI pages" },
  { role: "Auditor", access: "Read and export access with audit visibility" },
];

const notificationItems = [
  { key: "uploadCompleted", label: "Upload completed successfully" },
  { key: "validationFailed", label: "Validation failed for uploaded file" },
  { key: "powerBiRefreshCompleted", label: "Power BI refresh completed" },
  { key: "controlCritical", label: "Control status changed to critical" },
  {
    key: "exceptionDueDateApproaching",
    label: "Exception due date approaching",
  },
];

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition focus:border-primary";

const selectClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition focus:border-primary";

const mergeWithDefaults = (value = {}) => ({
  ...defaultSettings,
  ...value,
  system: {
    ...defaultSettings.system,
    ...(value.system || {}),
  },
  powerbi: {
    ...defaultSettings.powerbi,
    ...(value.powerbi || {}),
  },
  upload: {
    ...defaultSettings.upload,
    ...(value.upload || {}),
  },
  security: {
    ...defaultSettings.security,
    ...(value.security || {}),
  },
  notifications: {
    ...defaultSettings.notifications,
    ...(value.notifications || {}),
  },
});

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

const StatusMessage = ({ type, message, onClose }) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        isError
          ? "border-red-100 bg-red-50 text-error"
          : "border-emerald-100 bg-emerald-50 text-success"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{message}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold opacity-70 transition hover:opacity-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setMessage("");

      const data = await fetchSettings();

      setSettings(mergeWithDefaults(data.settings));
      setUpdatedAt(data.updatedAt || null);
      setIsDirty(false);
    } catch (error) {
      setMessageType("error");
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Could not load settings.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const activeNotificationCount = useMemo(() => {
    return Object.values(settings.notifications).filter(Boolean).length;
  }, [settings.notifications]);

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setIsDirty(true);
    setMessage("");
  };

  const handleNotificationChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));

    setIsDirty(true);
    setMessage("");
  };

  const handleAllowedFormatToggle = (format) => {
    setSettings((prev) => {
      const exists = prev.upload.allowedFormats.includes(format);

      const nextFormats = exists
        ? prev.upload.allowedFormats.filter((item) => item !== format)
        : [...prev.upload.allowedFormats, format];

      return {
        ...prev,
        upload: {
          ...prev.upload,
          allowedFormats: nextFormats,
        },
      };
    });

    setIsDirty(true);
    setMessage("");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage("");

      const data = await updateSettings(settings);

      setSettings(mergeWithDefaults(data.settings));
      setUpdatedAt(data.updatedAt || new Date().toISOString());
      setIsDirty(false);
      setMessageType("success");
      setMessage("Settings saved successfully.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Could not save settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    await loadSettings();
    setMessageType("success");
    setMessage("Configuration refreshed.");
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      setMessage("");

      const data = await resetSettings();

      setSettings(mergeWithDefaults(data.settings));
      setUpdatedAt(data.updatedAt || new Date().toISOString());
      setIsDirty(false);
      setMessageType("success");
      setMessage("Settings reset to defaults.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Could not reset settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString()
    : "Not saved yet";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">
            Settings
          </h1>
          <p className="mt-1 text-base text-muted">
            Loading platform configuration...
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted">
          Loading settings from server...
        </div>
      </div>
    );
  }

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

          <p className="mt-2 text-sm text-muted">
            Last updated:{" "}
            <span className="font-medium text-primary">
              {formattedUpdatedAt}
            </span>
            {isDirty && (
              <span className="ml-2 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-warning">
                Unsaved changes
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-soft/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={16} />
            Refresh Config
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-soft/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <StatusMessage
        type={messageType}
        message={message}
        onClose={() => setMessage("")}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
        <KPICard
          title="Active Roles"
          value={userAccess.length}
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
          value={settings.upload.maxFileSizeMb}
          valueSuffix="MB"
          subtitle={`${settings.upload.allowedFormats.join(", ")} allowed`}
          icon={Database}
          status="warning"
          meta={
            settings.upload.autoValidation
              ? "Validation rules active"
              : "Manual validation"
          }
          className="h-full"
        />

        <KPICard
          title="Audit Logging"
          value={settings.security.auditLogging ? "On" : "Off"}
          subtitle="Tracking configuration and user actions"
          icon={ShieldCheck}
          status={settings.security.auditLogging ? "success" : "error"}
          meta="Compliance readiness"
          className="h-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingsCard
          title="System Preferences"
          subtitle="Global portal-level configuration"
          icon={SlidersHorizontal}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Default Landing Page
              </label>
              <select
                value={settings.system.defaultLandingPage}
                onChange={(event) =>
                  handleChange(
                    "system",
                    "defaultLandingPage",
                    event.target.value,
                  )
                }
                className={selectClass}
              >
                <option value="Dashboard">Dashboard</option>
                <option value="KPI Overview">KPI Overview</option>
                <option value="Exception Tracking">Exception Tracking</option>
                <option value="Upload Center">Upload Center</option>
                <option value="Settings">Settings</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Default Currency
              </label>
              <select
                value={settings.system.defaultCurrency}
                onChange={(event) =>
                  handleChange("system", "defaultCurrency", event.target.value)
                }
                className={selectClass}
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Timezone
              </label>
              <select
                value={settings.system.timezone}
                onChange={(event) =>
                  handleChange("system", "timezone", event.target.value)
                }
                className={selectClass}
              >
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Europe/London">Europe/London</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Date Format
              </label>
              <select
                value={settings.system.dateFormat}
                onChange={(event) =>
                  handleChange("system", "dateFormat", event.target.value)
                }
                className={selectClass}
              >
                <option value="DD MMM YYYY">DD MMM YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Power BI & Refresh"
          subtitle="Report connectivity and refresh behaviour"
          icon={FileBarChart2}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Embedding Mode
              </label>
              <select
                value={settings.powerbi.embeddingMode}
                onChange={(event) =>
                  handleChange("powerbi", "embeddingMode", event.target.value)
                }
                className={selectClass}
              >
                <option value="Power BI Embed">Power BI Embed</option>
                <option value="Embed URL">Embed URL</option>
                <option value="Iframe">Iframe</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Refresh Cadence
              </label>
              <select
                value={settings.powerbi.refreshCadence}
                onChange={(event) =>
                  handleChange("powerbi", "refreshCadence", event.target.value)
                }
                className={selectClass}
              >
                <option value="Manual">Manual</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Workspace Mode
              </label>
              <select
                value={settings.powerbi.workspaceMode}
                onChange={(event) =>
                  handleChange("powerbi", "workspaceMode", event.target.value)
                }
                className={selectClass}
              >
                <option value="Development">Development</option>
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Metadata Sync
              </label>
              <select
                value={settings.powerbi.metadataSync}
                onChange={(event) =>
                  handleChange("powerbi", "metadataSync", event.target.value)
                }
                className={selectClass}
              >
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Upload Rules"
          subtitle="Validation, ingestion, and allowed file policies"
          icon={Database}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Allowed Formats
              </label>

              <div className="flex flex-wrap gap-2">
                {["CSV", "XLS", "XLSX"].map((format) => {
                  const active =
                    settings.upload.allowedFormats.includes(format);

                  return (
                    <button
                      key={format}
                      type="button"
                      onClick={() => handleAllowedFormatToggle(format)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-primary-soft/20 text-primary"
                          : "border-border bg-white text-muted"
                      }`}
                    >
                      {format}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Maximum File Size MB
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.upload.maxFileSizeMb}
                onChange={(event) =>
                  handleChange(
                    "upload",
                    "maxFileSizeMb",
                    Number(event.target.value),
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Duplicate File Policy
              </label>
              <select
                value={settings.upload.duplicatePolicy}
                onChange={(event) =>
                  handleChange("upload", "duplicatePolicy", event.target.value)
                }
                className={selectClass}
              >
                <option value="Warn and continue">Warn and continue</option>
                <option value="Reject duplicate">Reject duplicate</option>
                <option value="Replace previous">Replace previous</option>
              </select>
            </div>

            <label className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3">
              <span className="text-sm text-text">Auto-validation</span>
              <input
                type="checkbox"
                checked={settings.upload.autoValidation}
                onChange={(event) =>
                  handleChange("upload", "autoValidation", event.target.checked)
                }
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
            </label>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Security & Access"
          subtitle="Authentication, session, and control access preferences"
          icon={Lock}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Session Timeout Minutes
              </label>
              <input
                type="number"
                min="5"
                max="240"
                value={settings.security.sessionTimeout}
                onChange={(event) =>
                  handleChange(
                    "security",
                    "sessionTimeout",
                    Number(event.target.value),
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Password Policy
              </label>
              <select
                value={settings.security.passwordPolicy}
                onChange={(event) =>
                  handleChange("security", "passwordPolicy", event.target.value)
                }
                className={selectClass}
              >
                <option value="Basic">Basic</option>
                <option value="Strong">Strong</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                MFA Mode
              </label>
              <select
                value={settings.security.mfaMode}
                onChange={(event) =>
                  handleChange("security", "mfaMode", event.target.value)
                }
                className={selectClass}
              >
                <option value="Disabled">Disabled</option>
                <option value="Planned">Planned</option>
                <option value="Optional">Optional</option>
                <option value="Required">Required</option>
              </select>
            </div>

            <label className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3">
              <span className="text-sm text-text">Audit logging</span>
              <input
                type="checkbox"
                checked={settings.security.auditLogging}
                onChange={(event) =>
                  handleChange("security", "auditLogging", event.target.checked)
                }
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
            </label>
          </div>
        </SettingsCard>
      </div>

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
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-4 py-3"
              >
                <span className="text-sm text-text">{item.label}</span>
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key]}
                  onChange={() => handleNotificationChange(item.key)}
                  className="h-4 w-4 accent-[var(--color-primary)]"
                />
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-border bg-white px-4 py-3 text-sm text-muted">
            {activeNotificationCount} of {notificationItems.length} alerts
            enabled.
          </div>
        </SettingsCard>

        <SettingsCard
          title="Compliance Status"
          subtitle="System readiness and governance checkpoints"
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            {[
              {
                label: "Audit trail enabled",
                active: settings.security.auditLogging,
              },
              {
                label: "Role matrix configured",
                active: true,
              },
              {
                label: "Upload validation rules active",
                active: settings.upload.autoValidation,
              },
              {
                label: "Power BI embedding configured",
                active: settings.powerbi.embeddingMode !== "Iframe",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    item.active
                      ? "bg-emerald-50 text-success"
                      : "bg-red-50 text-error"
                  }`}
                >
                  {item.active ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <AlertTriangle size={16} />
                  )}
                </div>
                <span className="text-sm text-text">{item.label}</span>
              </div>
            ))}
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Settings;
