import { useState, useEffect } from "react";
import { Settings, Plus, Clock, MousePointerClick, Pause, Play, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Logo from "./Logo";
import CircularProgress from "./CircularProgress";
import * as api from "@/lib/api";
import { useBroadcastUpdates } from "@/hooks/useBroadcastUpdates";

const PluginPopup = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Current page data
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isLimited, setIsLimited] = useState(false);
  const [siteName, setSiteName] = useState<string>("");
  const [groupName, setGroupName] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [timeUsed, setTimeUsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [opensUsed, setOpensUsed] = useState(0);
  const [opensLimit, setOpensLimit] = useState(0);

  // Load current page info on mount
  useEffect(() => {
    const loadPageInfo = async () => {
      try {
        setIsLoading(true);
        const pageInfo = await api.getCurrentPageInfo();

        // Extract hostname from URL
        try {
          const url = new URL(pageInfo.url);
          setCurrentUrl(pageInfo.url);
          setSiteName(url.hostname);
        } catch {
          setCurrentUrl(pageInfo.url);
          setSiteName(pageInfo.hostname || "unknown");
        }

        if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
          setIsLimited(true);
          setGroupName(pageInfo.siteInfo.groupId ? "Group" : null);
          setSiteId(pageInfo.siteInfo.id);
          setGroupId(pageInfo.siteInfo.groupId || null);

          // Convert seconds to minutes (handle undefined)
          const limitSeconds = pageInfo.siteInfo.dailyLimitSeconds || 0;
          const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
          const usedMinutes = Math.ceil(
            (pageInfo.siteInfo.todaySeconds || 0) / 60
          );

          setTimeLimit(limitMinutes);
          setTimeUsed(usedMinutes);
          setOpensLimit(pageInfo.siteInfo.dailyOpenLimit || 0);
          setOpensUsed(pageInfo.siteInfo.todayOpenCount || 0);
        } else {
          setIsLimited(false);
        }
      } catch (error) {
        console.error("Error loading page info:", error);
        toast({
          title: "Error",
          description: "Failed to load page information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPageInfo();
  }, [toast]);

  // Listen for real-time updates
  useBroadcastUpdates({
    siteAdded: () => {
      // Refresh page data when new site is added (might be current site)
      setIsLoading(true);
      api.getCurrentPageInfo().then((pageInfo) => {
        if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
          setIsLimited(true);
          const limitSeconds = pageInfo.siteInfo.dailyLimitSeconds || 0;
          const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
          const usedMinutes = Math.ceil((pageInfo.siteInfo.todaySeconds || 0) / 60);
          setTimeLimit(limitMinutes);
          setTimeUsed(usedMinutes);
        }
        setIsLoading(false);
      });
    },
    siteUpdated: (data) => {
      if (siteId && data.site.id === siteId) {
        const limitSeconds = data.site.dailyLimitSeconds || 0;
        const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
        setTimeLimit(limitMinutes);
      }
    },
  });

  const handleQuickLimit = async (minutes: number) => {
    try {
      setIsSaving(true);
      await api.addQuickLimit(siteName, minutes * 60);
      toast({
        title: "Success",
        description: `${minutes} minute limit added for ${siteName}`,
      });
      // Refresh page info
      const pageInfo = await api.getCurrentPageInfo();
      if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
        setIsLimited(true);
        const limitSeconds = pageInfo.siteInfo.dailyLimitSeconds || 0;
        const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
        const usedMinutes = Math.ceil((pageInfo.siteInfo.todaySeconds || 0) / 60);
        setTimeLimit(limitMinutes);
        setTimeUsed(usedMinutes);
      }
    } catch (error) {
      console.error("Error adding quick limit:", error);
      toast({
        title: "Error",
        description: "Failed to add limit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenSettings = () => {
    browser.runtime.openOptionsPage().catch(() => {
      // Fallback: open settings page directly
      browser.tabs.create({
        url: browser.runtime.getURL("ui/settings/settings.html"),
      });
    });
  };

  const timeRemaining = Math.max(0, timeLimit - timeUsed);
  const opensRemaining = opensLimit > 0 ? Math.max(0, opensLimit - opensUsed) : 0;

  if (isLoading) {
    return (
      <Card className="w-80 shadow-soft border-0 overflow-hidden">
        <div className="gradient-mint p-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <Button variant="ghost" size="icon" className="hover:bg-white/50">
              <Settings size={18} />
            </Button>
          </div>
        </div>
        <CardContent className="p-5 flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLimited) {
    return (
      <Card className="w-80 shadow-soft border-0 overflow-hidden">
        <div className="gradient-mint p-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenSettings}
              className="hover:bg-white/50"
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Globe size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{siteName}</p>
              <p className="text-sm text-muted-foreground">Not tracked</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Add limits to stay mindful while browsing this site.
          </p>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Quick presets
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((minutes) => (
                <Button
                  key={minutes}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-primary/30 hover:bg-primary/10 hover:border-primary"
                  onClick={() => handleQuickLimit(minutes)}
                  disabled={isSaving}
                >
                  {minutes === 60 ? "1 hour" : `${minutes} min`}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                className="rounded-xl"
                size="sm"
                onClick={() => handleQuickLimit(30)}
                disabled={isSaving}
              >
                <Clock size={14} className="mr-1.5" />
                Time limit
              </Button>
              <Button
                variant="secondary"
                className="rounded-xl"
                size="sm"
                disabled={true}
              >
                <MousePointerClick size={14} className="mr-1.5" />
                Opens limit
              </Button>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full rounded-xl border-dashed"
                size="sm"
                disabled={true}
              >
                <Plus size={14} className="mr-1.5" />
                Add to group
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 shadow-soft border-0 overflow-hidden">
      {/* Header */}
      <div className="gradient-mint p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenSettings}
            className="hover:bg-white/50"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Site info */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <span className="text-lg">📘</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{siteName}</p>
            {groupName && (
              <p className="text-sm text-primary font-medium">{groupName}</p>
            )}
          </div>
        </div>

        {/* Circular progress */}
        <div className="flex justify-center mb-5">
          <CircularProgress
            value={timeUsed}
            max={timeLimit}
            size={140}
            strokeWidth={10}
          >
            <span className="text-3xl font-bold text-foreground">
              {timeRemaining}
            </span>
            <span className="text-sm text-muted-foreground">min left</span>
          </CircularProgress>
        </div>

        {/* Opens counter */}
        {opensLimit > 0 && (
          <div className="bg-muted/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MousePointerClick size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Opens today</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {opensUsed} / {opensLimit}
              </span>
            </div>
            <Progress
              value={(opensUsed / opensLimit) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {opensRemaining} opens remaining
            </p>
          </div>
        )}

        {/* Settings button */}
        <Button
          variant="outline"
          className="w-full rounded-xl"
          onClick={handleOpenSettings}
          disabled={isSaving}
        >
          <Settings size={16} className="mr-2" />
          Open settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default PluginPopup;
