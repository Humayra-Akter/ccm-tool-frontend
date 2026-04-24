import React from "react";

const Table = ({
  title,
  subtitle,
  columns = [],
  data = [],
  compact = false,
  rowKey = "id",
  emptyMessage = "No records available",
  className = "",
}) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(79,49,94,0.06)] lg:p-5 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title ? (
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-primary">
              {title}
            </h3>
          ) : null}
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`bg-bg px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted border-b border-border ${
                    index === 0 ? "rounded-tl-2xl" : ""
                  } ${index === columns.length - 1 ? "rounded-tr-2xl" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {hasData ? (
              data.map((row, index) => (
                <tr
                  key={row[rowKey] ?? index}
                  className="transition hover:bg-primary-soft/25"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`border-b border-border px-4 py-3.5 text-sm text-text ${
                        compact ? "whitespace-nowrap" : ""
                      }`}
                    >
                      {col.render
                        ? col.render(row[col.key], row, index)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="rounded-b-2xl px-4 py-10 text-center text-sm text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
