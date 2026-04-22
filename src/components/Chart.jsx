import React from "react";

const Chart = ({ title, data = [] }) => {
  const width = 700;
  const height = 280;
  const padding = 36;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = 0;

  const getX = (index) => {
    if (data.length <= 1) return padding;
    return padding + (index * (width - padding * 2)) / (data.length - 1);
  };

  const getY = (value) => {
    const usableHeight = height - padding * 2;
    return (
      padding +
      usableHeight -
      ((value - minValue) / (maxValue - minValue || 1)) * usableHeight
    );
  };

  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");

  const yGuides = 4;
  const guideLines = Array.from({ length: yGuides + 1 }, (_, i) => {
    const y = padding + ((height - padding * 2) / yGuides) * i;
    return y;
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-secondary">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[280px] w-full min-w-[640px]"
          role="img"
          aria-label={title}
        >
          {guideLines.map((y) => (
            <line
              key={y}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              className="stroke-border"
              strokeWidth="1"
            />
          ))}

          <line
            x1={padding}
            x2={padding}
            y1={padding}
            y2={height - padding}
            className="stroke-text"
            strokeWidth="1.5"
          />

          <line
            x1={padding}
            x2={width - padding}
            y1={height - padding}
            y2={height - padding}
            className="stroke-text"
            strokeWidth="1.5"
          />

          {data.map((item, index) => {
            const x = getX(index);
            const y = getY(item.value);

            return (
              <g key={item.label}>
                <line
                  x1={x}
                  x2={x}
                  y1={height - padding}
                  y2={y}
                  className="stroke-warning/50"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-muted text-[11px]"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            points={points}
            className="stroke-primary"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((item, index) => {
            const x = getX(index);
            const y = getY(item.value);

            return (
              <circle
                key={`${item.label}-point`}
                cx={x}
                cy={y}
                r="4"
                className="fill-primary"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Chart;
