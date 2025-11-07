import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DevotionalGallery = () => {
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeeklyDevotionals();
  }, []);

  const fetchWeeklyDevotionals = async () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data } = await supabase
      .from("devotionals")
      .select("*")
      .gte("date", weekAgo.toISOString().split("T")[0])
      .order("date", { ascending: false })
      .limit(7);

    if (data) setDevotionals(data);
  };

  if (devotionals.length === 0) return null;

  return (
    <Card className="backdrop-blur-xl bg-card/80 border border-primary/20 shadow-2xl overflow-hidden animate-fade-in">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calendar className="h-6 w-6 text-primary" />
          This Week's Devotionals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {devotionals.map((devotional) => (
            <div
              key={devotional.id}
              className="group cursor-pointer relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => navigate(`/devotional/${devotional.id}`)}
            >
              <div className="aspect-square relative">
                <img
                  src={devotional.image_url}
                  alt={devotional.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-semibold line-clamp-2">{devotional.title}</p>
                  <p className="text-xs opacity-80 mt-1">
                    {new Date(devotional.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevotionalGallery;
