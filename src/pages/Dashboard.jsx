import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Landmark,
  ClipboardList,
} from "lucide-react";
import KPICard from "../components/KPICard";
import Filter from "../components/Filter";
import Chart from "../components/Chart";
import Table from "../components/Table";

const trendData = [
  { label: "Jan", value: 38 },
  { label: "Feb", value: 42 },
  { label: "Mar", value: 40 },
  { label: "Apr", value: 58 },
  { label: "May", value: 62 },
  { label: "Jun", value: 78 },
  { label: "Jul", value: 104 },
  { label: "Aug", value: 86 },
  { label: "Sep", value: 72 },
  { label: "Oct", value: 58 },
  { label: "Nov", value: 45 },
  { label: "Dec", value: 50 },
];

const kpiHealth = [
  { name: "Early Payments", count: 3, status: "Critical" },
  { name: "Duplicate Payments", count: 4, status: "Warning" },
  { name: "Dormant PO", count: 1, status: "Healthy" },
  { name: "Two Way Match", count: 4, status: "Healthy" },
  { name: "New Undelivered POs", count: 2, status: "Warning" },
  { name: "Aged Open Advances", count: 3, status: "Warning" },
  { name: "Invoice Split Bypass", count: 4, status: "Warning" },
];

const recentExceptions = [
  {
    risk: "High",
    id: "AS0963",
    entity: "Duplicate Invoice",
    amount: "127,000",
    dueDate: "27 May 2026",
  },
  {
    risk: "Medium",
    id: "AS0943",
    entity: "Paid after Due Date",
    amount: "135,000",
    dueDate: "17 May 2026",
  },
  {
    risk: "Low",
    id: "AS0923",
    entity: "Inactive Account",
    amount: "132,000",
    dueDate: "21 May 2026",
  },
  {
    risk: "Low",
    id: "AS0939",
    entity: "New Account Issued",
    amount: "142,000",
    dueDate: "23 May 2026",
  },
];

const entityScores = [
  {
    entity: "Corporate",
    exceptionDiscovery: "0.01%",
    businessResponse: "0%",
    finalResults: "0%",
  },
  {
    entity: "Development",
    exceptionDiscovery: "0.01%",
    businessResponse: "0%",
    finalResults: "0%",
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
      className={`inline-flex min-w-[84px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
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

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">CCM Dashboard</h1>
          <p className="text-sm text-muted">
            Monitor KPI performance, control exceptions, and entity-level
            results.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total KPIs"
          value="7"
          subtitle="All active control areas"
          icon={ShieldCheck}
          tone="success"
        />

        <KPICard
          title="Exception KPIs"
          value="3"
          subtitle="Increase • Decrease • Update"
          icon={AlertTriangle}
          tone="danger"
        />

        <KPICard
          title="Financial Impact"
          value="AED 30.4M"
          subtitle="Potential savings exposure"
          icon={Landmark}
          tone="warning"
        />

        <KPICard
          title="Open Findings"
          value="25"
          subtitle="Critical 3 • High 7 • Medium 15"
          icon={ClipboardList}
          tone="neutral"
        />
      </div>

      {/* filters */}
      <Filter />

      {/* middle section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Chart title="Risk Score Trend" data={trendData} />

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-secondary">
            KPI health list
          </h3>

          <div className="overflow-hidden rounded-xl border border-border">
            {kpiHealth.map((item, index) => (
              <div
                key={item.name}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 ${
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

      {/* bottom section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Table
          title="Recent Exceptions"
          columns={[
            {
              key: "risk",
              label: "Risk Level",
              render: (value) => getRiskBadge(value),
            },
            { key: "id", label: "ID" },
            { key: "entity", label: "Entity" },
            { key: "amount", label: "Amount (AED)" },
            { key: "dueDate", label: "Due Date" },
          ]}
          data={recentExceptions}
        />

        <Table
          title="Entity Wise Score"
          columns={[
            {
              key: "entity",
              label: "Entity",
              render: (value) => (
                <span className="font-semibold text-secondary">{value}</span>
              ),
            },
            { key: "exceptionDiscovery", label: "Exception Discovery" },
            { key: "businessResponse", label: "Business Response" },
            { key: "finalResults", label: "Final Results" },
          ]}
          data={entityScores}
          compact
        />
      </div>
    </div>
  );
};

export default Dashboard;
