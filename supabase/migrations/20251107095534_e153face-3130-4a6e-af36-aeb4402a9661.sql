-- Enable realtime for devotionals and announcements tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.devotionals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;