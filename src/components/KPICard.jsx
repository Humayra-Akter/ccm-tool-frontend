import React from "react";

const toneMap = {
  success: {
    card: "bg-emerald-50 border-emerald-100",
    title: "text-emerald-900",
    value: "text-emerald-700",
    sub: "text-emerald-600",
    bar: "bg-success",
    iconWrap: "bg-white/70 text-success",
  },
  danger: {
    card: "bg-red-50 border-red-100",
    title: "text-red-900",
    value: "text-red-700",
    sub: "text-red-600",
    bar: "bg-error",
    iconWrap: "bg-white/70 text-error",
  },
  warning: {
    card: "bg-amber-50 border-amber-100",
    title: "text-amber-900",
    value: "text-amber-700",
    sub: "text-amber-600",
    bar: "bg-warning",
    iconWrap: "bg-white/70 text-warning",
  },
  neutral: {
    card: "bg-slate-50 border-slate-200",
    title: "text-text",
    value: "text-text",
    sub: "text-muted",
    bar: "bg-secondary",
    iconWrap: "bg-white text-secondary",
  },
};

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "neutral",
  footer,
}) => {
  const styles = toneMap[tone] || toneMap.neutral;

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${styles.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${styles.title}`}>{title}</p>
          <h3
            className={`mt-2 text-3xl font-bold leading-none ${styles.value}`}
          >
            {value}
          </h3>
          {subtitle ? (
            <p className={`mt-2 text-sm ${styles.sub}`}>{subtitle}</p>
          ) : null}
        </div>

        {Icon ? (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconWrap}`}
          >
            <Icon size={22} />
          </div>
        ) : null}
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/70">
        <div className={`h-full w-3/4 rounded-full ${styles.bar}`} />
      </div>

      {footer ? <div className="mt-3 text-xs text-muted">{footer}</div> : null}
    </div>
  );
};

export default KPICard;
