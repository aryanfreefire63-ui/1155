import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Link2, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";

const backlinks = [
  {
    source: "techblog.com/seo-tools-review",
    anchor: "best seo tools",
    target: "/tools",
    status: "Active",
    dr: 72,
    firstSeen: "Dec 1, 2025",
    lastSeen: "Dec 5, 2025",
  },
  {
    source: "marketing.io/resources/guide",
    anchor: "keyword research",
    target: "/research",
    status: "Active",
    dr: 65,
    firstSeen: "Nov 28, 2025",
    lastSeen: "Dec 5, 2025",
  },
  {
    source: "seoweekly.net/roundup",
    anchor: "SEO Manager",
    target: "/",
    status: "Lost",
    dr: 58,
    firstSeen: "Oct 15, 2025",
    lastSeen: "Nov 20, 2025",
  },
  {
    source: "digitalmarketer.com/tools",
    anchor: "rank tracking",
    target: "/rank-tracker",
    status: "Active",
    dr: 78,
    firstSeen: "Nov 10, 2025",
    lastSeen: "Dec 5, 2025",
  },
  {
    source: "startuplist.io/seo",
    anchor: "site audit",
    target: "/audit",
    status: "Active",
    dr: 45,
    firstSeen: "Dec 2, 2025",
    lastSeen: "Dec 5, 2025",
  },
];

const Backlinks = () => {
  return (
    <DashboardLayout title="Backlinks">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3,670</p>
              <p className="text-sm text-muted-foreground">Total Backlinks</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">892</p>
              <p className="text-sm text-muted-foreground">Referring Domains</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">+124</p>
              <p className="text-sm text-muted-foreground">New This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">-18</p>
              <p className="text-sm text-muted-foreground">Lost This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Link Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Links</SelectItem>
            <SelectItem value="dofollow">Dofollow</SelectItem>
            <SelectItem value="nofollow">Nofollow</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Backlinks Table */}
      <div className="bg-card rounded-xl card-shadow border border-border animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground font-medium">Source URL</TableHead>
              <TableHead className="text-muted-foreground font-medium">Anchor Text</TableHead>
              <TableHead className="text-muted-foreground font-medium">Target URL</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">DR</TableHead>
              <TableHead className="text-muted-foreground font-medium">First Seen</TableHead>
              <TableHead className="text-muted-foreground font-medium">Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backlinks.map((link, index) => (
              <TableRow key={index} className="border-border">
                <TableCell>
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium max-w-xs truncate block"
                  >
                    {link.source}
                  </a>
                </TableCell>
                <TableCell className="text-muted-foreground">{link.anchor}</TableCell>
                <TableCell className="text-muted-foreground">{link.target}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={link.status === "Active" ? "default" : "destructive"}
                    className={link.status === "Active" ? "bg-success" : ""}
                  >
                    {link.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-semibold ${
                      link.dr >= 70
                        ? "text-success"
                        : link.dr >= 50
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.dr}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{link.firstSeen}</TableCell>
                <TableCell className="text-muted-foreground">{link.lastSeen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Backlinks;
