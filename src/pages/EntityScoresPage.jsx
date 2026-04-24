import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import BarTrendChart from "../components/BarTrendChart";
import { fetchDashboardEntityScores } from "../services/dashboard";

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

const EntityScoresPage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchDashboardEntityScores({ limit: 100 }).then(setRows);
  }, []);

  const chartData = rows.map((row) => ({
    label: row.entity,
    value: parseInt(row.businessResponse, 10) || 0,
  }));

  return (
    <div className="3">
      <BarTrendChart
        title="Business Response by Entity"
        subtitle="Quick comparison of current entity response levels"
        data={chartData}
      />

      <Table
        title="All Entity Scores"
        subtitle="Full entity-level exception and response view"
        rowKey="id"
        columns={[
          { key: "entity", label: "Entity" },
          { key: "exceptionDiscovery", label: "Exception Discovery" },
          { key: "businessResponse", label: "Business Response" },
          {
            key: "finalResults",
            label: "Final Results",
            render: (value) => getResultBadge(value),
          },
        ]}
        data={rows}
        emptyMessage="No entity score records found"
      />
    </div>
  );
};

export default EntityScoresPage;
