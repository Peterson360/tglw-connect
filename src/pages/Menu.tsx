import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, Church, User, Code, Send } from "lucide-react";

const Menu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      description: "Return to home",
      icon: Home,
      action: () => navigate("/dashboard")
    },
    {
      title: "About Church",
      description: "Learn about TGLW Global",
      icon: Church,
      action: () => navigate("/about-church")
    },
    {
      title: "Contact Man of God",
      description: "Reach out for spiritual guidance",
      icon: Send,
      action: () => navigate("/contact")
    },
    {
      title: "About Developer",
      description: "Meet the app creator",
      icon: Code,
      action: () => navigate("/about-developer")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Menu</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto grid gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title} 
                className="hover:shadow-soft transition-shadow cursor-pointer"
                onClick={item.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Menu;
