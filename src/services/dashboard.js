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

//------------Exception-----------------
export async function fetchExceptions(params = {}) {
  const res = await api.get("/dashboard/exceptions", { params });
  return res.data.data;
}

export async function fetchExceptionAnalytics(params = {}) {
  const res = await api.get("/dashboard/exceptions-analytics", { params });
  return res.data.data;
}

// -------------KPI----------------

export async function fetchKpiControls() {
  const res = await api.get("/kpi/controls");
  return res.data.data;
}

export async function fetchKpiReport(controlCode) {
  const res = await api.get(`/kpi/controls/${controlCode}/report`);
  return res.data.data;
}

export async function fetchKpiDemoPdf(controlCode) {
  const res = await api.get(`/kpi/controls/${controlCode}/pdf`, {
    responseType: "arraybuffer",
  });
  return res.data;
}