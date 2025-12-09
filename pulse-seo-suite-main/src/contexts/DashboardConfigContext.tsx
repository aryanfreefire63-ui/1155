import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

interface KpiCardConfig {
  visible: boolean;
  label: string;
  icon: string;
}

interface ChartConfig {
  visible: boolean;
  label: string;
}

interface SidebarItemConfig {
  visible: boolean;
  label: string;
}

interface ModuleConfig {
  enabled: boolean;
  proOnly: boolean;
}

interface AlertConfig {
  enabled: boolean;
  email: boolean;
  dashboard: boolean;
}

interface KpiDataItem {
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface DashboardConfig {
  kpi_cards: {
    impressions: KpiCardConfig;
    ctr: KpiCardConfig;
    backlinks: KpiCardConfig;
    avgPosition: KpiCardConfig;
  };
  kpi_data: {
    impressions: KpiDataItem;
    ctr: KpiDataItem;
    backlinks: KpiDataItem;
    avgPosition: KpiDataItem;
  };
  charts: {
    trafficChart: ChartConfig;
    sessionsChart: ChartConfig;
    pagePerformance: ChartConfig;
    searchFunnel: ChartConfig;
  };
  sidebar_items: {
    dashboard: SidebarItemConfig;
    websites: SidebarItemConfig;
    keywords: SidebarItemConfig;
    rankTracker: SidebarItemConfig;
    siteAudit: SidebarItemConfig;
    contentPlanner: SidebarItemConfig;
    backlinks: SidebarItemConfig;
    reports: SidebarItemConfig;
    settings: SidebarItemConfig;
  };
  modules: {
    keywordManager: ModuleConfig;
    onPageSeo: ModuleConfig;
    technicalSeo: ModuleConfig;
    rankTracking: ModuleConfig;
    contentManager: ModuleConfig;
    backlinkManager: ModuleConfig;
    auditSystem: ModuleConfig;
    analytics: ModuleConfig;
    aiFeatures: ModuleConfig;
  };
  alerts: {
    pageDeindex: AlertConfig;
    titleChange: AlertConfig;
    rankingDrop: AlertConfig;
    trafficDrop: AlertConfig;
    newBacklink: AlertConfig;
    lostBacklink: AlertConfig;
    coreWebVitals: AlertConfig;
  };
}

const defaultConfig: DashboardConfig = {
  kpi_cards: {
    impressions: { visible: true, label: 'Impressions', icon: 'Eye' },
    ctr: { visible: true, label: 'CTR', icon: 'MousePointerClick' },
    backlinks: { visible: true, label: 'Backlinks', icon: 'Link2' },
    avgPosition: { visible: true, label: 'Avg Position', icon: 'Target' },
  },
  kpi_data: {
    impressions: { value: '200,520', change: '+2.39%', changeType: 'positive' },
    ctr: { value: '12.80%', change: '+1.34%', changeType: 'positive' },
    backlinks: { value: '3,670', change: '+0.83%', changeType: 'positive' },
    avgPosition: { value: '8.4', change: '-0.5', changeType: 'positive' },
  },
  charts: {
    trafficChart: { visible: true, label: 'Organic Search Traffic' },
    sessionsChart: { visible: true, label: 'Sessions' },
    pagePerformance: { visible: true, label: 'Page Performance' },
    searchFunnel: { visible: true, label: 'Organic Search Funnel' },
  },
  sidebar_items: {
    dashboard: { visible: true, label: 'Dashboard' },
    websites: { visible: true, label: 'Websites' },
    keywords: { visible: true, label: 'Keyword Research' },
    rankTracker: { visible: true, label: 'Rank Tracker' },
    siteAudit: { visible: true, label: 'Site Audit' },
    contentPlanner: { visible: true, label: 'Content Planner' },
    backlinks: { visible: true, label: 'Backlinks' },
    reports: { visible: true, label: 'Reports' },
    settings: { visible: true, label: 'Settings' },
  },
  modules: {
    keywordManager: { enabled: true, proOnly: false },
    onPageSeo: { enabled: true, proOnly: false },
    technicalSeo: { enabled: true, proOnly: false },
    rankTracking: { enabled: true, proOnly: false },
    contentManager: { enabled: true, proOnly: true },
    backlinkManager: { enabled: true, proOnly: true },
    auditSystem: { enabled: true, proOnly: true },
    analytics: { enabled: true, proOnly: true },
    aiFeatures: { enabled: true, proOnly: true },
  },
  alerts: {
    pageDeindex: { enabled: true, email: true, dashboard: true },
    titleChange: { enabled: true, email: true, dashboard: true },
    rankingDrop: { enabled: true, email: true, dashboard: true },
    trafficDrop: { enabled: true, email: true, dashboard: true },
    newBacklink: { enabled: true, email: false, dashboard: true },
    lostBacklink: { enabled: true, email: true, dashboard: true },
    coreWebVitals: { enabled: true, email: true, dashboard: true },
  },
};

interface DashboardConfigContextType {
  config: DashboardConfig;
  loading: boolean;
  updateConfig: (key: keyof DashboardConfig, value: Record<string, unknown>) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const DashboardConfigContext = createContext<DashboardConfigContextType | undefined>(undefined);

export function DashboardConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DashboardConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { session } = useAuth();

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_config')
        .select('config_key, config_value');

      if (error) throw error;

      if (data && data.length > 0) {
        const newConfig = { ...defaultConfig };
        data.forEach((row) => {
          const key = row.config_key as keyof DashboardConfig;
          if (key in newConfig) {
            (newConfig as Record<string, unknown>)[key] = row.config_value;
          }
        });
        setConfig(newConfig);
      }
    } catch (error) {
      // Silently fail, use defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchConfig();
    } else {
      setLoading(false);
    }
  }, [session]);

  const updateConfig = async (key: keyof DashboardConfig, value: Record<string, unknown>) => {
    try {
      const { error } = await supabase
        .from('dashboard_config')
        .update({ config_value: value as Json })
        .eq('config_key', key);

      if (error) throw error;

      setConfig((prev) => ({
        ...prev,
        [key]: value,
      }));

      toast({
        title: 'Settings saved',
        description: 'Configuration updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive',
      });
    }
  };

  const refreshConfig = async () => {
    await fetchConfig();
  };

  return (
    <DashboardConfigContext.Provider value={{ config, loading, updateConfig, refreshConfig }}>
      {children}
    </DashboardConfigContext.Provider>
  );
}

export function useDashboardConfig() {
  const context = useContext(DashboardConfigContext);
  if (context === undefined) {
    throw new Error('useDashboardConfig must be used within a DashboardConfigProvider');
  }
  return context;
}
