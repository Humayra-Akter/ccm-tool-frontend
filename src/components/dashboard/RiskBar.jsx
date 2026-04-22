import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Corporate", value: 30 },
  { name: "Development", value: 20 },
];

export default function RiskBar() {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h3 className="mb-4 font-semibold">Entity Risk</h3>

      <BarChart width={400} height={250} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#c45508" />
      </BarChart>
    </div>
  );
}
