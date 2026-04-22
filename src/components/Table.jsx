import React from "react";

const Table = ({ title, columns = [], data = [], compact = false }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      {title ? (
        <h3 className="mb-4 text-xl font-semibold text-primary">{title}</h3>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="border-b border-border bg-bg px-4 py-3 text-left text-sm font-semibold text-muted"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-primary-soft/40">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border-b border-border px-4 py-3 text-sm text-text ${
                      compact ? "whitespace-nowrap" : ""
                    }`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
