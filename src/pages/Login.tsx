import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/tglw-logo.png";

const churches = [
  "Headquarters",
  "City Branch",
  "North Branch",
  "South Branch",
  "East Branch",
  "West Branch",
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [churchBranch, setChurchBranch] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !churchBranch) {
      toast.error("Please fill in all fields");
      return;
    }

    localStorage.setItem("tglw_user", JSON.stringify({ username, churchBranch }));
    toast.success(`Welcome, ${username}!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary to-background">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center space-y-4">
          <img src={logo} alt="TGLW Global" className="w-20 h-20 mx-auto" />
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to TGLW Global
          </CardTitle>
          <CardDescription className="text-base">
            Enter your details to begin your spiritual journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="church">Church Branch</Label>
              <Select value={churchBranch} onValueChange={setChurchBranch}>
                <SelectTrigger id="church" className="h-12">
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent>
                  {churches.map((church) => (
                    <SelectItem key={church} value={church}>
                      {church}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
