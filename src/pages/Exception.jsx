import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Landmark,
  CalendarClock,
  Search,
  ArrowUpDown,
} from "lucide-react";
import KPICard from "../components/KPICard";
import Filter from "../components/Filter";
import Chart from "../components/Chart";
import BarTrendChart from "../components/BarTrendChart";
import Table from "../components/Table";
import {
  fetchExceptions,
  fetchExceptionAnalytics,
} from "../services/dashboard";

const getRiskBadge = (risk) => {
  const map = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        map[risk] || "bg-slate-100 text-slate-700"
      }`}
    >
      {risk}
    </span>
  );
};

const getStatusBadge = (status) => {
  const tone = {
    OPEN: "bg-red-100 text-red-700",
    ACKNOWLEDGED: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-sky-100 text-sky-700",
    RESOLVED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        tone[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
};

const entityOptions = [
  { value: "ALL", label: "All entities" },
  { value: "CORP_PROJ", label: "Corporate Projects" },
  { value: "PROC_SHARED", label: "Procurement Shared Services" },
  { value: "TRACK_DEV", label: "Track Development" },
  { value: "DELIVERY_OPS", label: "Delivery Operations" },
];

const riskOptions = [
  { value: "ALL", label: "All risk levels" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const statusOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "ACKNOWLEDGED", label: "Acknowledged" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const controlOptions = [
  { value: "ALL", label: "All controls" },
  { value: "EARLY_PAYMENTS", label: "Early Payments" },
  { value: "DUPLICATE_PAYMENTS", label: "Duplicate Payments" },
  { value: "DORMANT_PO", label: "Dormant PO" },
  { value: "TWO_WAY_MATCH", label: "Two Way Match" },
  { value: "NEW_UNDELIVERED_POS", label: "New Undelivered POs" },
  { value: "AGED_OPEN_ADVANCES", label: "Aged Open Advances" },
  { value: "INVOICE_SPLIT_BYPASS", label: "Invoice Split Bypass" },
];

const sortByOptions = [
  { value: "detectedAt", label: "Detected date" },
  { value: "dueDate", label: "Due date" },
  { value: "amount", label: "Amount" },
  { value: "risk", label: "Risk level" },
  { value: "id", label: "Exception ID" },
];

const sortDirOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

const ExceptionTracking = () => {
  const [analytics, setAnalytics] = useState(null);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const [filtersState, setFiltersState] = useState({
    entity: "ALL",
    risk: "ALL",
    status: "ALL",
    control: "ALL",
    sortBy: "detectedAt",
    sortDir: "desc",
    search: "",
    page: 1,
    limit: 10,
  });

  const loadPage = async (active = filtersState) => {
    try {
      setLoading(true);

      const [analyticsRes, listRes] = await Promise.all([
        fetchExceptionAnalytics(active),
        fetchExceptions(active),
      ]);

      setAnalytics(analyticsRes);
      setRows(listRes.rows || []);
      setPagination(listRes.pagination || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(filtersState);
  }, []);

  const filters = useMemo(
    () => [
      {
        key: "entity",
        value: filtersState.entity,
        options: entityOptions,
        onChange: (value) =>
          setFiltersState((prev) => ({ ...prev, entity: value })),
      },
      {
        key: "risk",
        value: filtersState.risk,
        options: riskOptions,
        onChange: (value) =>
          setFiltersState((prev) => ({ ...prev, risk: value })),
      },
      {
        key: "status",
        value: filtersState.status,
        options: statusOptions,
        onChange: (value) =>
          setFiltersState((prev) => ({ ...prev, status: value })),
      },
      {
        key: "control",
        value: filtersState.control,
        options: controlOptions,
        onChange: (value) =>
          setFiltersState((prev) => ({ ...prev, control: value })),
      },
      {
        key: "sortBy",
        value: filtersState.sortBy,
        options: sortByOptions,
        onChange: (value) =>
          setFiltersState((prev) => ({ ...prev, sortBy: value })),
      },
      {
        key: "sortDir",
        value: filtersState.sortDir,
        options: sortDirOptions,
        onChange: (value) =>
          setFiltersState((prev) => ({ ...prev, sortDir: value })),
      },
    ],
    [filtersState],
  );

  const clearFilters = () => {
    const reset = {
      entity: "ALL",
      risk: "ALL",
      status: "ALL",
      control: "ALL",
      sortBy: "detectedAt",
      sortDir: "desc",
      search: "",
      page: 1,
      limit: 10,
    };

    setFiltersState(reset);
    loadPage(reset);
  };

  const paginatedRows = rows.map((row, index) => ({
    ...row,
    serial: (pagination.page - 1) * pagination.limit + index + 1,
  }));

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-sm text-muted shadow-sm">
        Loading exception tracking...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">
          Exception Tracking
        </h1>
        <p className="mt-1 text-base text-muted">
          Review exceptions, severity, ownership, and status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
        <KPICard
          title="Total Exceptions"
          value={analytics?.summary?.total ?? 0}
          subtitle="Current registered exception items"
          icon={AlertTriangle}
          status="info"
          meta="Live register"
        />

        <KPICard
          title="High Risk"
          value={analytics?.summary?.highRisk ?? 0}
          subtitle="Exceptions needing immediate review"
          icon={ShieldAlert}
          status="error"
          meta="High severity"
        />

        <KPICard
          title="Financial Exposure"
          value={Number(analytics?.summary?.exposure || 0).toLocaleString()}
          valuePrefix="AED"
          subtitle="Potential total impact"
          icon={Landmark}
          status="warning"
          meta="Open exception value"
          compactValue
        />

        <KPICard
          title="Due This Cycle"
          value={
            (analytics?.summary?.highRisk ?? 0) +
            (analytics?.summary?.mediumRisk ?? 0)
          }
          subtitle="Open items due for action"
          icon={CalendarClock}
          status="success"
          meta="Operational follow-up"
        />
      </div>

      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-primary">
              Exception Filters & Sorting
            </h3>
            <p className="mt-1 text-sm text-muted">
              Narrow exception records for audit review.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={filtersState.search}
              onChange={(e) =>
                setFiltersState((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              placeholder="Search exception ID, entity, control..."
              className="h-11 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <Filter
          filters={filters}
          actions={[
            {
              key: "apply",
              label: "Apply",
              icon: ArrowUpDown,
              variant: "secondary",
              onClick: () => loadPage({ ...filtersState, page: 1 }),
            },
          ]}
          onClear={clearFilters}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Chart
          title="Exception Trend"
          subtitle="Movement of exceptions across the reporting timeline"
          data={analytics?.trend || []}
        />

        <BarTrendChart
          title="Exceptions by Control"
          subtitle="Where most findings are concentrated"
          data={analytics?.byControl || []}
        />
      </div>

      <Table
        title="All Exceptions"
        subtitle="Detailed exception register for audit review"
        rowKey="id"
        columns={[
          { key: "serial", label: "S/N" },
          {
            key: "risk",
            label: "Risk Level",
            render: (value) => getRiskBadge(value),
          },
          { key: "id", label: "ID" },
          { key: "control", label: "Control" },
          { key: "entity", label: "Entity" },
          {
            key: "status",
            label: "Status",
            render: (value) => getStatusBadge(value),
          },
          { key: "amount", label: "Amount" },
          { key: "dueDate", label: "Due Date" },
        ]}
        data={paginatedRows}
        emptyMessage="No exceptions found"
      />

      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <p className="text-sm text-muted">
          Showing page{" "}
          <span className="font-semibold text-text">{pagination.page}</span> of{" "}
          <span className="font-semibold text-text">
            {pagination.totalPages}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => {
              const next = { ...filtersState, page: pagination.page - 1 };
              setFiltersState(next);
              loadPage(next);
            }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-text disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => {
              const next = { ...filtersState, page: pagination.page + 1 };
              setFiltersState(next);
              loadPage(next);
            }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-text disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExceptionTracking;
