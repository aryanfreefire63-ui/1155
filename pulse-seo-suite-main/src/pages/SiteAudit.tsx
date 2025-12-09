import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, AlertTriangle, Info, CheckCircle, ExternalLink } from "lucide-react";

const issues = [
  { type: "Missing title tags", urls: 12, severity: "High" },
  { type: "Duplicate H1 tags", urls: 8, severity: "Medium" },
  { type: "Broken internal links (404)", urls: 5, severity: "High" },
  { type: "Missing alt attributes", urls: 23, severity: "Low" },
  { type: "Slow loading pages", urls: 7, severity: "Medium" },
  { type: "Missing meta descriptions", urls: 15, severity: "Medium" },
];

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "High":
      return <Badge className="bg-destructive text-destructive-foreground">High</Badge>;
    case "Medium":
      return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    case "Low":
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="secondary">{severity}</Badge>;
  }
};

const SiteAudit = () => {
  const healthScore = 78;

  return (
    <DashboardLayout title="Site Audit">
      {/* Health Score */}
      <div className="bg-card rounded-xl p-8 card-shadow border border-border mb-6 animate-fade-in">
        <div className="flex items-center gap-8">
          {/* Circular Progress */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="hsl(var(--border))"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={healthScore >= 80 ? "hsl(var(--success))" : healthScore >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(healthScore / 100) * 352} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{healthScore}</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-2">Site Health Score</h3>
            <p className="text-muted-foreground">
              Your website has a good health score. Fix the high-priority issues to improve it further.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-5 card-shadow border border-border flex items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-destructive">17</p>
            <p className="text-sm text-muted-foreground">Errors</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border flex items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">30</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border flex items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">23</p>
            <p className="text-sm text-muted-foreground">Notices</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border flex items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-success">145</p>
            <p className="text-sm text-muted-foreground">Passed</p>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-card rounded-xl card-shadow border border-border animate-fade-in">
        <Tabs defaultValue="by-type">
          <div className="border-b border-border px-5 pt-4">
            <TabsList className="bg-transparent border-0 p-0 gap-6">
              <TabsTrigger
                value="by-type"
                className="border-0 bg-transparent px-0 pb-3 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Issues by Type
              </TabsTrigger>
              <TabsTrigger
                value="by-page"
                className="border-0 bg-transparent px-0 pb-3 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Issues by Page
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="by-type" className="mt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground font-medium">Issue Type</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Affected URLs</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Severity</TableHead>
                  <TableHead className="text-muted-foreground font-medium w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.type} className="border-border">
                    <TableCell className="font-medium text-foreground">{issue.type}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{issue.urls}</TableCell>
                    <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-2 text-primary">
                        <ExternalLink className="w-4 h-4" />
                        View URLs
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="by-page" className="p-5">
            <p className="text-muted-foreground">Issues grouped by page will appear here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SiteAudit;
