import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const PrayerRequest = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !request.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Store prayer request (in a real app, this would go to a backend)
    const requests = JSON.parse(localStorage.getItem("prayer_requests") || "[]");
    requests.push({
      name,
      email,
      request,
      date: new Date().toISOString()
    });
    localStorage.setItem("prayer_requests", JSON.stringify(requests));

    toast.success("🙏 Prayer request submitted! Our team will pray for you.");
    setName("");
    setEmail("");
    setRequest("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Prayer Request</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Submit Your Prayer Request</CardTitle>
            <CardDescription>
              Share your needs with us and we will lift them up in prayer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="request">Prayer Request *</Label>
                <Textarea
                  id="request"
                  placeholder="Share what you'd like us to pray about..."
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  className="min-h-[200px] resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600"
              >
                Submit Prayer Request
              </Button>

              <p className="text-center text-sm text-muted-foreground italic">
                "The prayer of a righteous person is powerful and effective." - James 5:16
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PrayerRequest;
