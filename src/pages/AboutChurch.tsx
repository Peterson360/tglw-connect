import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import spiritualBg from "@/assets/spiritual-bg.jpg";

const AboutChurch = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">About Our Church</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        <Card className="overflow-hidden">
          <div className="h-64 w-full overflow-hidden">
            <img 
              src={spiritualBg} 
              alt="TGLW Global Church" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl">TGLW Global Ministry</CardTitle>
            <CardDescription className="text-base">
              A house of prayer, worship, and divine transformation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                TGLW Global is committed to spreading the gospel of Jesus Christ and raising 
                spiritual warriors who walk in power, love, and divine purpose. We are a 
                community dedicated to prayer, worship, and the transformation of lives through 
                the Word of God.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To build a global family of believers who are rooted in faith, empowered by 
                the Holy Spirit, and equipped to manifest God's glory in every sphere of life. 
                We focus on spiritual growth, community building, and impacting nations with 
                the love of Christ.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">What We Believe</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✝️ The triune God: Father, Son, and Holy Spirit</li>
                <li>📖 The Bible as the inspired Word of God</li>
                <li>🙏 Salvation through faith in Jesus Christ</li>
                <li>💫 The power of prayer and speaking in tongues</li>
                <li>❤️ Living a life of love, holiness, and purpose</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Our Services</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Sunday Service:</strong> 8:00 AM - 11:00 AM</p>
                <p><strong>Midweek Service:</strong> Wednesday, 6:00 PM</p>
                <p><strong>Prayer Meetings:</strong> Daily at 6:00 AM & 6:00 PM</p>
                <p><strong>Youth Service:</strong> Friday, 5:00 PM</p>
              </div>
            </div>

            <Card className="bg-accent/10 border-accent">
              <CardHeader>
                <CardTitle className="text-lg">Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-2">We have branches across the region:</p>
                <ul className="space-y-1">
                  <li>• Headquarters</li>
                  <li>• City Branch</li>
                  <li>• North, South, East, and West Branches</li>
                </ul>
                <p className="mt-4 text-sm italic">
                  Contact us for specific locations and directions.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Man of God</CardTitle>
            <CardDescription className="text-center">
              Senior Pastor & Spiritual Leader
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl text-white font-bold">
              MOG
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our spiritual father is a man of God with a heart for souls and a passion for 
              seeing believers walk in their divine purpose. With years of ministry experience 
              and a powerful anointing, he leads our congregation with wisdom, love, and prophetic insight.
            </p>
            <Button 
              className="mt-4 bg-gradient-to-r from-primary to-purple-600"
              onClick={() => navigate("/contact")}
            >
              Contact Man of God
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutChurch;
