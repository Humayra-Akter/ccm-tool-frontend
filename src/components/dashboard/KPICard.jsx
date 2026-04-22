export default function KPICard({ title }) {
  return (
    <div className="bg-[--color-card] rounded-xl p-4 shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="text-2xl font-bold text-[--color-primary] mt-2">12%</h2>

      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>Exceptions</span>
        <span className="text-red-500">+2%</span>
      </div>
    </div>
  );
}
