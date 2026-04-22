import React from "react";
import { ChevronDown, FileText, Download, X } from "lucide-react";

const FilterSelect = ({ label, value }) => {
  return (
    <button
      type="button"
      className="flex h-9 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-sm text-text shadow-sm transition hover:border-primary"
    >
      <span>{value || label}</span>
      <ChevronDown size={18} className="text-muted" />
    </button>
  );
};

const Filter = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr_1fr_auto_auto_auto]">
        <FilterSelect label="Period" value="Period" />
        <FilterSelect label="Entity" value="Entity" />
        <FilterSelect label="Process" value="Process" />

        <button
          type="button"
          className="flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-bg px-4 text-sm font-medium text-muted transition hover:text-text"
        >
          <X size={16} />
          Clear
        </button>

        <button
          type="button"
          className="flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-primary/80 px-4 text-sm font-semibold text-white transition hover:bg-primary"
        >
          <FileText size={16} />
          Generate Report
        </button>

        <button
          type="button"
          className="flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Download size={16} />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default Filter;
