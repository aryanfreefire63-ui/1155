-- Create dashboard_config table to store admin-controlled settings
CREATE TABLE public.dashboard_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text NOT NULL UNIQUE,
  config_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read config
CREATE POLICY "Dashboard config readable by all authenticated" 
ON public.dashboard_config 
FOR SELECT 
TO authenticated
USING (true);

-- Only admins can update config
CREATE POLICY "Admins can update dashboard config" 
ON public.dashboard_config 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert config
CREATE POLICY "Admins can insert dashboard config" 
ON public.dashboard_config 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_dashboard_config_updated_at
BEFORE UPDATE ON public.dashboard_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default dashboard config
INSERT INTO public.dashboard_config (config_key, config_value) VALUES
('kpi_cards', '{
  "impressions": {"visible": true, "label": "Impressions", "icon": "Eye"},
  "ctr": {"visible": true, "label": "CTR", "icon": "MousePointerClick"},
  "backlinks": {"visible": true, "label": "Backlinks", "icon": "Link2"},
  "avgPosition": {"visible": true, "label": "Avg Position", "icon": "Target"}
}'::jsonb),
('charts', '{
  "trafficChart": {"visible": true, "label": "Organic Search Traffic"},
  "sessionsChart": {"visible": true, "label": "Sessions"},
  "pagePerformance": {"visible": true, "label": "Page Performance"},
  "searchFunnel": {"visible": true, "label": "Organic Search Funnel"}
}'::jsonb),
('sidebar_items', '{
  "dashboard": {"visible": true, "label": "Dashboard"},
  "websites": {"visible": true, "label": "Websites"},
  "keywords": {"visible": true, "label": "Keyword Research"},
  "rankTracker": {"visible": true, "label": "Rank Tracker"},
  "siteAudit": {"visible": true, "label": "Site Audit"},
  "contentPlanner": {"visible": true, "label": "Content Planner"},
  "backlinks": {"visible": true, "label": "Backlinks"},
  "reports": {"visible": true, "label": "Reports"},
  "settings": {"visible": true, "label": "Settings"}
}'::jsonb),
('modules', '{
  "keywordManager": {"enabled": true, "proOnly": false},
  "onPageSeo": {"enabled": true, "proOnly": false},
  "technicalSeo": {"enabled": true, "proOnly": false},
  "rankTracking": {"enabled": true, "proOnly": false},
  "contentManager": {"enabled": true, "proOnly": true},
  "backlinkManager": {"enabled": true, "proOnly": true},
  "auditSystem": {"enabled": true, "proOnly": true},
  "analytics": {"enabled": true, "proOnly": true},
  "aiFeatures": {"enabled": true, "proOnly": true}
}'::jsonb),
('alerts', '{
  "pageDeindex": {"enabled": true, "email": true, "dashboard": true},
  "titleChange": {"enabled": true, "email": true, "dashboard": true},
  "rankingDrop": {"enabled": true, "email": true, "dashboard": true},
  "trafficDrop": {"enabled": true, "email": true, "dashboard": true},
  "newBacklink": {"enabled": true, "email": false, "dashboard": true},
  "lostBacklink": {"enabled": true, "email": true, "dashboard": true},
  "coreWebVitals": {"enabled": true, "email": true, "dashboard": true}
}'::jsonb);