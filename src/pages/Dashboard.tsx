import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Video, Timer, Send, Menu, LogOut } from "lucide-react";
import { toast } from "sonner";

interface User {
  username: string;
  churchBranch: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("tglw_user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    
    // Check and schedule notifications
    scheduleNotifications();
  }, [navigate]);

  const scheduleNotifications = () => {
    const now = new Date();
    const currentHour = now.getHours();

    // Show notification based on current time (for demo purposes)
    if (currentHour >= 10 && currentHour < 11) {
      toast.info("📖 Time for today's devotional!");
    } else if (currentHour >= 15 && currentHour < 16) {
      toast.info("🎥 Time to meditate with today's content!");
    } else if (currentHour >= 18 && currentHour < 19) {
      toast.info("🙏 Time for prayer in tongues!");
    } else if (now.getDay() === 0 && currentHour >= 8 && currentHour < 9) {
      toast.info("⛪ Church service reminder!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tglw_user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  const activities = [
    {
      title: "Daily Devotional",
      description: "Read today's word from God",
      icon: Book,
      time: "10:00 AM",
      action: () => {
        window.open("https://wa.me/?text=Hello%20I%20would%20like%20to%20access%20today's%20devotional", "_blank");
      }
    },
    {
      title: "Meditation Time",
      description: "Watch videos and discussions",
      icon: Video,
      time: "3:00 PM",
      action: () => {
        window.open("https://youtube.com", "_blank");
      }
    },
    {
      title: "Prayer in Tongues",
      description: "Set your prayer timer",
      icon: Timer,
      time: "6:00 PM",
      action: () => navigate("/prayer-timer")
    },
    {
      title: "Prayer Request",
      description: "Submit your prayer needs",
      icon: Send,
      time: "Anytime",
      action: () => navigate("/prayer-request")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            TGLW Global
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back, {user.username}! 🙏</CardTitle>
            <CardDescription className="text-white/90">
              {user.churchBranch} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Today's Activities</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Card key={activity.title} className="hover:shadow-soft transition-shadow cursor-pointer" onClick={activity.action}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{activity.title}</CardTitle>
                          <CardDescription>{activity.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">⏰ Scheduled: {activity.time}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {new Date().getDay() === 0 && (
          <Card className="bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="text-xl">⛪ Sunday Service Today!</CardTitle>
              <CardDescription>
                Join us for worship at {user.churchBranch} at 8:00 AM
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
