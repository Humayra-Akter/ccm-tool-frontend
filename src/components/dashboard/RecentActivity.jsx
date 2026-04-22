export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h3 className="mb-4 font-semibold">Recent Activity</h3>

      <ul className="space-y-2 text-sm text-gray-600">
        <li>✔ File uploaded (Early Payments)</li>
        <li>✔ KPI processed</li>
        <li>⚠ Duplicate detected</li>
      </ul>
    </div>
  );
}
