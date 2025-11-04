import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Code2, Heart } from "lucide-react";

const AboutDeveloper = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">About Developer</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Code2 className="h-16 w-16 text-white" />
            </div>
            <CardTitle className="text-3xl">App Developer</CardTitle>
            <CardDescription className="text-base">
              Building tools for spiritual growth and community connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <Heart className="h-5 w-5" />
                About This Project
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The TGLW Global app was developed with a passion for creating technology that 
                serves the Kingdom of God. This application aims to make spiritual practices 
                more accessible and help believers stay connected to their daily devotions, 
                prayer routines, and church community.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS", "PWA", "Vite"].map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✅ Daily devotional reminders</li>
                <li>✅ Prayer timer with notifications</li>
                <li>✅ Works offline as a PWA</li>
                <li>✅ Prayer request submissions</li>
                <li>✅ Church information and contact</li>
                <li>✅ User-friendly interface for all ages</li>
              </ul>
            </div>

            <Card className="bg-accent/10 border-accent">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground italic">
                  "Whatever you do, work at it with all your heart, as working for the Lord, 
                  not for human masters." - Colossians 3:23
                </p>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Have feedback or suggestions? We'd love to hear from you!
              </p>
              <Button 
                className="bg-gradient-to-r from-primary to-purple-600"
                onClick={() => navigate("/contact")}
              >
                Get in Touch
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutDeveloper;
