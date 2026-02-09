import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";
import PluginPopup from "@/components/PluginPopup";
import SettingsPage from "@/components/SettingsPage";
import TimeoutPage from "@/components/TimeoutPage";

const Index = () => {
  const [popupVariant, setPopupVariant] = useState<"limited" | "unlimited">("limited");

  return (
    <div className="min-h-screen gradient-calm">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Browser Extension UI Design
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A soft, friendly design system for mindful browsing. Explore all the screens below.
          </p>
        </div>

        {/* Screen Showcase */}
        <Tabs defaultValue="popup" className="space-y-8">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 rounded-2xl p-1.5 bg-white shadow-soft">
            <TabsTrigger value="popup" className="rounded-xl data-[state=active]:shadow-sm">
              Popup
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:shadow-sm">
              Settings
            </TabsTrigger>
            <TabsTrigger value="timeout" className="rounded-xl data-[state=active]:shadow-sm">
              Timeout
            </TabsTrigger>
          </TabsList>

          {/* Popup Tab */}
          <TabsContent value="popup" className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Plugin Popup</h2>
              <p className="text-muted-foreground mb-6">
                Shown when clicking the extension icon in the browser toolbar
              </p>
              
              {/* Toggle between variants */}
              <div className="flex justify-center gap-3 mb-8">
                <button
                  onClick={() => setPopupVariant("limited")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    popupVariant === "limited"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  On Limited Site
                </button>
                <button
                  onClick={() => setPopupVariant("unlimited")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    popupVariant === "unlimited"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  On Unlimited Site
                </button>
              </div>
            </div>

            {/* Popup preview in browser mockup */}
            <div className="flex justify-center">
              <div className="relative">
                  <PluginPopup 
                    isLimited={popupVariant === "limited"}
                    siteName="facebook.com"
                    groupName="Social Media"
                    timeUsed={8}
                    timeLimit={15}
                    opensUsed={3}
                    opensLimit={10}
                  />
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Settings Page</h2>
              <p className="text-muted-foreground">
                Full settings page for managing all limits and groups
              </p>
            </div>
            
            <Card className="overflow-hidden rounded-3xl shadow-soft border-0">
              <div className="max-h-[700px] overflow-y-auto">
                <SettingsPage />
              </div>
            </Card>
          </TabsContent>

          {/* Timeout Tab */}
          <TabsContent value="timeout">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Timeout Screen</h2>
              <p className="text-muted-foreground">
                Shown when a time or opens limit is reached
              </p>
            </div>
            
            <Card className="overflow-hidden rounded-3xl shadow-soft border-0">
              <div className="h-[700px] overflow-y-auto">
                <TimeoutPage 
                  siteName="facebook.com"
                  groupName="Social Media"
                  resetTime="12:00 AM"
                  limitType="time"
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logo Variants */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-semibold text-center mb-8">Logo Variants</h2>
          <div className="flex flex-wrap justify-center items-end gap-12">
            <div className="text-center">
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground mt-3">Small</p>
            </div>
            <div className="text-center">
              <Logo size="md" />
              <p className="text-sm text-muted-foreground mt-3">Medium</p>
            </div>
            <div className="text-center">
              <Logo size="lg" />
              <p className="text-sm text-muted-foreground mt-3">Large</p>
            </div>
            <div className="text-center">
              <Logo size="md" showText={false} />
              <p className="text-sm text-muted-foreground mt-3">Icon only</p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-semibold text-center mb-8">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="h-20 rounded-2xl bg-primary shadow-soft" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">Mint Green</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-2xl bg-secondary shadow-soft" />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">Light Sage</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-2xl bg-accent shadow-soft" />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">Soft Mint</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-2xl bg-muted shadow-soft" />
              <p className="text-sm font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">Cream</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-2xl bg-foreground shadow-soft" />
              <p className="text-sm font-medium">Foreground</p>
              <p className="text-xs text-muted-foreground">Dark Green</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
