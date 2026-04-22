import AppLayout from "../layouts/AppLayout";
import SummaryGrid from "../components/dashboard/SummaryGrid";
import TrendChart from "../components/dashboard/TrendChart";
import BottomSection from "../components/dashboard/BottomSection";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <SummaryGrid />

        <TrendChart />

        <BottomSection />
      </div>
    </AppLayout>
  );
}
