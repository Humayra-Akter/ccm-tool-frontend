import React, { useEffect, useState } from "react";
import { BarChart3, ExternalLink } from "lucide-react";
import { fetchKpiControls, fetchKpiReport } from "../services/dashboard";
import PdfViewer from "../components/PdfViewer";

const KPI = () => {
  const [controls, setControls] = useState([]);
  const [selectedControl, setSelectedControl] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loadingControls, setLoadingControls] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadControls = async () => {
      try {
        setLoadingControls(true);
        setErrorMsg("");

        const data = await fetchKpiControls();
        setControls(data);

        if (data?.length) {
          const dormantPo =
            data.find((item) => item.code === "DORMANT_PO") || data[0];

          setSelectedControl(dormantPo);
          await loadReport(dormantPo.code);
        }
      } catch (error) {
        setErrorMsg(
          error?.response?.data?.message || "Failed to load KPI controls.",
        );
      } finally {
        setLoadingControls(false);
      }
    };

    loadControls();
  }, []);

  const loadReport = async (controlCode) => {
    try {
      setLoadingReport(true);
      setErrorMsg("");

      const data = await fetchKpiReport(controlCode);
      setReportData(data);
    } catch (error) {
      setReportData(null);
      setErrorMsg(
        error?.response?.data?.message || "Failed to load KPI report.",
      );
    } finally {
      setLoadingReport(false);
    }
  };

  const handleSelectControl = async (control) => {
    setSelectedControl(control);
    await loadReport(control.code);
  };

  const renderReportPanel = () => {
    if (loadingReport) {
      return (
        <div className="flex h-[420px] items-center justify-center rounded-lg border border-border bg-bg text-sm text-muted">
          Loading report...
        </div>
      );
    }

    if (reportData?.state === "DEMO_PDF") {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-white px-4 py-3">
            <p className="text-sm font-semibold text-primary">
              Dormant PO Demo Report
            </p>
            <p className="mt-1 text-xs text-muted">
              PDF preview shown inside the CCM portal for demonstration
            </p>
          </div>

          <PdfViewer controlCode="DORMANT_PO" />

          <div className="rounded-lg bg-primary-soft/20 px-4 py-3 text-sm text-primary">
            Demo mode: Dormant PO is showing a PDF preview inside the portal.
          </div>
        </div>
      );
    }

    if (reportData?.state === "READY") {
      return (
        <div className="overflow-hidden rounded-lg border border-border bg-bg">
          <div className="border-b border-border bg-white px-4 py-3">
            <p className="text-sm font-semibold text-primary">
              {reportData.report.reportName}
            </p>
            <p className="mt-1 text-xs text-muted">Published Power BI report</p>
          </div>

          <iframe
            title={reportData.report.reportName}
            src={reportData.report.embedUrl}
            className="h-[760px] w-full"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-border bg-bg px-8 text-center">
        <div>
          <p className="text-lg font-semibold text-primary">
            No data available
          </p>
          <p className="mt-2 text-sm text-muted">
            No report or preview is available for this control yet.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">
          KPI Overview
        </h1>
        <p className="mt-1 text-base text-muted">
          Select a control area to view its linked Power BI output.
        </p>
      </div>

      {loadingControls ? (
        <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted shadow-sm">
          Loading KPI controls...
        </div>
      ) : errorMsg && !controls.length ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-sm text-red-600">
          {errorMsg}
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card p-4 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primary">
                Available Controls
              </h3>
              <p className="mt-1 text-sm text-muted">
                Click any KPI to load its mapped report.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {controls.map((control) => {
                const active = selectedControl?.code === control.code;

                return (
                  <button
                    key={control.code}
                    type="button"
                    onClick={() => handleSelectControl(control)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-border bg-primary-soft hover:border-primary-soft hover:bg-primary-soft/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            active ? "text-white" : "text-text"
                          }`}
                        >
                          {control.name}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            active ? "text-white/80" : "text-muted"
                          }`}
                        >
                          {control.category}
                        </p>
                      </div>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-primary-soft/20 text-primary"
                        }`}
                      >
                        <BarChart3 size={18} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
            <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
              <h3 className="text-xl font-semibold text-primary">
                Selected KPI
              </h3>

              {selectedControl ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg bg-primary-soft/20 p-4">
                    <p className="text-sm font-semibold text-primary">
                      {selectedControl.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {selectedControl.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      Description
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text">
                      {selectedControl.description ||
                        "No description available."}
                    </p>
                  </div>

                  {reportData?.report?.reportName ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                        Mapped Report
                      </p>
                      <p className="mt-2 text-sm font-medium text-text">
                        {reportData.report.reportName}
                      </p>

                      {reportData?.state === "READY" &&
                      reportData?.report?.embedUrl ? (
                        <a
                          href={reportData.report.embedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary-soft/20"
                        >
                          Open externally
                          <ExternalLink size={15} />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  Select a control to view report details.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)]">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-primary">
                  Power BI Output
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Dynamic report view based on selected control.
                </p>
              </div>

              {errorMsg && reportData === null ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                  {errorMsg}
                </div>
              ) : (
                renderReportPanel()
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KPI;
