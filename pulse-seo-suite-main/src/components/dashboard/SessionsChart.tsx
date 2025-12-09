import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "01", sessions: 45000 },
  { name: "02", sessions: 52000 },
  { name: "03", sessions: 48000 },
  { name: "04", sessions: 61000 },
  { name: "05", sessions: 55000 },
  { name: "06", sessions: 67000 },
  { name: "07", sessions: 72000 },
  { name: "08", sessions: 68000 },
  { name: "09", sessions: 75000 },
  { name: "10", sessions: 82000 },
];

interface SessionsChartProps {
  title?: string;
}

export function SessionsChart({ title = "Sessions" }: SessionsChartProps) {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground">Last 30 days</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="hsl(var(--chart-orange))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-orange))", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
