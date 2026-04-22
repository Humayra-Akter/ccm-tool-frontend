import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const KPICard = ({
  title,
  value,
  suffix = "%",
  subtitle,
  progress = 0,
  icon: Icon,
  trend,
  variant = "neutral", // success | error | warning | neutral
}) => {
  const styles = {
    success: {
      value: "text-success",
      iconBg: "bg-green-100",
      iconColor: "text-success",
      bar: "bg-success",
    },
    error: {
      value: "text-error",
      iconBg: "bg-red-100",
      iconColor: "text-error",
      bar: "bg-error",
    },
    warning: {
      value: "text-primary",
      iconBg: "bg-orange-100",
      iconColor: "text-primary",
      bar: "bg-primary",
    },
    neutral: {
      value: "text-primary",
      iconBg: "bg-gray-100",
      iconColor: "text-primary",
      bar: "bg-primary",
    },
  };

  const s = styles[variant];

  return (
    <div className="bg-card rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">{title}</h3>

        {Icon && (
          <div className={`p-2 rounded-lg ${s.iconBg}`}>
            <Icon size={18} className={s.iconColor} />
          </div>
        )}
      </div>

      {/* VALUE */}
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${s.value}`}>{value}</span>
          <span className="text-sm text-muted">{suffix}</span>
        </div>

        {/* TREND */}
        {trend && (
          <div className="flex items-center gap-1 text-sm font-medium">
            {trend.direction === "up" ? (
              <TrendingUp size={16} className="text-success" />
            ) : (
              <TrendingDown size={16} className="text-error" />
            )}

            <span
              className={
                trend.direction === "up" ? "text-success" : "text-error"
              }
            >
              {trend.value}
            </span>
          </div>
        )}
      </div>

      {/* SUBTITLE */}
      <p className="text-sm text-muted">{subtitle}</p>

      {/* PROGRESS */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${s.bar} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default KPICard;
