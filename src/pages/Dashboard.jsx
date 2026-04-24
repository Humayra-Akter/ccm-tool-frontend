import React, { useEffect, useMemo, useState } from "react";
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

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [kpiHealth, setKpiHealth] = useState([]);
  const [recentExceptions, setRecentExceptions] = useState([]);
  const [entityScores, setEntityScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const [summaryRes, trendRes, healthRes, exceptionsRes, entityRes] =
          await Promise.all([
            fetchDashboardSummary(),
            fetchDashboardTrend(),
            fetchDashboardKpiHealth(),
            fetchDashboardRecentExceptions(),
            fetchDashboardEntityScores(),
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

    loadDashboard();
  }, []);

  const filters = useMemo(
    () => [
      { key: "period", label: "Period", value: "Current cycle" },
      { key: "entity", label: "Entity", value: "All entities" },
      { key: "process", label: "Process", value: "All processes" },
    ],
    [],
  );

  const actions = useMemo(
    () => [
      {
        key: "report",
        label: "Generate Report",
        icon: FileText,
        variant: "secondary",
        onClick: () => console.log("Generate report"),
      },
      {
        key: "export",
        label: "Export Data",
        icon: Download,
        variant: "primary",
        onClick: () => console.log("Export data"),
      },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-sm text-muted shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">
          CCM Dashboard
        </h1>
        <p className="mt-1 text-base text-muted">
          Monitor KPI performance, control exceptions, and entity-level results.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total KPIs"
          value={summary?.totalKpis ?? 0}
          subtitle="All active control areas"
          icon={ShieldCheck}
          status="success"
          meta="Live from database"
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
        />

        <KPICard
          title="Financial Impact"
          value={`AED ${Number(summary?.financialImpact || 0).toLocaleString()}`}
          subtitle="Potential exposure exceptions"
          icon={Landmark}
          status="warning"
          meta="Current monitoring cycle"
        />

        <KPICard
          title="Open Findings"
          value={summary?.openFindings ?? 0}
          subtitle={`Critical ${summary?.criticalControls ?? 0} • Warning ${
            summary?.warningControls ?? 0
          } • Healthy ${summary?.healthyControls ?? 0}`}
          icon={ClipboardList}
          status="info"
          trend="Live"
        />
      </div>

      <Filter
        title="Dashboard Filters"
        subtitle="Refine control, entity, and reporting period views"
        filters={filters}
        actions={actions}
        onClear={() => console.log("Clear filters")}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Chart
          title="Risk Score Trend"
          subtitle="Overall risk movement across the monitoring year"
          data={trendData}
        />

        <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)] lg:p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-primary">
              KPI health list
            </h3>
            <p className="mt-1 text-sm text-muted">
              Status across active control areas
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            {kpiHealth.map((item, index) => (
              <div
                key={item.id || item.name}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3.5 ${
                  index !== kpiHealth.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <p className="text-sm font-medium text-text">{item.name}</p>
                <span className="text-sm font-semibold text-text">
                  {item.count}
                </span>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Table
          title="Recent Exceptions"
          subtitle="Latest open findings from the live backend"
          rowKey="id"
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
