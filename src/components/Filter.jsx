import React from "react";
import { ChevronDown, X } from "lucide-react";

const FilterSelect = ({ label, value, options = [], onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-border bg-white px-4 pr-10 text-sm text-text shadow-sm outline-none transition hover:border-primary focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
};

const ActionButton = ({
  label,
  icon: Icon,
  onClick,
  variant = "secondary",
}) => {
  const styles = {
    ghost:
      "border border-border bg-bg text-muted hover:text-text hover:bg-primary-soft/35",
    secondary: "border border-border bg-primary/85 text-white hover:bg-primary",
    primary: "bg-secondary text-white hover:opacity-95",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition ${styles[variant]}`}
    >
      {Icon ? <Icon size={16} /> : null}
      {label}
    </button>
  );
};

const Filter = ({
  title,
  subtitle,
  filters = [],
  actions = [],
  onClear,
  className = "",
}) => {
  return (
    <div
      className={`rounded-3xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(79,49,94,0.06)] ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title ? (
            <h3 className="text-base font-semibold text-primary">{title}</h3>
          ) : null}
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
      )}

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filters.map((filter) => (
            <FilterSelect
              key={filter.key}
              label={filter.label}
              value={filter.value}
              options={filter.options}
              onChange={filter.onChange}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-bg px-4 text-sm font-medium text-muted shadow-sm transition hover:bg-primary-soft/35 hover:text-text"
          >
            <X size={16} />
            Clear
          </button>

          {actions.map((action) => (
            <ActionButton
              key={action.key}
              label={action.label}
              icon={action.icon}
              onClick={action.onClick}
              variant={action.variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
