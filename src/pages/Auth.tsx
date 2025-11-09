import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, User } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (roleData?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Check if user is admin
        if (data.user) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (roleData?.role === "admin") {
            toast({
              title: "Welcome back, Admin!",
              description: "Redirecting to admin panel.",
            });
            navigate("/admin");
          } else {
            toast({
              title: "Welcome back!",
              description: "Successfully logged in.",
            });
            navigate("/dashboard");
          }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              username: username,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "You can now log in.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/spiritual-bg.jpg')] bg-cover bg-center opacity-5" />
      
      <Card className="w-full max-w-md backdrop-blur-xl bg-card/80 border border-primary/20 shadow-2xl relative z-10 animate-fade-in">
        <CardHeader className="space-y-3 pb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Join TGLW"}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isLogin ? "Sign in to continue your spiritual journey" : "Create your account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="pl-10 h-12 backdrop-blur-sm bg-background/60 border-primary/20 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 backdrop-blur-sm bg-background/60 border-primary/20 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-12 backdrop-blur-sm bg-background/60 border-primary/20 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Please wait...
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full h-12 border border-primary/20 hover:bg-primary/5"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
                setUsername("");
              }}
            >
              {isLogin ? "Create new account" : "Sign in instead"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
