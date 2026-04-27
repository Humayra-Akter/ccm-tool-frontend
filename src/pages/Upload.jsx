import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Database,
  RefreshCcw,
  Search,
  Filter,
  Download,
  Eye,
  FileBarChart2,
  XCircle,
} from "lucide-react";
import KPICard from "../components/KPICard";
import {
  getUploads,
  uploadFile,
  retryUpload,
  downloadUpload,
} from "../services/dashboard";

const uploadCategories = [
  { value: "CONTROL_SOURCE_DATA", label: "Control Source Data" },
  { value: "EXCEPTION_SOURCE", label: "Exception Source" },
  { value: "KPI_BASELINE", label: "KPI Baseline" },
  { value: "MASTER_DATA", label: "Master Data" },
  { value: "REPORT_REFRESH", label: "Report Refresh" },
  { value: "TEMPLATE", label: "Template" },
  { value: "OTHER", label: "Other" },
];

const controls = [
  { value: "EARLY_PAYMENTS", label: "Early Payments" },
  { value: "DUPLICATE_PAYMENTS", label: "Duplicate Payments" },
  { value: "DORMANT_PO", label: "Dormant PO" },
  { value: "TWO_WAY_MATCH", label: "Two Way Match" },
  { value: "NEW_UNDELIVERED_POS", label: "New Undelivered POs" },
  { value: "AGED_OPEN_ADVANCES", label: "Aged Open Advances" },
  { value: "INVOICE_SPLIT_BYPASS", label: "Invoice Split Bypass" },
  { value: "DELAY_IN_INVOICING", label: "Delay in Invoicing" },
];

const sourceSystems = [
  { value: "MANUAL_UPLOAD", label: "Manual Upload" },
  { value: "ERP", label: "ERP" },
  { value: "SAP", label: "SAP" },
  { value: "ORACLE", label: "Oracle" },
  { value: "POWERBI", label: "Power BI" },
  { value: "API", label: "API" },
  { value: "CSV", label: "CSV" },
  { value: "EXCEL", label: "Excel" },
  { value: "OTHER", label: "Other" },
];

const fileTemplates = [
  {
    title: "Control Source Template",
    desc: "Standard source format for KPI/control ingestion.",
  },
  {
    title: "Exception Register Template",
    desc: "Upload format for exception-level detail records.",
  },
  {
    title: "Master Data Template",
    desc: "Entity, vendor, and reference data upload format.",
  },
];

const statusStyles = {
  PENDING: "bg-slate-50 text-slate-600 border border-slate-100",
  UPLOADED: "bg-blue-50 text-blue-700 border border-blue-100",
  VALIDATING: "bg-amber-50 text-warning border border-amber-100",
  PROCESSING: "bg-amber-50 text-warning border border-amber-100",
  COMPLETED: "bg-emerald-50 text-success border border-emerald-100",
  PARTIAL: "bg-orange-50 text-orange-700 border border-orange-100",
  FAILED: "bg-red-50 text-error border border-red-100",
  ARCHIVED: "bg-slate-50 text-slate-500 border border-slate-100",

  SUCCESS: "bg-emerald-50 text-success border border-emerald-100",
  RUNNING: "bg-amber-50 text-warning border border-amber-100",
  PARTIAL_SUCCESS: "bg-orange-50 text-orange-700 border border-orange-100",
  CANCELLED: "bg-slate-50 text-slate-600 border border-slate-100",
};

const formatLabel = (value) => {
  if (!value) return "—";

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
};

const formatNumber = (value) => {
  const number = Number(value || 0);
  return number.toLocaleString();
};

