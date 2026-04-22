import KPICard from "./KPICard";

const kpis = [
  "Early Payments",
  "Duplicate Payments",
  "Dormant PO",
  "Two Way Match",
  "Undelivered POs",
  "Aged Advances",
  "Invoice Split",
];

export default function SummaryGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi} title={kpi} />
      ))}
    </div>
  );
}
