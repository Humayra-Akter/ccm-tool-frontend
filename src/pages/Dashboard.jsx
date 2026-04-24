import React, { useMemo } from "react";
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

const seededControls = [
  { name: "Early Payments", findings: 3, status: "Critical" },
  { name: "Duplicate Payments", findings: 4, status: "Warning" },
  { name: "Dormant PO", findings: 1, status: "Healthy" },
  { name: "Two Way Match", findings: 4, status: "Healthy" },
  { name: "New Undelivered POs", findings: 2, status: "Warning" },
  { name: "Aged Open Advances", findings: 3, status: "Warning" },
  { name: "Invoice Split Bypass", findings: 4, status: "Warning" },
];

const trendData = [
  { label: "Jan", value: 42 },
  { label: "Feb", value: 45 },
  { label: "Mar", value: 44 },
  { label: "Apr", value: 58 },
  { label: "May", value: 63 },
  { label: "Jun", value: 79 },
  { label: "Jul", value: 96 },
  { label: "Aug", value: 84 },
  { label: "Sep", value: 71 },
  { label: "Oct", value: 59 },
  { label: "Nov", value: 48 },
  { label: "Dec", value: 52 },
];

const recentExceptions = [
  {
    id: "EX-1001",
    risk: "High",
    control: "Duplicate Payments",
    entity: "Abu Dhabi Infra",
    amount: "AED 4.8M",
    dueDate: "27 May 2026",
  },
  {
    id: "EX-1002",
    risk: "Medium",
    control: "Aged Open Advances",
    entity: "Corporate Projects",
    amount: "AED 3.2M",
    dueDate: "29 May 2026",
  },
  {
    id: "EX-1003",
    risk: "High",
    control: "Invoice Split Bypass",
    entity: "Procurement Shared Services",
    amount: "AED 5.9M",
    dueDate: "31 May 2026",
  },
  {
    id: "EX-1004",
    risk: "Low",
    control: "Dormant PO",
    entity: "Track Development",
    amount: "AED 0.7M",
    dueDate: "02 Jun 2026",
  },
  {
    id: "EX-1005",
    risk: "Medium",
    control: "New Undelivered POs",
    entity: "Delivery Operations",
    amount: "AED 2.4M",
    dueDate: "04 Jun 2026",
  },
];

const entityScores = [
  {
    id: 1,
    entity: "Corporate Projects",
    exceptionDiscovery: "0.84%",
    businessResponse: "78%",
    finalResults: "Moderate",
  },
  {
    id: 2,
    entity: "Procurement Shared Services",
    exceptionDiscovery: "1.22%",
    businessResponse: "64%",
    finalResults: "High",
  },
  {
    id: 3,
    entity: "Track Development",
    exceptionDiscovery: "0.31%",
    businessResponse: "86%",
    finalResults: "Low",
  },
  {
    id: 4,
    entity: "Delivery Operations",
    exceptionDiscovery: "0.67%",
    businessResponse: "73%",
    finalResults: "Moderate",
  },
];

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
  const totalFindings = useMemo(
    () => seededControls.reduce((sum, item) => sum + item.findings, 0),
    [],
  );

  const criticalCount = seededControls.filter(
    (x) => x.status === "Critical",
  ).length;
  const warningCount = seededControls.filter(
    (x) => x.status === "Warning",
  ).length;
  const healthyCount = seededControls.filter(
    (x) => x.status === "Healthy",
  ).length;
  const exceptionKpis = seededControls.filter(
    (x) => x.status !== "Healthy",
  ).length;

  const filters = [
    { key: "period", label: "Period", value: "Current cycle" },
    { key: "entity", label: "Entity", value: "All entities" },
    { key: "process", label: "Process", value: "All processes" },
  ];

  const actions = [
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
  ];

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-primary">
          CCM Dashboard
        </h1>
        <p className="mt-1 text-base text-muted">
          Monitor KPI performance, control exceptions, and entity-level results.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total KPIs"
          value={seededControls.length}
          subtitle="All active seeded control areas"
          icon={ShieldCheck}
          status="success"
          meta="7 active controls from seed"
        />

        <KPICard
          title="Exception KPIs"
          value={exceptionKpis}
          subtitle={`${criticalCount} critical • ${warningCount} warning controls`}
          icon={AlertTriangle}
          status="error"
          meta="Controls needing attention"
        />

        <KPICard
          title="Financial Impact"
          value="AED 17.0M"
          subtitle="Potential exposure exceptions"
          icon={Landmark}
          status="warning"
          meta="Seed-aligned demo estimate"
        />

        <KPICard
          title="Open Findings"
          value={totalFindings}
          subtitle={`Critical ${criticalCount} • Warning ${warningCount} • Healthy ${healthyCount}`}
          icon={ClipboardList}
          status="info"
          trend="Current cycle"
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
          subtitle="Overall risk movement across the current monitoring year"
          data={trendData}
          seriesLabel="Risk score"
        />

        <div className="rounded-xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)] lg:p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-primary">
              KPI health list
            </h3>
            <p className="mt-1 text-sm text-muted">
              Status across seeded active control areas
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            {seededControls.map((item, index) => (
              <div
                key={item.name}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3.5 ${
                  index !== seededControls.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <p className="text-sm font-medium text-text">{item.name}</p>
                <span className="text-sm font-semibold text-text">
                  {item.findings}
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
          subtitle="Sample open findings aligned to the seeded control catalog"
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
        />

        <Table
          title="Entity Wise Score"
          subtitle="Illustrative response and exception performance by entity"
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
        />
      </div>
    </div>
  );
};

export default Dashboard;
