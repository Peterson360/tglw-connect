import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book, Clock, Send, Menu as MenuIcon, Shield, MessageCircle, Youtube, Facebook, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DevotionalGallery from "@/components/DevotionalGallery";

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
        (payload) => {
          toast({
            title: "🙏 New Devotional Available!",
            description: "Tap to read today's spiritual message.",
            duration: 10000,
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/devotional/${payload.new.id}`)}
              >
                Read Now
              </Button>
            ),
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
            title: "📢 New Announcement!",
            description: "Check out the latest update from the church.",
            duration: 8000,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="container mx-auto p-6 space-y-8 relative z-10">
        <div className="flex justify-between items-center backdrop-blur-sm bg-card/30 rounded-2xl p-6 border border-primary/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome, {username}!
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Stay blessed with today's devotional
            </p>
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
          <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-2 border-primary/30 shadow-2xl animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="text-2xl">📢 Latest Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <h3 className="font-bold text-lg">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{announcement.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {devotionals.length > 0 && (
          <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/5 via-card/80 to-secondary/5 border-2 border-primary/30 shadow-2xl overflow-hidden group hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 animate-fade-in">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                <Book className="h-7 w-7 text-primary animate-pulse" />
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
                      className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="transform translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-2xl md:text-3xl mb-3 drop-shadow-lg">{devotionals[0].title}</h3>
                        <p className="text-sm font-medium opacity-90">
                          {new Date(devotionals[0].date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-semibold bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center gap-2">
                          <span>Click to view full devotional</span>
                          <span className="animate-bounce">→</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <DevotionalGallery />

        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-primary/20 group"
                onClick={activity.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{activity.title}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">{activity.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{activity.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {socialLinks.length > 0 && (
          <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-primary/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="text-2xl">Connect With Us</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {socialLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="lg"
                    className="w-full backdrop-blur-sm bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    {getIconComponent(link.icon)}
                    <span className="ml-2 font-semibold">{link.platform}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-2 border-primary/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Send className="h-6 w-6 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button 
              size="lg"
              className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={() => navigate("/prayer-request")}
            >
              <Send className="mr-2 h-5 w-5" />
              Send Prayer Request
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full text-lg py-6 hover:bg-primary/10 transition-all duration-300" 
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
