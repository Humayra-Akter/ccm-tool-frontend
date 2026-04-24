import React from "react";
import { TrendingUp } from "lucide-react";

const Chart = ({
  title,
  subtitle,
  data = [],
  seriesLabel = "Risk score",
  valueSuffix = "",
}) => {
  const width = 760;
  const height = 320;
  const paddingTop = 28;
  const paddingRight = 24;
  const paddingBottom = 42;
  const paddingLeft = 48;

  if (!data.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)] lg:p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-primary">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex h-[320px] items-center justify-center rounded-xl bg-bg text-sm text-muted">
          No trend data available
        </div>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  const niceMax = Math.ceil(maxValue / 10) * 10;
  const niceMin = Math.max(0, Math.floor(minValue / 10) * 10);
  const niceRange = niceMax - niceMin || 1;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index) => {
    if (data.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index * chartWidth) / (data.length - 1);
  };

  const getY = (value) => {
    return (
      paddingTop + chartHeight - ((value - niceMin) / niceRange) * chartHeight
    );
  };

  const linePoints = data
    .map((d, i) => `${getX(i)},${getY(d.value)}`)
    .join(" ");

  const areaPath = [
    `M ${getX(0)} ${height - paddingBottom}`,
    ...data.map((d, i) => `L ${getX(i)} ${getY(d.value)}`),
    `L ${getX(data.length - 1)} ${height - paddingBottom}`,
    "Z",
  ].join(" ");

  const guideCount = 4;
  const guides = Array.from({ length: guideCount + 1 }, (_, i) => {
    const value = niceMin + (niceRange / guideCount) * (guideCount - i);
    const y = paddingTop + (chartHeight / guideCount) * i;
    return { value: Math.round(value), y };
  });

  const latest = data[data.length - 1]?.value ?? 0;
  const previous = data[data.length - 2]?.value ?? latest;
  const delta = latest - previous;
  const deltaLabel =
    delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta}${valueSuffix}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(79,49,94,0.06)] lg:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-primary">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 text-sm">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
            <TrendingUp size={16} />
          </span>
          <div>
            <p className="font-semibold text-text">
              {latest}
              {valueSuffix}
            </p>
            <p className="text-xs text-muted">{deltaLabel} vs previous</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[320px] w-full min-w-[680px]"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id="chartAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-primary)"
                stopOpacity="0.16"
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary)"
                stopOpacity="0.02"
              />
            </linearGradient>

            <linearGradient id="chartLineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary-light)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>

          {guides.map((guide) => (
            <g key={`guide-${guide.value}`}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={guide.y}
                y2={guide.y}
                stroke="var(--color-border)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <text
                x={paddingLeft - 10}
                y={guide.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--color-muted)"
              >
                {guide.value}
              </text>
            </g>
          ))}

          <path d={areaPath} fill="url(#chartAreaFill)" />

          <polyline
            fill="none"
            points={linePoints}
            stroke="url(#chartLineGlow)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((item, index) => {
            const x = getX(index);
            const y = getY(item.value);

            return (
              <g key={`${item.label}-${index}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={height - paddingBottom}
                  y2={y}
                  stroke="var(--color-secondary)"
                  strokeOpacity="0.18"
                  strokeWidth="2"
                />

                <circle
                  cx={x}
                  cy={y}
                  r="5.5"
                  fill="white"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                />

                <text
                  x={x}
                  y={height - 14}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--color-muted)"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Chart;