const formatBytes = (bytes) => {
  const size = Number(bytes || 0);

  if (!size) return "—";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(size) / Math.log(1024));
  const normalized = size / Math.pow(1024, index);

  return `${normalized.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const Upload = () => {
  const fileInputRef = useRef(null);

  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("CONTROL_SOURCE_DATA");
  const [controlCode, setControlCode] = useState("DORMANT_PO");
  const [sourceSystem, setSourceSystem] = useState("MANUAL_UPLOAD");
  const [reportingPeriodStart, setReportingPeriodStart] = useState("");
  const [reportingPeriodEnd, setReportingPeriodEnd] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUploads = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = {};

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const data = await getUploads(params);
      setUploads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not load uploads.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const stats = useMemo(() => {
    const total = uploads.length;
    const completed = uploads.filter(
      (item) => item.status === "COMPLETED",
    ).length;
    const processing = uploads.filter((item) =>
      ["PENDING", "UPLOADED", "VALIDATING", "PROCESSING"].includes(item.status),
    ).length;
    const failed = uploads.filter((item) => item.status === "FAILED").length;

    return {
      total,
      completed,
      processing,
      failed,
    };
  }, [uploads]);

  const recentRuns = useMemo(() => {
    return uploads
      .flatMap((upload) => {
        const runs = Array.isArray(upload.processRuns)
          ? upload.processRuns
          : [];

        return runs.map((run) => ({
          id: run.id,
          title: formatLabel(run.type),
          subtitle: `${upload.control?.name || "General"} • ${
            upload.originalFileName || upload.fileName || "Upload"
          }`,
          time: formatDateTime(run.createdAt || run.startedAt),
          status: run.status,
        }));
      })
      .slice(0, 3);
  }, [uploads]);

  const filteredUploads = useMemo(() => {
    if (!searchTerm.trim()) return uploads;

    const needle = searchTerm.trim().toLowerCase();

    return uploads.filter((item) => {
      const values = [
        item.id,
        item.originalFileName,
        item.fileName,
        item.category,
        item.status,
        item.control?.name,
        item.uploadedBy?.fullName,
        item.uploadedBy?.email,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(needle),
      );
    });
  }, [uploads, searchTerm]);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const validateSelectedFile = (file) => {
    const allowedExtensions = [".csv", ".xls", ".xlsx"];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isAllowed) {
      setError("Only CSV, XLS, and XLSX files are allowed.");
      setSelectedFile(null);
      return false;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("File size must be 15 MB or less.");
      setSelectedFile(null);
      return false;
    }

    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccessMessage("");

    if (validateSelectedFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    setError("");
    setSuccessMessage("");

    if (validateSelectedFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);
      formData.append("controlCode", controlCode);
      formData.append("sourceSystem", sourceSystem);

      if (reportingPeriodStart) {
        formData.append("reportingPeriodStart", reportingPeriodStart);
      }

      if (reportingPeriodEnd) {
        formData.append("reportingPeriodEnd", reportingPeriodEnd);
      }

      await uploadFile(formData, (progressEvent) => {
        const total = progressEvent.total || 1;
        const progress = Math.round((progressEvent.loaded * 100) / total);
        setUploadProgress(progress);
      });

      setSelectedFile(null);
      setUploadProgress(0);
      setSuccessMessage("File uploaded successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadUploads();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetry = async (id) => {
    try {
      setError("");
      setSuccessMessage("");

      await retryUpload(id);
      setSuccessMessage("Upload retry completed.");
      await loadUploads();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Retry failed. Please try again.",
      );
    }
  };

  const handleDownload = async (upload) => {
    try {
      setError("");

      const blob = await downloadUpload(upload.id);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = upload.originalFileName || upload.fileName || "upload";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not download file.",
      );
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    loadUploads();
  };

  const handleExportCsv = () => {
    const headers = [
      "Upload ID",
      "File Name",
      "Category",
      "Control",
      "Uploaded By",
      "Uploaded At",
      "Rows",
      "Status",
      "File Size",
    ];

    const rows = filteredUploads.map((item) => [
      item.id,
      item.originalFileName || item.fileName || "",
      formatLabel(item.category),
      item.control?.name || "General",
      item.uploadedBy?.fullName || item.uploadedBy?.email || "System",
      formatDateTime(item.uploadedAt),
      item.rowCount || 0,
      item.status,
      formatBytes(item.fileSizeBytes),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ccm-upload-queue.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">
          Upload Center
        </h1>
        <p className="mt-1 text-base text-muted">
          Manage source files, validation runs, processing status, and refresh
          inputs.
        </p>
      </div>

      {(error || successMessage) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-red-100 bg-red-50 text-error"
              : "border-emerald-100 bg-emerald-50 text-success"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{error || successMessage}</span>
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccessMessage("");
              }}
              className="text-current opacity-70 transition hover:opacity-100"
            >
              <XCircle size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
        <KPICard
          title="Files Uploaded"
          value={stats.total}
          subtitle="Total files in upload queue"
          icon={UploadCloud}
          status="info"
          meta="Live from backend"
          className="h-full"
        />

        <KPICard
          title="Completed"
          value={stats.completed}
          subtitle="Files processed successfully"
          icon={CheckCircle2}
          status="success"
          meta="Validation complete"
          className="h-full"
        />

        <KPICard
          title="Processing"
          value={stats.processing}
          subtitle="Files in validation or parsing"
          icon={Clock3}
          status="warning"
          meta="System queue active"
          className="h-full"
        />

        <KPICard
          title="Failed"
          value={stats.failed}
          subtitle="Files needing review or retry"
          icon={AlertTriangle}
          status="error"
          meta="Action required"
          className="h-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-primary">New Upload</h3>
              <p className="mt-1 text-sm text-muted">
                Drag files here or browse to upload new control data.
              </p>
            </div>

            <div className="rounded-lg bg-primary-soft/20 px-3 py-2 text-xs font-medium text-primary">
              Max file size: 15 MB
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
          />

          <div
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`rounded-lg border border-dashed px-6 py-10 text-center transition ${
              isDragging
                ? "border-primary bg-primary-soft/20"
                : "border-primary/30 bg-bg"
            }`}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft/20 text-primary">
              <UploadCloud size={26} />
            </div>

            <h4 className="text-lg font-semibold text-primary">
              Drop files to start processing
            </h4>

            <p className="mt-2 text-sm text-muted">
              Supports CSV, XLS, and XLSX for KPI source data, exceptions, and
              master data.
            </p>

            {selectedFile && (
              <div className="mx-auto mt-5 max-w-xl rounded-lg border border-border bg-white px-4 py-3 text-sm text-text">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="font-semibold">{selectedFile.name}</span>
                  </div>
                  <span className="text-xs text-muted">
                    {formatBytes(selectedFile.size)}
                  </span>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="mx-auto mt-5 max-w-xl">
                <div className="h-2 overflow-hidden rounded-full bg-primary-soft/30">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleBrowse}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
              >
                Browse Files
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-soft/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? "Uploading..." : "Upload Now"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Upload Category
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
              >
                {uploadCategories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Target Control
              </label>
              <select
                value={controlCode}
                onChange={(event) => setControlCode(event.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
              >
                {controls.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Source System
              </label>
              <select
                value={sourceSystem}
                onChange={(event) => setSourceSystem(event.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
              >
                {sourceSystems.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Reporting Start
              </label>
              <input
                type="date"
                value={reportingPeriodStart}
                onChange={(event) =>
                  setReportingPeriodStart(event.target.value)
                }
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Reporting End
              </label>
              <input
                type="date"
                value={reportingPeriodEnd}
                onChange={(event) => setReportingPeriodEnd(event.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft/20 text-primary">
                <RefreshCcw size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Recent Runs
                </h3>
                <p className="text-sm text-muted">
                  Validation and refresh activity
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recentRuns.length === 0 ? (
                <div className="rounded-lg border border-border bg-bg p-4 text-sm text-muted">
                  No recent process runs yet.
                </div>
              ) : (
                recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="rounded-lg border border-border bg-bg p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {run.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {run.subtitle}
                        </p>
                        <p className="mt-2 text-xs text-muted">{run.time}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          statusStyles[run.status] ||
                          "border border-slate-100 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {formatLabel(run.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft/20 text-primary">
                <Database size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Templates
                </h3>
                <p className="text-sm text-muted">
                  Approved formats for upload
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {fileTemplates.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-bg p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">
                      <FileSpreadsheet size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">{item.desc}</p>
                    </div>
                  </div>

                  <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary-soft/20">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedUpload && (
        <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-primary">
                Upload Details
              </h3>
              <p className="mt-1 text-sm text-muted">
                {selectedUpload.originalFileName || selectedUpload.fileName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedUpload(null)}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary-soft/20"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-text">
                {formatLabel(selectedUpload.status)}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Rows
              </p>
              <p className="mt-2 text-sm font-semibold text-text">
                {formatNumber(selectedUpload.rowCount)}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                File Size
              </p>
              <p className="mt-2 text-sm font-semibold text-text">
                {formatBytes(selectedUpload.fileSizeBytes)}
              </p>
            </div>
          </div>

          {selectedUpload.errorMessage && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-error">
              {selectedUpload.errorMessage}
            </div>
          )}

          {selectedUpload.meta?.columns && (
            <div className="mt-4 rounded-lg border border-border bg-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Detected Columns
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedUpload.meta.columns.map((column) => (
                  <span
                    key={column}
                    className="rounded-full border border-border bg-white px-3 py-1 text-xs text-primary"
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-primary">Upload Queue</h3>
            <p className="mt-1 text-sm text-muted">
              Track uploaded files, status, target controls, and next actions.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search uploads"
                className="h-10 rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-text outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-white px-3 text-sm text-text outline-none"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UPLOADED">Uploaded</option>
              <option value="VALIDATING">Validating</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="PARTIAL">Partial</option>
              <option value="FAILED">Failed</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary-soft/20"
            >
              <Filter size={16} />
              Filter
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary-soft/20"
            >
              <Download size={16} />
              Export
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {[
                  "Upload ID",
                  "File Name",
                  "Category",
                  "Control",
                  "Uploaded By",
                  "Uploaded At",
                  "Rows",
                  "Status",
                  "Actions",
                ].map((head, index, arr) => (
                  <th
                    key={head}
                    className={`border-b border-border bg-bg px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted ${
                      index === 0 ? "rounded-tl-lg" : ""
                    } ${index === arr.length - 1 ? "rounded-tr-lg" : ""}`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="border-b border-border px-4 py-8 text-center text-sm text-muted"
                  >
                    Loading uploads...
                  </td>
                </tr>
              ) : filteredUploads.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="border-b border-border px-4 py-8 text-center text-sm text-muted"
                  >
                    No uploads found.
                  </td>
                </tr>
              ) : (
                filteredUploads.map((item) => (
                  <tr key={item.id} className="hover:bg-primary-soft/10">
                    <td className="border-b border-border px-4 py-3 text-sm font-semibold text-primary">
                      {item.id?.slice(0, 8)}
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm text-text">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        <span>{item.originalFileName || item.fileName}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted">
                        {formatBytes(item.fileSizeBytes)}
                      </div>
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm text-text">
                      {formatLabel(item.category)}
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm text-text">
                      {item.control?.name || "General"}
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm text-text">
                      {item.uploadedBy?.fullName ||
                        item.uploadedBy?.email ||
                        "System"}
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm text-muted">
                      {formatDateTime(item.uploadedAt)}
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm text-text">
                      {formatNumber(item.rowCount)}
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          statusStyles[item.status] ||
                          "border border-slate-100 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {formatLabel(item.status)}
                      </span>
                    </td>

                    <td className="border-b border-border px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUpload(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary-soft/20"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary-soft/20"
                        >
                          <Download size={14} />
                          File
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRetry(item.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary-soft/20"
                        >
                          <FileBarChart2 size={14} />
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Upload;
