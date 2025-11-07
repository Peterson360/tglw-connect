import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Share2, Facebook, MessageCircle, Mail } from "lucide-react";

const DevotionalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [devotional, setDevotional] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevotional();
  }, [id]);

  const fetchDevotional = async () => {
    try {
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setDevotional(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load devotional",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!devotional) return;

    try {
      const response = await fetch(devotional.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devotional-${devotional.title}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded!",
        description: "Devotional image saved to your device",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not download image",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    if (!devotional) return;

    const text = `Check out this devotional: ${devotional.title}`;
    const url = window.location.href;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(devotional.title)}&body=${encodeURIComponent(text + "\n\n" + url)}`;
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!devotional) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>

        <Card className="backdrop-blur-xl bg-card/80 border border-primary/20 shadow-2xl overflow-hidden animate-fade-in">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={devotional.image_url}
                alt={devotional.title}
                className="w-full h-auto max-h-[70vh] object-contain bg-black/5"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                <p className="text-white text-sm font-medium">
                  {new Date(devotional.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {devotional.title}
                </h1>
                <p className="text-muted-foreground">
                  Take a moment to reflect on this devotional message
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Image
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold border-primary/30 hover:bg-primary/10"
                  onClick={() => {}}
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Share on social media:</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50"
                    onClick={() => handleShare("whatsapp")}
                  >
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-primary/30 hover:bg-primary/10"
                    onClick={() => handleShare("email")}
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevotionalView;
