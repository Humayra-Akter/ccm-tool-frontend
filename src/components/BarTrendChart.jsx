import React from "react";
import { BarChart3 } from "lucide-react";

const BarTrendChart = ({
  title,
  subtitle,
  data = [],
  valueKey = "value",
  labelKey = "label",
}) => {
  const maxValue = Math.max(...data.map((d) => Number(d[valueKey] || 0)), 1);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)] lg:p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-primary">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>

        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft/20 text-primary">
          <BarChart3 size={18} />
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percent = (Number(item[valueKey] || 0) / maxValue) * 100;

          return (
            <div key={item[labelKey]} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-text">
                  {item[labelKey]}
                </p>
                <span className="text-sm font-semibold text-primary">
                  {item[valueKey]}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-primary-soft/20">
                <div
                  className="h-full rounded-full bg-secondary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarTrendChart;
