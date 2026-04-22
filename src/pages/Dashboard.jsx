import KPICard from "../components/KPICard";
import { ShieldCheck, AlertTriangle, DollarSign, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-4 gap-5">
      <KPICard
        title="Overall Compliance Score"
        value={62}
        progress={62}
        subtitle="Across all controls"
        variant="neutral"
      />

      <KPICard
        title="Exceptions"
        value={18}
        progress={18}
        subtitle="Flagged transactions"
        variant="error"
      />

      <KPICard
        title="Financial Impact"
        value={2.3}
        suffix="M AED"
        progress={40}
        subtitle="Potential savings"
        variant="warning"
      />

      <KPICard
        title="Controls Executed"
        value={82}
        progress={82}
        subtitle="Successful checks"
        variant="success"
      />
    </div>
  );
};

export default Dashboard;
