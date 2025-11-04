import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book, Clock, Send, Menu as MenuIcon, Shield, MessageCircle, Youtube, Facebook } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchData();
    setupRealtimeSubscriptions();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUsername(user.user_metadata?.username || user.email || "Friend");

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data?.role === "admin") {
      setIsAdmin(true);
    }
  };

  const fetchData = async () => {
    const [devotionalsRes, announcementsRes, socialLinksRes] = await Promise.all([
      supabase.from("devotionals").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("social_links").select("*"),
    ]);

    if (devotionalsRes.data) setDevotionals(devotionalsRes.data);
    if (announcementsRes.data) setAnnouncements(announcementsRes.data);
    if (socialLinksRes.data) setSocialLinks(socialLinksRes.data);
  };

  const setupRealtimeSubscriptions = () => {
    const devotionalsChannel = supabase
      .channel("devotionals-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "devotionals" },
        () => {
          toast({
            title: "New Devotional!",
            description: "A new devotional has been added.",
          });
          fetchData();
        }
      )
      .subscribe();

    const announcementsChannel = supabase
      .channel("announcements-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "announcements" },
        () => {
          toast({
            title: "New Announcement!",
            description: "Check out the latest announcement.",
          });
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(devotionalsChannel);
      supabase.removeChannel(announcementsChannel);
    };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      MessageCircle,
      Youtube,
      Facebook,
    };
    const Icon = icons[iconName] || MessageCircle;
    return <Icon className="h-5 w-5" />;
  };

  const activities = [
    {
      time: "10:00 AM",
      title: "Daily Devotional",
      description: "Read today's message from God",
      icon: Book,
      action: () => {},
    },
    {
      time: "6:00 PM",
      title: "Prayer Time",
      description: "Spend time in prayer and reflection",
      icon: Clock,
      action: () => navigate("/prayer-timer"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {username}!</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate("/menu")}>
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {announcements.length > 0 && (
          <Card className="backdrop-blur-lg bg-card/50 border-2 border-primary/30">
            <CardHeader>
              <CardTitle>📢 Latest Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="p-3 rounded-lg bg-background/30">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {devotionals.length > 0 && (
          <Card className="backdrop-blur-lg bg-card/50 border-[var(--glass-border)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Today's Devotional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devotionals[0] && (
                  <div>
                    <h3 className="font-semibold mb-2">{devotionals[0].title}</h3>
                    <img
                      src={devotionals[0].image_url}
                      alt={devotionals[0].title}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow backdrop-blur-lg bg-card/50 border-[var(--glass-border)]"
                onClick={activity.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>{activity.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{activity.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {socialLinks.length > 0 && (
          <Card className="backdrop-blur-lg bg-card/50 border-[var(--glass-border)]">
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {socialLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    className="w-full backdrop-blur-sm bg-background/50"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    {getIconComponent(link.icon)}
                    <span className="ml-2">{link.platform}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="backdrop-blur-lg bg-card/50 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => navigate("/prayer-request")}
            >
              Send Prayer Request
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/about-church")}
            >
              Learn More About TGLW
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
