import React from "react";
import {
  CheckCircle2,
  Clock3,
  ShieldAlert,
  Info,
  ArrowUpRight,
} from "lucide-react";

const kpiMap = {
  default: {
    card: "border-border bg-gradient-to-br from-white via-primary-soft/30 to-white shadow-sm hover:shadow-md",
    glow: "from-secondary/10 via-primary/10 to-transparent",
    rail: "bg-secondary/60",
    accent: "bg-secondary",
    overline: "text-secondary",
    title: "text-text",
    value: "text-text",
    subtitle: "text-muted",
    badge: "bg-primary-soft text-primary",
    fallbackIcon: ArrowUpRight,
  },
  success: {
    card: "border-border bg-gradient-to-br from-white via-emerald-50/60 to-white shadow-sm hover:shadow-md",
    glow: "from-success/15 via-success/10 to-transparent",
    rail: "bg-success/70",
    accent: "bg-success",
    overline: "text-success",
    title: "text-text",
    value: "text-text",
    subtitle: "text-muted",
    badge: "bg-emerald-50 text-success",
    fallbackIcon: CheckCircle2,
  },
  warning: {
    card: "border-border bg-gradient-to-br from-white via-amber-50/60 to-white shadow-sm hover:shadow-md",
    glow: "from-warning/15 via-warning/10 to-transparent",
    rail: "bg-warning/70",
    accent: "bg-warning",
    overline: "text-warning",
    title: "text-text",
    value: "text-text",
    subtitle: "text-muted",
    badge: "bg-amber-50 text-warning",
    fallbackIcon: Clock3,
  },
  error: {
    card: "border-border bg-gradient-to-br from-white via-red-50/60 to-white shadow-sm hover:shadow-md",
    glow: "from-error/15 via-error/10 to-transparent",
    rail: "bg-error/70",
    accent: "bg-error",
    overline: "text-error",
    title: "text-text",
    value: "text-text",
    subtitle: "text-muted",
    badge: "bg-red-50 text-error",
    fallbackIcon: ShieldAlert,
  },
  processing: {
    card: "border-border bg-gradient-to-br from-white via-amber-50/60 to-white shadow-sm hover:shadow-md",
    glow: "from-warning/15 via-warning/10 to-transparent",
    rail: "bg-warning/70",
    accent: "bg-warning",
    overline: "text-warning",
    title: "text-text",
    value: "text-text",
    subtitle: "text-muted",
    badge: "bg-amber-50 text-warning",
    fallbackIcon: Clock3,
  },
  info: {
    card: "border-border bg-gradient-to-br from-white via-sky-50/40 to-white shadow-sm hover:shadow-md",
    glow: "from-secondary/10 via-secondary/5 to-transparent",
    rail: "bg-secondary/70",
    accent: "bg-secondary",
    overline: "text-secondary",
    title: "text-text",
    value: "text-text",
    subtitle: "text-muted",
    badge: "bg-primary-soft text-primary",
    fallbackIcon: Info,
  },
};

const KPICard = ({
  title,
  value,
  subtitle,
  icon: IconProp,
  status = "default",
  meta,
  trend,
  className = "",
}) => {
  const tone = kpiMap[status] || kpiMap.default;
  const Icon = IconProp || tone.fallbackIcon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${tone.card} ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 ${tone.rail}`}
      />

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl ${tone.glow}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={`truncate text-[11px] font-bold uppercase tracking-[0.14em] ${tone.overline}`}
            >
              {title}
            </p>

            {trend ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-bg px-2 py-0.5 text-[10px] font-semibold text-muted">
                {trend}
              </span>
            ) : null}
          </div>

          <h3
            className={`mt-3 truncate text-3xl font-bold leading-none ${tone.value}`}
          >
            {value}
          </h3>

          {subtitle ? (
            <p className={`mt-2 text-sm ${tone.subtitle}`}>{subtitle}</p>
          ) : null}

          {meta ? (
            <div className="mt-3 inline-flex max-w-full items-center rounded-full bg-bg px-2.5 py-1 text-[11px] font-medium text-muted">
              <span className="truncate">{meta}</span>
            </div>
          ) : null}
        </div>

        <div
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone.badge}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
