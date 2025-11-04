import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrayerTimer from "./pages/PrayerTimer";
import PrayerRequest from "./pages/PrayerRequest";
import Menu from "./pages/Menu";
import AboutChurch from "./pages/AboutChurch";
import Contact from "./pages/Contact";
import AboutDeveloper from "./pages/AboutDeveloper";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("tglw_user");
    setIsAuthenticated(!!user);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prayer-timer" element={<PrayerTimer />} />
            <Route path="/prayer-request" element={<PrayerRequest />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about-church" element={<AboutChurch />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about-developer" element={<AboutDeveloper />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
