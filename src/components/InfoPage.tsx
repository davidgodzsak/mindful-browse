import {
  Clock,
  Leaf,
  Lock,
  Heart,
  ExternalLink,
  Bug,
  MessageCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "./Logo";

const InfoPage = () => {
  const handleOpenSettings = () => {
    browser.runtime.openOptionsPage().catch(() => {
      // Fallback: open settings page directly
      browser.tabs.create({
        url: browser.runtime.getURL("ui/settings/settings.html"),
      });
    });
  };

  const values = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Stay aware of how you spend your online time and reclaim your focus",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Leaf,
      title: "Be Mindful",
      description: "Build healthier browsing habits with gentle, non-judgmental limits",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Everything stays on your device. No tracking, no data collection, no servers",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Heart,
      title: "Free Forever",
      description: "No ads, no paywalls. We believe in making the internet healthier for everyone",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const donations = [
    {
      name: "Stripe",
      icon: "$",
      link: "https://donate.stripe.com/",
      description: "One-time or recurring donations",
    },
    {
      name: "PayPal",
      icon: "P",
      link: "https://paypal.me/",
      description: "Fast and secure",
    },
    {
      name: "Buy Me a Coffee",
      icon: "☕",
      link: "https://buymeacoffee.com/",
      description: "Support our work",
    },
    {
      name: "Patreon",
      icon: "P",
      link: "https://patreon.com/",
      description: "Become a patron",
    },
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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
          </div>
          <Badge variant="secondary" className="bg-white/30 backdrop-blur">
            v1.2.1
          </Badge>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Intro section */}
          <div className="max-w-2xl w-full text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Reclaim Your Focus
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              A simple, privacy-first browser extension that helps you build healthier browsing habits.
              Set limits on the sites that distract you, get gentle reminders when you need a break,
              and stay mindful about how you spend your online time.
            </p>
          </div>

          {/* Values grid */}
          <div className="max-w-4xl w-full mb-16">
            <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
              What You Get
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={value.title}
                    className="border-0 shadow-soft bg-white/80 backdrop-blur hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-2xl ${value.color} flex items-center justify-center mb-4`}
                      >
                        <Icon size={24} />
                      </div>
                      <h4 className="font-semibold text-lg text-foreground mb-2">
                        {value.title}
                      </h4>
                      <p className="text-sm text-foreground/70">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Setup section */}
          <div className="max-w-2xl w-full mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Ready to Get Started?
              </h3>
              <p className="text-sm text-foreground/70 mb-6">
                Open settings to add your first site limits and customize your experience to match your goals.
              </p>
              <Button
                onClick={handleOpenSettings}
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 gap-2 px-8 py-6 text-base"
              >
                <Settings size={20} />
                Go to Settings
              </Button>
            </div>
          </div>

          {/* Donation section */}
          <div className="max-w-2xl w-full mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Support This Project
              </h3>
              <p className="text-foreground/70">
                If you find this extension helpful, please consider supporting its development.
                Your donation helps us keep it free, ad-free, and open-source for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donations.map((donation) => (
                <a
                  key={donation.name}
                  href={donation.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="border-0 shadow-soft bg-white/80 backdrop-blur hover:shadow-lg hover:scale-105 transition-all cursor-pointer h-full">
                    <CardContent className="p-5 text-center flex flex-col items-center justify-center h-full">
                      <div className="text-3xl mb-3 font-bold text-primary">
                        {donation.icon}
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {donation.name}
                      </h4>
                      <p className="text-sm text-foreground/60 mb-3">
                        {donation.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary text-sm font-medium">
                        Visit <ExternalLink size={14} />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Links section */}
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Have Feedback?
              </h3>
              <p className="text-foreground/70 mb-6">
                Found a bug or have a feature request? We'd love to hear from you!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/davidgodzsak/firefox-timelimit-extension/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full gap-2 border-foreground/20 hover:bg-white/50"
                >
                  <Bug size={18} />
                  Report an Issue
                </Button>
              </a>
              <a
                href="https://github.com/davidgodzsak/firefox-timelimit-extension/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full gap-2 border-foreground/20 hover:bg-white/50"
                >
                  <MessageCircle size={18} />
                  Feature Request
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-white/20 text-sm text-foreground/60">
          <p>
            Made with <span className="text-red-500">❤️</span> to help you stay focused
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
