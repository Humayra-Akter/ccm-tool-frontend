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

// ---------------- Uploads ----------------

export const getUploads = async (params = {}) => {
  const response = await api.get("/uploads", { params });
  return response.data.uploads;
};

export const uploadFile = async (formData, onUploadProgress) => {
  const response = await api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data.upload;
};

export const getUploadById = async (id) => {
  const response = await api.get(`/uploads/${id}`);
  return response.data.upload;
};

export const retryUpload = async (id) => {
  const response = await api.post(`/uploads/${id}/retry`);
  return response.data.upload;
};

export const downloadUpload = async (id) => {
  const response = await api.get(`/uploads/${id}/download`, {
    responseType: "blob",
  });

  return response.data;
};