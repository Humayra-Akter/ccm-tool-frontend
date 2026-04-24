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
    card: "border-border bg-gradient-to-br from-white via-primary-soft/55 to-white shadow-sm hover:shadow-md",
    glow: "from-primary/18 via-secondary/10 to-transparent",
    rail: "bg-primary/80",
    accent: "bg-primary",
    overline: "text-primary",
    title: "text-text",
    value: "text-primary-soft",
    subtitle: "text-muted text-xs",
    badge: "bg-primary-soft text-primary",
    meta: "bg-white/80 text-muted border border-border/70",
    trend: "bg-white/85 text-primary border border-border/70",
    fallbackIcon: ArrowUpRight,
  },
  success: {
    card: "border-border bg-gradient-to-br from-white via-emerald-50/75 to-white shadow-sm hover:shadow-md",
    glow: "from-success/18 via-success/10 to-transparent",
    rail: "bg-success/80",
    accent: "bg-success",
    overline: "text-success",
    title: "text-text",
    value: "text-emerald-800",
    subtitle: "text-muted text-xs",
    badge: "bg-emerald-50 text-success",
    meta: "bg-white/80 text-muted border border-emerald-100",
    trend: "bg-emerald-50 text-success border border-emerald-100",
    fallbackIcon: CheckCircle2,
  },
  warning: {
    card: "border-border bg-gradient-to-br from-white via-amber-50/80 to-white shadow-sm hover:shadow-md",
    glow: "from-warning/20 via-warning/10 to-transparent",
    rail: "bg-warning/80",
    accent: "bg-warning",
    overline: "text-warning",
    title: "text-text",
    value: "text-amber-800",
    subtitle: "text-muted text-xs",
    badge: "bg-amber-50 text-warning",
    meta: "bg-white/80 text-muted border border-amber-100",
    trend: "bg-amber-50 text-warning border border-amber-100",
    fallbackIcon: Clock3,
  },
  error: {
    card: "border-border bg-gradient-to-br from-white via-red-50/80 to-white shadow-sm hover:shadow-md",
    glow: "from-error/18 via-error/10 to-transparent",
    rail: "bg-error/80",
    accent: "bg-error",
    overline: "text-error",
    title: "text-text",
    value: "text-red-800",
    subtitle: "text-muted text-xs",
    badge: "bg-red-50 text-error",
    meta: "bg-white/80 text-muted border border-red-100",
    trend: "bg-red-50 text-error border border-red-100",
    fallbackIcon: ShieldAlert,
  },
  processing: {
    card: "border-border bg-gradient-to-br from-white via-amber-50/80 to-white shadow-sm hover:shadow-md",
    glow: "from-warning/20 via-warning/10 to-transparent",
    rail: "bg-warning/80",
    accent: "bg-warning",
    overline: "text-warning",
    title: "text-text",
    value: "text-amber-800",
    subtitle: "text-muted text-xs",
    badge: "bg-amber-50 text-warning",
    meta: "bg-white/80 text-muted border border-amber-100",
    trend: "bg-amber-50 text-warning border border-amber-100",
    fallbackIcon: Clock3,
  },
  info: {
    card: "border-border bg-gradient-to-br from-white via-primary-soft/45 to-white shadow-sm hover:shadow-md",
    glow: "from-secondary/16 via-primary/8 to-transparent",
    rail: "bg-secondary/85",
    accent: "bg-secondary",
    overline: "text-secondary",
    title: "text-text",
    value: "text-primary",
    subtitle: "text-muted text-xs",
    badge: "bg-orange-50 text-secondary",
    meta: "bg-white/80 text-muted border border-orange-100",
    trend: "bg-orange-50 text-secondary border border-orange-100",
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
      className={`group relative overflow-hidden rounded-lg border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${tone.card} ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 ${tone.rail}`}
      />

      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl ${tone.glow}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`max-w-full text-[11px] font-bold uppercase tracking-[0.14em] ${tone.overline}`}
            >
              {title}
            </p>

            {trend ? (
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone.trend}`}
              >
                {trend}
              </span>
            ) : null}
          </div>

          <h3
            className={`mt-3 text-2xl font-bold leading-none tracking-[-0.02em] ${tone.value}`}
          >
            {value}
          </h3>

          {subtitle ? (
            <p className={`mt-2 text-sm leading-6 ${tone.subtitle}`}>
              {subtitle}
            </p>
          ) : null}

          {meta ? (
            <div
              className={`mt-3 inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${tone.meta}`}
            >
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
