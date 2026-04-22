export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white h-screen p-4">
      <h1 className="text-xl font-bold text-[--color-primary] mb-6">
        CCM Portal
      </h1>

      <nav className="space-y-2">
        <div className="p-2 hover:bg-[--color-primary] rounded cursor-pointer">
          Dashboard
        </div>
        <div className="p-2 hover:bg-[--color-primary] rounded cursor-pointer">
          KPI
        </div>
        <div className="p-2 hover:bg-[--color-primary] rounded cursor-pointer">
          Upload
        </div>
      </nav>
    </div>
  );
}
