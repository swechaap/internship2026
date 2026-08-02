import "../styles/graph.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

function TemperatureGraph({
  graphData,
  substance,
}) {
  const meltingPoint = substance?.meltingPoint ?? 0;

  const boilingPoint = substance?.boilingPoint ?? 100;

  const startTemp = substance?.startTemp ?? -20;

  return (
    <div className="graph">
      <h2>📈 {substance?.name} Temperature vs Time</h2>
      <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={graphData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid stroke="#31415f" strokeDasharray="5 5" />
            <XAxis
              dataKey="time"
              label={{
                value: "Time (s)",
                position: "insideBottom",
                offset: -5,
                fill: "#ffffff",
              }}
              stroke="#b8c6e6"
              tick={{ fill: "#b8c6e6" }}
            />
            <YAxis
              domain={[startTemp - 10, boilingPoint + 20]}
              stroke="#b8c6e6"
              tick={{ fill: "#b8c6e6" }}
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
                fill: "#ffffff",
              }}
            />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #4F8DFF",
                borderRadius: "10px",
              }}
            />
            <Legend />
            <ReferenceLine
              y={meltingPoint}
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="6 6"
              label="Melting Point"
            />
            <ReferenceLine
              y={boilingPoint}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="6 6"
              label="Boiling Point"
            />
            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="#4F8DFF"
              strokeWidth={4}
              dot={false}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TemperatureGraph;