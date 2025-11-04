-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create devotionals table
CREATE TABLE public.devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view devotionals"
  ON public.devotionals
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert devotionals"
  ON public.devotionals
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update devotionals"
  ON public.devotionals
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete devotionals"
  ON public.devotionals
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements"
  ON public.announcements
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert announcements"
  ON public.announcements
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update announcements"
  ON public.announcements
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete announcements"
  ON public.announcements
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create social_links table
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social links"
  ON public.social_links
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage social links"
  ON public.social_links
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert initial social links
INSERT INTO public.social_links (platform, url, icon) VALUES
  ('WhatsApp', 'https://whatsapp.com/channel/0029VaDOJLYK5cDGuYoSWx3p', 'MessageCircle'),
  ('YouTube', 'https://youtube.com/@samuelnasam8754?si=V7Jm6oKIBQY7Q-lu', 'Youtube'),
  ('Facebook', 'https://www.facebook.com/profile.php?id=61557426106446', 'Facebook');

-- Create storage bucket for devotional images
INSERT INTO storage.buckets (id, name, public) VALUES ('devotionals', 'devotionals', true);

-- Storage policies for devotional images
CREATE POLICY "Anyone can view devotional images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'devotionals');

CREATE POLICY "Admins can upload devotional images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'devotionals' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete devotional images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'devotionals' AND public.has_role(auth.uid(), 'admin'));