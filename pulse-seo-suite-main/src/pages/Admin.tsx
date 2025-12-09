import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardConfig } from '@/contexts/DashboardConfigContext';
import { 
  Settings, 
  Users, 
  Globe, 
  Palette, 
  Save, 
  Loader2, 
  Plus, 
  Trash2,
  Shield,
  LayoutDashboard,
  BarChart3,
  Bell,
  Eye,
  EyeOff,
  Boxes,
  Navigation,
  Edit3,
  Sparkles
} from 'lucide-react';

interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  primary_color: string | null;
}

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'seo_manager' | 'client';
  created_at: string;
}

interface Website {
  id: string;
  domain: string;
  name: string | null;
  status: string | null;
  target_country: string | null;
  language: string | null;
  business_type: string | null;
  health_score: number | null;
  user_id: string;
}

export default function Admin() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { config, updateConfig } = useDashboardConfig();

  // Local state for KPI data editing (prevents cursor jump)
  const [localKpiData, setLocalKpiData] = useState(config.kpi_data);

  // Sync local state when config changes from outside
  useEffect(() => {
    setLocalKpiData(config.kpi_data);
  }, [config.kpi_data]);

  const [newWebsite, setNewWebsite] = useState({
    domain: '',
    name: '',
    target_country: 'Global',
    language: 'en',
    business_type: 'blog',
  });
  const [competitors, setCompetitors] = useState<string[]>(['', '', '']);
  const [addingWebsite, setAddingWebsite] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();
      
      if (settings) {
        setSiteSettings(settings);
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at');

      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (profiles && roles) {
        const usersWithRoles = profiles.map(profile => ({
          ...profile,
          role: (roles.find(r => r.user_id === profile.id)?.role || 'client') as 'admin' | 'seo_manager' | 'client',
        }));
        setUsers(usersWithRoles);
      }

      const { data: websiteData } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (websiteData) {
        setWebsites(websiteData);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!siteSettings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: siteSettings.site_name,
          logo_url: siteSettings.logo_url,
          primary_color: siteSettings.primary_color,
        })
        .eq('id', siteSettings.id);

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Site settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'seo_manager' | 'client') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

      toast({
        title: 'Role updated',
        description: 'User role has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleAddWebsite = async () => {
    if (!newWebsite.domain || !user) {
      toast({
        title: 'Error',
        description: 'Please enter a domain',
        variant: 'destructive',
      });
      return;
    }

    setAddingWebsite(true);
    try {
      const { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .insert({
          domain: newWebsite.domain,
          name: newWebsite.name || newWebsite.domain,
          target_country: newWebsite.target_country,
          language: newWebsite.language,
          business_type: newWebsite.business_type,
          user_id: user.id,
          status: 'active',
          health_score: 0,
        })
        .select()
        .single();

      if (websiteError) throw websiteError;

      const validCompetitors = competitors.filter(c => c.trim() !== '');
      if (validCompetitors.length > 0 && websiteData) {
        const competitorInserts = validCompetitors.map(domain => ({
          website_id: websiteData.id,
          domain: domain.trim(),
        }));
        
        await supabase.from('competitors').insert(competitorInserts);
      }

      setWebsites([websiteData, ...websites]);
      setNewWebsite({
        domain: '',
        name: '',
        target_country: 'Global',
        language: 'en',
        business_type: 'blog',
      });
      setCompetitors(['', '', '']);

      toast({
        title: 'Website added',
        description: 'Website has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add website',
        variant: 'destructive',
      });
    } finally {
      setAddingWebsite(false);
    }
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);

      if (error) throw error;

      setWebsites(websites.filter(w => w.id !== websiteId));

      toast({
        title: 'Website deleted',
        description: 'Website has been removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete website',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'seo_manager':
        return 'default';
      default:
        return 'secondary';
    }
  };

  // KPI Cards config update
  const handleKpiToggle = (key: string, visible: boolean) => {
    const newConfig = { ...config.kpi_cards, [key]: { ...config.kpi_cards[key as keyof typeof config.kpi_cards], visible } };
    updateConfig('kpi_cards', newConfig);
  };

  const handleKpiLabelChange = (key: string, label: string) => {
    const newConfig = { ...config.kpi_cards, [key]: { ...config.kpi_cards[key as keyof typeof config.kpi_cards], label } };
    updateConfig('kpi_cards', newConfig);
  };

  // Charts config update
  const handleChartToggle = (key: string, visible: boolean) => {
    const newConfig = { ...config.charts, [key]: { ...config.charts[key as keyof typeof config.charts], visible } };
    updateConfig('charts', newConfig);
  };

  const handleChartLabelChange = (key: string, label: string) => {
    const newConfig = { ...config.charts, [key]: { ...config.charts[key as keyof typeof config.charts], label } };
    updateConfig('charts', newConfig);
  };

  // Sidebar config update
  const handleSidebarToggle = (key: string, visible: boolean) => {
    const newConfig = { ...config.sidebar_items, [key]: { ...config.sidebar_items[key as keyof typeof config.sidebar_items], visible } };
    updateConfig('sidebar_items', newConfig);
  };

  const handleSidebarLabelChange = (key: string, label: string) => {
    const newConfig = { ...config.sidebar_items, [key]: { ...config.sidebar_items[key as keyof typeof config.sidebar_items], label } };
    updateConfig('sidebar_items', newConfig);
  };

  // Modules config update
  const handleModuleToggle = (key: string, enabled: boolean) => {
    const newConfig = { ...config.modules, [key]: { ...config.modules[key as keyof typeof config.modules], enabled } };
    updateConfig('modules', newConfig);
  };

  const handleModuleProToggle = (key: string, proOnly: boolean) => {
    const newConfig = { ...config.modules, [key]: { ...config.modules[key as keyof typeof config.modules], proOnly } };
    updateConfig('modules', newConfig);
  };

  // Alerts config update
  const handleAlertToggle = (key: string, field: 'enabled' | 'email' | 'dashboard', value: boolean) => {
    const newConfig = { ...config.alerts, [key]: { ...config.alerts[key as keyof typeof config.alerts], [field]: value } };
    updateConfig('alerts', newConfig);
  };

  // KPI Data local update (only updates local state for smooth typing)
  const handleKpiDataLocalChange = (key: string, field: 'value' | 'change' | 'changeType', value: string) => {
    setLocalKpiData(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], [field]: value }
    }));
  };

  // Save KPI data to database on blur
  const handleKpiDataSave = (key: string) => {
    updateConfig('kpi_data', localKpiData);
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Panel">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Panel">
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="kpi" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">KPI Cards</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Charts</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">Navigation</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            <span className="hidden sm:inline">Modules</span>
          </TabsTrigger>
          <TabsTrigger value="websites" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Websites</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Site Branding
                </CardTitle>
                <CardDescription>
                  Customize your SEO Manager branding and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings?.site_name || ''}
                    onChange={(e) => setSiteSettings(prev => 
                      prev ? { ...prev, site_name: e.target.value } : null
                    )}
                    placeholder="Enter site name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={siteSettings?.logo_url || ''}
                    onChange={(e) => setSiteSettings(prev => 
                      prev ? { ...prev, logo_url: e.target.value } : null
                    )}
                    placeholder="https://example.com/logo.png"
                  />
                  {siteSettings?.logo_url && (
                    <div className="mt-2 p-4 border rounded-lg bg-muted">
                      <img 
                        src={siteSettings.logo_url} 
                        alt="Logo preview" 
                        className="max-h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      value={siteSettings?.primary_color || '#2563EB'}
                      onChange={(e) => setSiteSettings(prev => 
                        prev ? { ...prev, primary_color: e.target.value } : null
                      )}
                      placeholder="#2563EB"
                    />
                    <input
                      type="color"
                      value={siteSettings?.primary_color || '#2563EB'}
                      onChange={(e) => setSiteSettings(prev => 
                        prev ? { ...prev, primary_color: e.target.value } : null
                      )}
                      className="h-10 w-10 rounded border cursor-pointer"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Branding
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Platform Stats
                </CardTitle>
                <CardDescription>
                  Overview of your SEO platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="text-sm text-muted-foreground">Total Users</span>
                    <span className="font-semibold">{users.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="text-sm text-muted-foreground">Total Websites</span>
                    <span className="font-semibold">{websites.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="text-sm text-muted-foreground">Admin Users</span>
                    <span className="font-semibold">{users.filter(u => u.role === 'admin').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="text-sm text-muted-foreground">SEO Managers</span>
                    <span className="font-semibold">{users.filter(u => u.role === 'seo_manager').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KPI Cards Tab */}
        <TabsContent value="kpi">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  KPI Cards Settings
                </CardTitle>
                <CardDescription>
                  Control visibility and labels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(config.kpi_cards).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {value.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                        <Switch
                          checked={value.visible}
                          onCheckedChange={(checked) => handleKpiToggle(key, checked)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={value.label}
                          onChange={(e) => handleKpiLabelChange(key, e.target.value)}
                          placeholder="Card label"
                          className="h-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  KPI Data Values
                </CardTitle>
                <CardDescription>
                  Edit the actual values shown on KPI cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(localKpiData).map(([key, data]) => (
                    <div key={key} className="p-4 rounded-lg border space-y-3">
                      <div className="font-medium capitalize flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Value</Label>
                          <Input
                            value={data.value}
                            onChange={(e) => handleKpiDataLocalChange(key, 'value', e.target.value)}
                            onBlur={() => handleKpiDataSave(key)}
                            placeholder="Value"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Change</Label>
                          <Input
                            value={data.change}
                            onChange={(e) => handleKpiDataLocalChange(key, 'change', e.target.value)}
                            onBlur={() => handleKpiDataSave(key)}
                            placeholder="+2.5%"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Type</Label>
                          <Select 
                            value={data.changeType} 
                            onValueChange={(v) => {
                              handleKpiDataLocalChange(key, 'changeType', v);
                              // Save immediately for select since there's no blur
                              setTimeout(() => handleKpiDataSave(key), 0);
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positive">Positive</SelectItem>
                              <SelectItem value="negative">Negative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Charts & Widgets Control
              </CardTitle>
              <CardDescription>
                Control which charts and widgets are visible on the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(config.charts).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {value.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        <span className="font-medium">{value.label}</span>
                      </div>
                      <Switch
                        checked={value.visible}
                        onCheckedChange={(checked) => handleChartToggle(key, checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={value.label}
                        onChange={(e) => handleChartLabelChange(key, e.target.value)}
                        placeholder="Chart title"
                        className="h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Sidebar Navigation Control
              </CardTitle>
              <CardDescription>
                Control which menu items are visible in the sidebar and customize their labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(config.sidebar_items).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {value.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        <span className="font-medium">{value.label}</span>
                      </div>
                      <Switch
                        checked={value.visible}
                        onCheckedChange={(checked) => handleSidebarToggle(key, checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={value.label}
                        onChange={(e) => handleSidebarLabelChange(key, e.target.value)}
                        placeholder="Menu label"
                        className="h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                Module Control (Basic vs Pro)
              </CardTitle>
              <CardDescription>
                Enable/disable modules and set which are Pro-only features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(config.modules).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {value.proOnly && (
                        <Badge variant="default" className="bg-primary/10 text-primary border-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Enabled</span>
                      <Switch
                        checked={value.enabled}
                        onCheckedChange={(checked) => handleModuleToggle(key, checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pro Only</span>
                      <Switch
                        checked={value.proOnly}
                        onCheckedChange={(checked) => handleModuleProToggle(key, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Websites Tab */}
        <TabsContent value="websites">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Website
                </CardTitle>
                <CardDescription>
                  Add a new website to track SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain *</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newWebsite.domain}
                      onChange={(e) => setNewWebsite(prev => ({ ...prev, domain: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteName">Website Name</Label>
                    <Input
                      id="websiteName"
                      placeholder="My Website"
                      value={newWebsite.name}
                      onChange={(e) => setNewWebsite(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Country</Label>
                    <Select
                      value={newWebsite.target_country}
                      onValueChange={(value) => setNewWebsite(prev => ({ ...prev, target_country: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Global">Global</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={newWebsite.language}
                      onValueChange={(value) => setNewWebsite(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <Select
                      value={newWebsite.business_type}
                      onValueChange={(value) => setNewWebsite(prev => ({ ...prev, business_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="news">News / Media</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label className="mb-3 block">Competitor Domains (3-5)</Label>
                  <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
                    {competitors.map((comp, index) => (
                      <Input
                        key={index}
                        placeholder={`competitor${index + 1}.com`}
                        value={comp}
                        onChange={(e) => {
                          const newComps = [...competitors];
                          newComps[index] = e.target.value;
                          setCompetitors(newComps);
                        }}
                      />
                    ))}
                    {competitors.length < 5 && (
                      <Button
                        variant="outline"
                        onClick={() => setCompetitors([...competitors, ''])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add More
                      </Button>
                    )}
                  </div>
                </div>

                <Button 
                  className="mt-6" 
                  onClick={handleAddWebsite}
                  disabled={addingWebsite}
                >
                  {addingWebsite ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Website
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managed Websites</CardTitle>
                <CardDescription>
                  All websites in the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {websites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No websites added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      websites.map((website) => (
                        <TableRow key={website.id}>
                          <TableCell className="font-medium">{website.domain}</TableCell>
                          <TableCell>{website.name || '-'}</TableCell>
                          <TableCell>{website.target_country || 'Global'}</TableCell>
                          <TableCell className="capitalize">{website.business_type || 'blog'}</TableCell>
                          <TableCell>
                            <Badge variant={website.status === 'active' ? 'default' : 'secondary'}>
                              {website.status || 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-success" 
                                  style={{ width: `${website.health_score || 0}%` }}
                                />
                              </div>
                              <span className="text-sm">{website.health_score || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteWebsite(website.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user roles and permissions (Admin, SEO Manager, Client)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(u.role)}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(value: 'admin' | 'seo_manager' | 'client') => 
                            handleRoleChange(u.id, value)
                          }
                          disabled={u.id === user?.id}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="seo_manager">SEO Manager</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Configuration
              </CardTitle>
              <CardDescription>
                Configure which alerts are enabled and how they are delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(config.alerts).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Switch
                        checked={value.enabled}
                        onCheckedChange={(checked) => handleAlertToggle(key, 'enabled', checked)}
                      />
                    </div>
                    {value.enabled && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Email Notification</span>
                          <Switch
                            checked={value.email}
                            onCheckedChange={(checked) => handleAlertToggle(key, 'email', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Dashboard Alert</span>
                          <Switch
                            checked={value.dashboard}
                            onCheckedChange={(checked) => handleAlertToggle(key, 'dashboard', checked)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
