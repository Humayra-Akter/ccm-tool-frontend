import api from "./api";

export async function fetchDashboardSummary(params = {}) {
  const res = await api.get("/dashboard/summary", { params });
  return res.data.data;
}

export async function fetchDashboardTrend(params = {}) {
  const res = await api.get("/dashboard/trend", { params });
  return res.data.data;
}

export async function fetchDashboardKpiHealth(params = {}) {
  const res = await api.get("/dashboard/kpi-health", { params });
  return res.data.data;
}

export async function fetchDashboardRecentExceptions(params = {}) {
  const res = await api.get("/dashboard/recent-exceptions", { params });
  return res.data.data;
}

export async function fetchDashboardEntityScores(params = {}) {
  const res = await api.get("/dashboard/entity-scores", { params });
  return res.data.data;
}
