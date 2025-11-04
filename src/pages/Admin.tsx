import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [devotionalTitle, setDevotionalTitle] = useState("");
  const [devotionalImage, setDevotionalImage] = useState<File | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchData();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || data?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const fetchData = async () => {
    const [devotionalsRes, announcementsRes] = await Promise.all([
      supabase.from("devotionals").select("*").order("created_at", { ascending: false }),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
    ]);

    if (devotionalsRes.data) setDevotionals(devotionalsRes.data);
    if (announcementsRes.data) setAnnouncements(announcementsRes.data);
  };

  const handleDevotionalUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devotionalImage) {
      toast({ title: "Please select an image", variant: "destructive" });
      return;
    }

    try {
      const fileExt = devotionalImage.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("devotionals")
        .upload(filePath, devotionalImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("devotionals")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("devotionals")
        .insert({
          title: devotionalTitle,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      toast({ title: "Devotional uploaded successfully!" });
      setDevotionalTitle("");
      setDevotionalImage(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("announcements")
        .insert({
          title: announcementTitle,
          content: announcementContent,
        });

      if (error) throw error;

      toast({ title: "Announcement created successfully!" });
      setAnnouncementTitle("");
      setAnnouncementContent("");
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (type: "devotional" | "announcement", id: string) => {
    try {
      const table = type === "devotional" ? "devotionals" : "announcements";
      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;

      toast({ title: `${type === "devotional" ? "Devotional" : "Announcement"} deleted successfully!` });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="backdrop-blur-lg bg-card/50 border-[var(--glass-border)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Devotional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDevotionalUpload} className="space-y-4">
                <div>
                  <Label htmlFor="devotional-title">Title</Label>
                  <Input
                    id="devotional-title"
                    value={devotionalTitle}
                    onChange={(e) => setDevotionalTitle(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="devotional-image">Image</Label>
                  <Input
                    id="devotional-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDevotionalImage(e.target.files?.[0] || null)}
                    required
                    className="backdrop-blur-sm bg-background/50"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Devotional
                </Button>
              </form>

              <div className="mt-6 space-y-2">
                <h3 className="font-semibold">Recent Devotionals</h3>
                {devotionals.slice(0, 3).map((dev) => (
                  <div key={dev.id} className="flex justify-between items-center p-2 rounded bg-background/30">
                    <span className="text-sm">{dev.title}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete("devotional", dev.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-card/50 border-[var(--glass-border)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Announcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="announcement-content">Content</Label>
                  <Textarea
                    id="announcement-content"
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    required
                    rows={4}
                    className="backdrop-blur-sm bg-background/50"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Announcement
                </Button>
              </form>

              <div className="mt-6 space-y-2">
                <h3 className="font-semibold">Recent Announcements</h3>
                {announcements.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="flex justify-between items-center p-2 rounded bg-background/30">
                    <span className="text-sm">{ann.title}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete("announcement", ann.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
