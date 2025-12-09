import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const calendarDays = [
  { day: 1, content: null },
  { day: 2, content: null },
  { day: 3, content: { title: "SEO Best Practices", keyword: "seo tips", status: "Published" } },
  { day: 4, content: null },
  { day: 5, content: { title: "Keyword Research Guide", keyword: "keyword research", status: "In Progress" } },
  { day: 6, content: null },
  { day: 7, content: null },
  { day: 8, content: null },
  { day: 9, content: { title: "Link Building 101", keyword: "backlinks", status: "Idea" } },
  { day: 10, content: null },
  { day: 11, content: null },
  { day: 12, content: { title: "Technical SEO Checklist", keyword: "site audit", status: "In Progress" } },
  { day: 13, content: null },
  { day: 14, content: null },
  { day: 15, content: null },
  { day: 16, content: { title: "Content Optimization", keyword: "on-page seo", status: "Idea" } },
  { day: 17, content: null },
  { day: 18, content: null },
  { day: 19, content: null },
  { day: 20, content: { title: "Local SEO Guide", keyword: "local seo", status: "Published" } },
  { day: 21, content: null },
  { day: 22, content: null },
  { day: 23, content: null },
  { day: 24, content: null },
  { day: 25, content: { title: "SEO for E-commerce", keyword: "ecommerce seo", status: "In Progress" } },
  { day: 26, content: null },
  { day: 27, content: null },
  { day: 28, content: null },
  { day: 29, content: null },
  { day: 30, content: null },
  { day: 31, content: null },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Published":
      return "bg-success text-success-foreground";
    case "In Progress":
      return "bg-primary text-primary-foreground";
    case "Idea":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const ContentPlanner = () => {
  // Create a grid with proper day positioning (assuming Dec 2025 starts on Monday)
  const firstDayOffset = 1; // Monday = 1
  const daysWithOffset = [
    ...Array(firstDayOffset).fill(null),
    ...calendarDays,
  ];

  return (
    <DashboardLayout title="Content Planner">
      {/* Calendar Header */}
      <div className="bg-card rounded-xl p-5 card-shadow border border-border mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground">December 2025</h2>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Content Idea
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl card-shadow border border-border overflow-hidden animate-fade-in">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground bg-secondary/30"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {daysWithOffset.map((item, index) => (
            <div
              key={index}
              className="min-h-28 border-b border-r border-border p-2 hover:bg-accent/50 transition-colors"
            >
              {item && (
                <>
                  <span className="text-sm text-muted-foreground">{item.day}</span>
                  {item.content && (
                    <div className="mt-1 p-2 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-xs font-medium text-foreground truncate">
                        {item.content.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {item.content.keyword}
                      </p>
                      <Badge
                        className={`mt-1 text-[10px] ${getStatusColor(item.content.status)}`}
                      >
                        {item.content.status}
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentPlanner;
