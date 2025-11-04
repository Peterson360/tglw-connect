import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Message sent! The Man of God will respond soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Contact Us</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Contact the Man of God</CardTitle>
            <CardDescription>
              Reach out for spiritual guidance, counseling, or ministry inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Your Name *</Label>
                <Input
                  id="contact-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email (Optional)</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Your Message *</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Share your message or request..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px] resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-center text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">contact@tglwglobal.org</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-center text-lg">Phone</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-center text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">Multiple branches available</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Contact;
