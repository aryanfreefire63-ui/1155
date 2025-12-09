import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "01", organic: 65000, direct: 35000 },
  { name: "02", organic: 59000, direct: 32000 },
  { name: "03", organic: 80000, direct: 45000 },
  { name: "04", organic: 81000, direct: 48000 },
  { name: "05", organic: 56000, direct: 30000 },
  { name: "06", organic: 55000, direct: 28000 },
  { name: "07", organic: 72000, direct: 40000 },
  { name: "08", organic: 68000, direct: 38000 },
  { name: "09", organic: 85000, direct: 50000 },
  { name: "10", organic: 78000, direct: 42000 },
];

interface TrafficChartProps {
  title?: string;
}

export function TrafficChart({ title = "Organic search traffic" }: TrafficChartProps) {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-blue" />
            <span className="text-sm text-muted-foreground">Organic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-blue-light" />
            <span className="text-sm text-muted-foreground">Direct</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
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
            <Bar dataKey="organic" fill="hsl(var(--chart-blue))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="direct" fill="hsl(var(--chart-blue-light))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
