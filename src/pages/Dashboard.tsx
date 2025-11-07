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
          <Card className="backdrop-blur-xl bg-card/80 border border-primary/20 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-300 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Book className="h-6 w-6 text-primary" />
                Today's Devotional
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {devotionals[0] && (
                <div 
                  className="cursor-pointer relative"
                  onClick={() => navigate(`/devotional/${devotionals[0].id}`)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={devotionals[0].image_url}
                      alt={devotionals[0].title}
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium">Click to view full devotional</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{devotionals[0].title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(devotionals[0].date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
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
