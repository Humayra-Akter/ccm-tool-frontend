import RiskBar from "./RiskBar";
import RecentActivity from "./RecentActivity";

export default function BottomSection() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <RiskBar />
      <RecentActivity />
    </div>
  );
}
