import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 10 },
  { month: "Mar", value: 30 },
];

export default function TrendChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h3 className="font-semibold mb-4">Risk Trend</h3>

      <LineChart width={800} height={250} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#c45508"
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
}
