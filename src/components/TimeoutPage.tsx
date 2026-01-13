import { useState, useEffect } from "react";
import { BookOpen, Droplets, TreePine, Phone, Brain, Coffee, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "./Logo";

const suggestions = [
  {
    icon: BookOpen,
    title: "Read a book",
    description: "Dive into that novel you've been meaning to start",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Droplets,
    title: "Drink water",
    description: "Stay hydrated! Your body will thank you",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: TreePine,
    title: "Take a walk",
    description: "Get some fresh air and clear your mind",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Phone,
    title: "Call someone",
    description: "Connect with a friend or family member",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Brain,
    title: "Meditate",
    description: "5 minutes of mindfulness can reset your focus",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Coffee,
    title: "Take a break",
    description: "Stretch, make tea, and rest your eyes",
    color: "bg-orange-100 text-orange-600",
  },
];

const quotes = [
  "Take a deep breath and go for a short walk 🚶",
  "How about reading that book you've been meaning to start? 📚",
  "Drink some water and stretch your body 💧",
  "Call a friend or family member you haven't talked to in a while 📱",
  "Try 5 minutes of meditation to clear your mind 🧘",
];

interface TimeoutPageProps {
  siteName?: string;
  groupName?: string;
  resetTime?: string;
  limitType?: "time" | "opens";
}

const TimeoutPage = ({
  siteName = "facebook.com",
  groupName = "Social Media",
  resetTime = "12:00 AM",
  limitType = "time",
}: TimeoutPageProps) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [breatheIn, setBreatheIn] = useState(true);

  useEffect(() => {
    // Breathing animation
    const breatheInterval = setInterval(() => {
      setBreatheIn((prev) => !prev);
    }, 4000);

    return () => clearInterval(breatheInterval);
  }, []);

  const nextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  const visibleSuggestions = [
    suggestions[currentSuggestion],
    suggestions[(currentSuggestion + 1) % suggestions.length],
    suggestions[(currentSuggestion + 2) % suggestions.length],
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <Logo size="sm" />
        </div>

        {/* Breathing circle */}
        <div className="mb-8">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${
              breatheIn ? "scale-100" : "scale-75"
            }`}
          >
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-primary/60 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${
                breatheIn ? "scale-100" : "scale-75"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full bg-primary shadow-glow flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${
                  breatheIn ? "scale-100" : "scale-75"
                }`}
              >
                <span className="text-primary-foreground text-xs font-medium">
                  {breatheIn ? "Breathe" : "Out"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Time's up message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Time for a break
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            You've reached your {limitType === "time" ? "time" : "opens"} limit for{" "}
            <span className="font-semibold text-primary">{groupName}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Including {siteName} • Resets at {resetTime}
          </p>
        </div>

        {/* Quote card */}
        <Card className="max-w-xl w-full shadow-soft border-0 bg-white/80 backdrop-blur mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
              "{quotes[currentQuote]}"
            </p>
            {/* Quote dots */}
            <div className="flex justify-center gap-2 mt-6">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentQuote
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggestions carousel */}
        <div className="w-full max-w-3xl">
          <p className="text-center text-muted-foreground mb-4 font-medium">
            What you could do instead...
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSuggestion}
              className="shrink-0 rounded-full"
            >
              <ChevronLeft size={24} />
            </Button>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibleSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <Card
                    key={`${suggestion.title}-${index}`}
                    className="border-0 shadow-soft bg-white/80 backdrop-blur hover:scale-105 transition-transform cursor-pointer"
                  >
                    <CardContent className="p-5 text-center">
                      <div
                        className={`w-14 h-14 rounded-2xl ${suggestion.color} flex items-center justify-center mx-auto mb-3`}
                      >
                        <Icon size={28} />
                      </div>
                      <h3 className="font-semibold mb-1">{suggestion.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSuggestion}
              className="shrink-0 rounded-full"
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-sm text-muted-foreground">
          Stay mindful. You've got this! 🌱
        </p>
      </div>
    </div>
  );
};

export default TimeoutPage;
