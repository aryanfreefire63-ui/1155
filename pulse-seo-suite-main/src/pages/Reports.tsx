import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Download, Calendar, Mail } from "lucide-react";

const reportTemplates = [
  { name: "Monthly SEO Report", description: "Complete overview of SEO performance" },
  { name: "Keyword Ranking Report", description: "Track keyword position changes" },
  { name: "Technical Audit Report", description: "Site health and technical issues" },
  { name: "Backlink Analysis Report", description: "New and lost backlinks summary" },
];

const pastReports = [
  { name: "Monthly SEO Report", date: "Dec 1, 2025", website: "example.com", status: "Completed" },
  { name: "Keyword Ranking Report", date: "Nov 28, 2025", website: "example.com", status: "Completed" },
  { name: "Technical Audit Report", date: "Nov 25, 2025", website: "myshop.io", status: "Completed" },
  { name: "Monthly SEO Report", date: "Nov 1, 2025", website: "example.com", status: "Completed" },
];

const Reports = () => {
  return (
    <DashboardLayout title="Reports">
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Report Templates */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">Report Templates</h3>
          <div className="space-y-3">
            {reportTemplates.map((template) => (
              <div
                key={template.name}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{template.name}</p>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
                <Button size="sm">Generate</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Panel */}
        <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">Schedule Reports</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Website</label>
              <Select defaultValue="example">
                <SelectTrigger>
                  <SelectValue placeholder="Select website" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="example">example.com</SelectItem>
                  <SelectItem value="myshop">myshop.io</SelectItem>
                  <SelectItem value="blog">blog.example.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Report Type</label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly SEO Report</SelectItem>
                  <SelectItem value="keyword">Keyword Ranking Report</SelectItem>
                  <SelectItem value="audit">Technical Audit Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Frequency</label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Email Recipients</label>
              <Input type="email" placeholder="email@example.com" />
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Attach PDF</span>
              </div>
              <Switch />
            </div>
            <Button className="w-full gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Report
            </Button>
          </div>
        </div>
      </div>

      {/* Past Reports */}
      <div className="bg-card rounded-xl card-shadow border border-border animate-fade-in">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Generated Reports</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground font-medium">Report Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Date</TableHead>
              <TableHead className="text-muted-foreground font-medium">Website</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastReports.map((report, index) => (
              <TableRow key={index} className="border-border">
                <TableCell className="font-medium text-foreground">{report.name}</TableCell>
                <TableCell className="text-muted-foreground">{report.date}</TableCell>
                <TableCell className="text-muted-foreground">{report.website}</TableCell>
                <TableCell>
                  <Badge className="bg-success text-success-foreground">{report.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-primary">
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
