import React, { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { fetchKpiDemoPdf } from "../services/dashboard";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PdfViewer = ({ controlCode = "DORMANT_PO" }) => {
  const [pdfData, setPdfData] = useState(null);
  const [loadingFile, setLoadingFile] = useState(true);
  const [fileError, setFileError] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.05);

  useEffect(() => {
    let active = true;

    const loadPdf = async () => {
      try {
        setLoadingFile(true);
        setFileError("");
        setPdfData(null);

        const arrayBuffer = await fetchKpiDemoPdf(controlCode);

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error("PDF response is empty.");
        }

        if (!active) return;
        setPdfData(new Uint8Array(arrayBuffer));
      } catch (error) {
        if (!active) return;
        console.error("PDF load error:", error);
        setFileError(error?.message || "Failed to load PDF file.");
      } finally {
        if (active) setLoadingFile(false);
      }
    };

    loadPdf();

    return () => {
      active = false;
    };
  }, [controlCode]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setFileError("");
  };

  const canGoPrev = useMemo(() => pageNumber > 1, [pageNumber]);
  const canGoNext = useMemo(
    () => pageNumber < numPages,
    [pageNumber, numPages],
  );

  if (loadingFile) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-lg border border-border bg-bg text-sm text-muted">
        Loading PDF preview...
      </div>
    );
  }

  if (fileError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">
          Failed to load PDF file.
        </p>
        <p className="mt-2 text-sm text-red-600">{fileError}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-primary">
            Dormant PO Demo PDF
          </p>
          <p className="text-xs text-muted">
            Page {pageNumber} of {numPages || 1}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((prev) => Math.max(0.8, prev - 0.1))}
            className="rounded-lg border border-border bg-white p-2 text-primary"
          >
            <ZoomOut size={16} />
          </button>

          <button
            type="button"
            onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
            className="rounded-lg border border-border bg-white p-2 text-primary"
          >
            <ZoomIn size={16} />
          </button>

          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            className="rounded-lg border border-border bg-white p-2 text-primary disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            disabled={!canGoNext}
            onClick={() =>
              setPageNumber((prev) => Math.min(numPages, prev + 1))
            }
            className="rounded-lg border border-border bg-white p-2 text-primary disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-center overflow-auto bg-bg p-4">
        <Document
          file={{ data: pdfData }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => {
            console.error("PDF render error:", err);
            setFileError(err?.message || "Failed to render PDF file.");
          }}
          loading={
            <div className="py-12 text-sm text-muted">Rendering PDF...</div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
