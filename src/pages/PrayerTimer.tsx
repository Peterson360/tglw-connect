import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const PrayerTimer = () => {
  const navigate = useNavigate();
  const [targetMinutes, setTargetMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          if (newSeconds === targetMinutes * 60) {
            setIsRunning(false);
            playBeep();
            toast.success("🙏 Prayer time complete! Well done!");
          }
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, targetMinutes]);

  const playBeep = () => {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / (targetMinutes * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Prayer Timer</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Prayer in Tongues</CardTitle>
            <CardDescription>Set your target time and begin praying</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="minutes">Target Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="1"
                max="120"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(Number(e.target.value))}
                disabled={isRunning}
                className="h-12 text-lg text-center"
              />
            </div>

            <div className="relative">
              <div className="mx-auto w-64 h-64 rounded-full border-8 border-secondary flex items-center justify-center relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-primary to-purple-600 transition-all duration-1000"
                  style={{ 
                    transform: `translateY(${100 - progress}%)`,
                    opacity: 0.2
                  }}
                />
                <div className="relative z-10 text-center">
                  <div className="text-5xl font-bold text-foreground mb-2">
                    {formatTime(seconds)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target: {targetMinutes} min
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={toggleTimer}
                className="w-32 bg-gradient-to-r from-primary to-purple-600"
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
                className="w-32"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground italic">
              "For anyone who speaks in a tongue does not speak to people but to God." - 1 Corinthians 14:2
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PrayerTimer;
