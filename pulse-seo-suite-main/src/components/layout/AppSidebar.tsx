import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  Search,
  TrendingUp,
  FileCheck,
  Calendar,
  Link2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDashboardConfig } from "@/contexts/DashboardConfigContext";
import { supabase } from "@/integrations/supabase/client";

const iconMap = {
  dashboard: LayoutDashboard,
  websites: Globe,
  keywords: Search,
  rankTracker: TrendingUp,
  siteAudit: FileCheck,
  contentPlanner: Calendar,
  backlinks: Link2,
  reports: FileText,
  settings: Settings,
};

const urlMap = {
  dashboard: "/",
  websites: "/websites",
  keywords: "/keywords",
  rankTracker: "/rank-tracker",
  siteAudit: "/site-audit",
  contentPlanner: "/content-planner",
  backlinks: "/backlinks",
  reports: "/reports",
  settings: "/settings",
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [siteName, setSiteName] = useState("SEO Manager");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { config } = useDashboardConfig();

  useEffect(() => {
    const fetchSiteSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('site_name, logo_url')
        .maybeSingle();
      
      if (data) {
        setSiteName(data.site_name || "SEO Manager");
        setLogoUrl(data.logo_url);
      }
    };

    fetchSiteSettings();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = Object.entries(config.sidebar_items)
    .filter(([_, value]) => value.visible)
    .map(([key, value]) => ({
      key,
      title: value.label,
      url: urlMap[key as keyof typeof urlMap],
      icon: iconMap[key as keyof typeof iconMap],
    }));

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="w-8 h-8 object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          {!collapsed && (
            <span className="font-semibold text-foreground text-lg">{siteName}</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.key}>
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                </NavLink>
              </li>
            );
          })}
          
          {/* Admin Link - Visible to all authenticated users */}
          <li>
            <NavLink
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                location.pathname === '/admin'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Shield className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Admin Panel</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout & Collapse */}
      <div className="p-2 border-t border-border space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
