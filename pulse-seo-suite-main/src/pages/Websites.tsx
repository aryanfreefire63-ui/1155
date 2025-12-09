import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Settings } from "lucide-react";

const websites = [
  {
    id: 1,
    name: "example.com",
    favicon: "E",
    status: "Active",
    healthScore: 92,
    keywords: 1245,
    traffic: "45.2K",
    integrations: ["GSC", "GA"],
  },
  {
    id: 2,
    name: "myshop.io",
    favicon: "M",
    status: "Active",
    healthScore: 78,
    keywords: 892,
    traffic: "28.1K",
    integrations: ["GSC"],
  },
  {
    id: 3,
    name: "blog.example.com",
    favicon: "B",
    status: "Paused",
    healthScore: 65,
    keywords: 456,
    traffic: "12.4K",
    integrations: ["GSC", "GA"],
  },
];

const Websites = () => {
  return (
    <DashboardLayout title="Websites">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">Manage your websites and projects</p>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Website
        </Button>
      </div>

      <div className="grid gap-4">
        {websites.map((site) => (
          <div
            key={site.id}
            className="bg-card rounded-xl p-5 card-shadow border border-border flex items-center gap-6 animate-fade-in"
          >
            {/* Favicon */}
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{site.favicon}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-foreground">{site.name}</h3>
                <Badge
                  variant={site.status === "Active" ? "default" : "secondary"}
                  className={site.status === "Active" ? "bg-success text-success-foreground" : ""}
                >
                  {site.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Keywords: {site.keywords}</span>
                <span>Traffic: {site.traffic}</span>
              </div>
            </div>

            {/* Health Score */}
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  site.healthScore >= 80
                    ? "text-success"
                    : site.healthScore >= 60
                    ? "text-warning"
                    : "text-destructive"
                }`}
              >
                {site.healthScore}
              </div>
              <p className="text-xs text-muted-foreground">Health Score</p>
            </div>

            {/* Integrations */}
            <div className="flex gap-2">
              {site.integrations.map((int) => (
                <div
                  key={int}
                  className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground"
                >
                  {int}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Websites;
