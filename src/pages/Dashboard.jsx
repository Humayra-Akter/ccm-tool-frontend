import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  Landmark,
  ClipboardList,
  FileText,
  Download,
} from "lucide-react";
import KPICard from "../components/KPICard";
import Filter from "../components/Filter";
import Chart from "../components/Chart";
import BarTrendChart from "../components/BarTrendChart";
import Table from "../components/Table";
import {
  fetchDashboardSummary,
  fetchDashboardTrend,
  fetchDashboardKpiHealth,
  fetchDashboardRecentExceptions,
  fetchDashboardEntityScores,
} from "../services/dashboard";

const getStatusBadge = (status) => {
  const map = {
    Critical: "bg-red-100 text-red-700",
    Warning: "bg-amber-100 text-amber-700",
    Healthy: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex min-w-[90px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
        map[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
};

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

const getResultBadge = (value) => {
  const map = {
    High: "bg-red-100 text-red-700",
    Moderate: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        map[value] || "bg-slate-100 text-slate-700"
      }`}
    >
      {value}
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

const periodOptions = [
  { value: "CURRENT", label: "Current cycle" },
  { value: "YTD", label: "Year to date" },
];

const processOptions = [
  { value: "ALL", label: "All processes" },
  { value: "P2P", label: "Procure to Pay" },
  { value: "PAYMENT", label: "Payment" },
  { value: "INVOICING", label: "Invoicing" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [kpiHealth, setKpiHealth] = useState([]);
  const [recentExceptions, setRecentExceptions] = useState([]);
  const [entityScores, setEntityScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [filterState, setFilterState] = useState({
    period: "CURRENT",
    entity: "ALL",
    process: "ALL",
  });

  const loadDashboard = async (activeFilters = filterState) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const params = {
        period: activeFilters.period,
        entity: activeFilters.entity,
        process: activeFilters.process,
      };

      const [summaryRes, trendRes, healthRes, exceptionsRes, entityRes] =
        await Promise.all([
          fetchDashboardSummary(params),
          fetchDashboardTrend(params),
          fetchDashboardKpiHealth(params),
          fetchDashboardRecentExceptions({ ...params, limit: 5 }),
          fetchDashboardEntityScores({ ...params, limit: 5 }),
        ]);

      setSummary(summaryRes);
      setTrendData(trendRes);
      setKpiHealth(healthRes);
      setRecentExceptions(exceptionsRes);
      setEntityScores(entityRes);
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(filterState);
  }, []);

  const filters = useMemo(
    () => [
      {
        key: "period",
        label: "Period",
        value: filterState.period,
        options: periodOptions,
        onChange: (value) =>
          setFilterState((prev) => ({ ...prev, period: value })),
      },
      {
        key: "entity",
        label: "Entity",
        value: filterState.entity,
        options: entityOptions,
        onChange: (value) =>
          setFilterState((prev) => ({ ...prev, entity: value })),
      },
      {
        key: "process",
        label: "Process",
        value: filterState.process,
        options: processOptions,
        onChange: (value) =>
          setFilterState((prev) => ({ ...prev, process: value })),
      },
    ],
    [filterState],
  );

  const actions = useMemo(
    () => [
      {
        key: "report",
        label: "Apply Filters",
        icon: FileText,
        variant: "secondary",
        onClick: () => loadDashboard(filterState),
      },
      {
        key: "export",
        label: "Export Data",
        icon: Download,
        variant: "primary",
        onClick: () => console.log("Export data"),
      },
    ],
    [filterState],
  );

  const exceptionVolumeByControl = useMemo(() => {
    return kpiHealth.map((item) => ({
      label: item.name,
      value: item.count,
    }));
  }, [kpiHealth]);

  const handleClear = () => {
    const reset = {
      period: "CURRENT",
      entity: "ALL",
      process: "ALL",
    };
    setFilterState(reset);
    loadDashboard(reset);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-sm text-red-600">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">
          CCM Dashboard
        </h1>
        <p className="mt-1 text-base text-muted">
          Monitor KPI performance, control exceptions, and entity-level results.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
        <KPICard
          title="Total KPIs"
          value={summary?.totalKpis ?? 0}
          subtitle="All active control areas"
          icon={ShieldCheck}
          status="success"
          meta="Live from database"
          className="h-full"
        />

        <KPICard
          title="Exception KPIs"
          value={summary?.exceptionKpis ?? 0}
          subtitle={`${summary?.criticalControls ?? 0} critical • ${
            summary?.warningControls ?? 0
          } warning controls`}
          icon={AlertTriangle}
          status="error"
          meta="Controls needing attention"
          className="h-full"
        />

        <KPICard
          title="Financial Impact"
          value={Number(summary?.financialImpact || 0).toLocaleString()}
          valuePrefix="AED"
          subtitle="Potential exposure exceptions"
          icon={Landmark}
          status="warning"
          meta="Current monitoring cycle"
          compactValue
          className="h-full"
        />

        <KPICard
          title="Open Findings"
          value={summary?.openFindings ?? 0}
          subtitle={`Critical ${summary?.criticalControls ?? 0} • Warning ${
            summary?.warningControls ?? 0
          } • Healthy ${summary?.healthyControls ?? 0}`}
          icon={ClipboardList}
          status="info"
          badge="Live"
          meta="Current open exception inventory"
          className="h-full"
        />
      </div>

      <Filter
        title="Dashboard Filters"
        subtitle="Refine control, entity, and reporting period views"
        filters={filters}
        actions={actions}
        onClear={handleClear}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Chart
          title="Risk Score Trend"
          subtitle="Overall risk movement across the monitoring year"
          data={trendData}
        />

        <BarTrendChart
          title="Exception Volume by Control"
          subtitle="Current open findings across active control areas"
          data={exceptionVolumeByControl}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Table
          title="Recent Exceptions"
          subtitle="Latest open findings from the live backend"
          rowKey="id"
          actionLabel="View all"
          onAction={() => navigate("/app/exception")}
          columns={[
            {
              key: "risk",
              label: "Risk Level",
              render: (value) => getRiskBadge(value),
            },
            { key: "id", label: "ID" },
            { key: "control", label: "Control" },
            { key: "entity", label: "Entity" },
            { key: "amount", label: "Amount" },
            { key: "dueDate", label: "Due Date" },
          ]}
          data={recentExceptions}
          emptyMessage="No open exceptions yet"
        />

        <Table
          title="Entity Wise Score"
          subtitle="Entity-level exception and response performance"
          rowKey="id"
          actionLabel="View all"
          onAction={() => navigate("/app/entity-scores")}
          columns={[
            {
              key: "entity",
              label: "Entity",
              render: (value) => (
                <span className="font-semibold text-primary">{value}</span>
              ),
            },
            { key: "exceptionDiscovery", label: "Exception Discovery" },
            { key: "businessResponse", label: "Business Response" },
            {
              key: "finalResults",
              label: "Final Results",
              render: (value) => getResultBadge(value),
            },
          ]}
          data={entityScores}
          compact
          emptyMessage="No entity score records yet"
        />
      </div>
    </div>
  );
};

export default Dashboard;
