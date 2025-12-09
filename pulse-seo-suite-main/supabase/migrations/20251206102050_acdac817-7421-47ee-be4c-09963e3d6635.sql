-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'seo_manager', 'client');

-- Site Settings table for logo, name, etc.
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'SEO Manager',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563EB',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Websites/Projects table
CREATE TABLE public.websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  name TEXT,
  target_country TEXT DEFAULT 'Global',
  language TEXT DEFAULT 'en',
  business_type TEXT DEFAULT 'blog',
  status TEXT DEFAULT 'active',
  health_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Competitors table
CREATE TABLE public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keywords table
CREATE TABLE public.keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  keyword TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  cpc DECIMAL(10,2) DEFAULT 0,
  intent TEXT DEFAULT 'informational',
  is_primary BOOLEAN DEFAULT false,
  mapped_page_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pages table for on-page SEO
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  seo_score INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  index_status TEXT DEFAULT 'unknown',
  last_crawled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Backlinks table
CREATE TABLE public.backlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT,
  domain_authority INTEGER DEFAULT 0,
  spam_score INTEGER DEFAULT 0,
  is_dofollow BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rank Tracking table
CREATE TABLE public.rank_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES public.keywords(id) ON DELETE CASCADE NOT NULL,
  position INTEGER,
  device TEXT DEFAULT 'desktop',
  location TEXT DEFAULT 'US',
  serp_features TEXT[],
  tracked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content Plans table
CREATE TABLE public.content_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_keyword TEXT,
  status TEXT DEFAULT 'idea',
  scheduled_date DATE,
  word_count_target INTEGER DEFAULT 1500,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Reports table
CREATE TABLE public.audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  errors_count INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  passed_count INTEGER DEFAULT 0,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  
  -- First user becomes admin
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'client');
  END IF;
  
  RETURN new;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert default site settings
INSERT INTO public.site_settings (site_name, primary_color) VALUES ('SEO Manager', '#2563EB');

-- RLS Policies

-- Site settings: readable by all, editable by admins
CREATE POLICY "Site settings readable by all" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Profiles: users can view all, edit own
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User roles: admins can manage
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Websites: users see own, admins see all
CREATE POLICY "Users can view own websites" ON public.websites FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own websites" ON public.websites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own websites" ON public.websites FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own websites" ON public.websites FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Similar policies for related tables
CREATE POLICY "Users can manage own competitors" ON public.competitors FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.websites WHERE id = website_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can manage own keywords" ON public.keywords FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.websites WHERE id = website_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can manage own pages" ON public.pages FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.websites WHERE id = website_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can manage own backlinks" ON public.backlinks FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.websites WHERE id = website_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can manage own rank history" ON public.rank_history FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.keywords k JOIN public.websites w ON k.website_id = w.id WHERE k.id = keyword_id AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can manage own alerts" ON public.alerts FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.websites WHERE id = website_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can manage own content plans" ON public.content_plans FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.websites WHERE id = website_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Users can manage own audit reports" ON public.audit_reports FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.websites WHERE id = website_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON public.websites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON public.keywords FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_plans_updated_at BEFORE UPDATE ON public.content_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();