import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { SessionsChart } from "@/components/dashboard/SessionsChart";
import { PagePerformanceTable } from "@/components/dashboard/PagePerformanceTable";
import { SearchFunnel } from "@/components/dashboard/SearchFunnel";
import { Eye, MousePointerClick, Link2, Target, LucideIcon } from "lucide-react";
import { useDashboardConfig } from "@/contexts/DashboardConfigContext";

const Dashboard = () => {
  const { config, loading } = useDashboardConfig();

  const iconMap: Record<string, LucideIcon> = {
    Eye,
    MousePointerClick,
    Link2,
    Target,
  };

  if (loading) {
    return (
      <DashboardLayout title="SEO Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="SEO Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {config.kpi_cards.impressions.visible && (
          <StatCard
            title={config.kpi_cards.impressions.label}
            value={config.kpi_data.impressions.value}
            change={config.kpi_data.impressions.change}
            changeType={config.kpi_data.impressions.changeType}
            icon={iconMap[config.kpi_cards.impressions.icon] || Eye}
          />
        )}
        {config.kpi_cards.ctr.visible && (
          <StatCard
            title={config.kpi_cards.ctr.label}
            value={config.kpi_data.ctr.value}
            change={config.kpi_data.ctr.change}
            changeType={config.kpi_data.ctr.changeType}
            icon={iconMap[config.kpi_cards.ctr.icon] || MousePointerClick}
          />
        )}
        {config.kpi_cards.backlinks.visible && (
          <StatCard
            title={config.kpi_cards.backlinks.label}
            value={config.kpi_data.backlinks.value}
            change={config.kpi_data.backlinks.change}
            changeType={config.kpi_data.backlinks.changeType}
            icon={iconMap[config.kpi_cards.backlinks.icon] || Link2}
          />
        )}
        {config.kpi_cards.avgPosition.visible && (
          <StatCard
            title={config.kpi_cards.avgPosition.label}
            value={config.kpi_data.avgPosition.value}
            change={config.kpi_data.avgPosition.change}
            changeType={config.kpi_data.avgPosition.changeType}
            icon={iconMap[config.kpi_cards.avgPosition.icon] || Target}
          />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {config.charts.trafficChart.visible && (
          <TrafficChart title={config.charts.trafficChart.label} />
        )}
        {config.charts.sessionsChart.visible && (
          <SessionsChart title={config.charts.sessionsChart.label} />
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {config.charts.pagePerformance.visible && (
          <PagePerformanceTable title={config.charts.pagePerformance.label} />
        )}
        {config.charts.searchFunnel.visible && (
          <SearchFunnel title={config.charts.searchFunnel.label} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
