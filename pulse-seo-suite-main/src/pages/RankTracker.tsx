import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown, Monitor, Smartphone, Plus } from "lucide-react";

const positionData = [
  { name: "Week 1", position: 15 },
  { name: "Week 2", position: 12 },
  { name: "Week 3", position: 10 },
  { name: "Week 4", position: 8 },
];

const rankings = [
  { keyword: "seo tools", url: "/tools", position: 3, change: 2, device: "desktop", location: "US" },
  { keyword: "keyword research", url: "/research", position: 5, change: -1, device: "mobile", location: "US" },
  { keyword: "seo analysis", url: "/analysis", position: 8, change: 3, device: "desktop", location: "UK" },
  { keyword: "backlink checker", url: "/backlinks", position: 12, change: 0, device: "desktop", location: "US" },
  { keyword: "rank tracker", url: "/rank-tracker", position: 15, change: -2, device: "mobile", location: "IN" },
  { keyword: "site audit tool", url: "/audit", position: 18, change: 5, device: "desktop", location: "US" },
];

const filters = ["All", "Top 3", "Top 10", "Improved", "Dropped"];

const RankTracker = () => {
  return (
    <DashboardLayout title="Rank Tracker">
      {/* Position Chart */}
      <div className="bg-card rounded-xl p-5 card-shadow border border-border mb-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Average Position Trend</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Keywords
          </Button>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={positionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                reversed
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                domain={[1, 20]}
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
                dataKey="position"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={filter === "All" ? "default" : "outline"}
            size="sm"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="bg-card rounded-xl card-shadow border border-border animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="w-12"></TableHead>
              <TableHead className="text-muted-foreground font-medium">Keyword</TableHead>
              <TableHead className="text-muted-foreground font-medium">URL</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Position</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Change</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Device</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((rank) => (
              <TableRow key={rank.keyword} className="border-border">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium text-foreground">{rank.keyword}</TableCell>
                <TableCell className="text-muted-foreground">{rank.url}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-semibold">
                    #{rank.position}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {rank.change > 0 ? (
                      <>
                        <ArrowUp className="w-4 h-4 text-success" />
                        <span className="text-success font-medium">{rank.change}</span>
                      </>
                    ) : rank.change < 0 ? (
                      <>
                        <ArrowDown className="w-4 h-4 text-destructive" />
                        <span className="text-destructive font-medium">{Math.abs(rank.change)}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {rank.device === "desktop" ? (
                    <Monitor className="w-4 h-4 text-muted-foreground inline" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-muted-foreground inline" />
                  )}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">{rank.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default RankTracker;
