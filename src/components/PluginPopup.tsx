import { useState, useEffect } from "react";
import { Settings, Plus, MousePointerClick, Pause, Play, Globe, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [isDisabled, setIsDisabled] = useState(false);
  const [disabledReason, setDisabledReason] = useState<'site' | 'group' | 'both' | null>(null);
  const [siteName, setSiteName] = useState<string>("");
  const [groupName, setGroupName] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [timeUsed, setTimeUsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [opensUsed, setOpensUsed] = useState(0);
  const [opensLimit, setOpensLimit] = useState(0);
  const [pageType, setPageType] = useState<'normal' | 'timeout' | 'settings'>('normal');

  // Preset selection state
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number | null>(null);
  const [selectedOpensLimit, setSelectedOpensLimit] = useState<number | null>(null);

  // Group selection state
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<Record<string, unknown>[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Extend limit state
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(0);
  const [extendOpens, setExtendOpens] = useState(0);
  const [excuse, setExcuse] = useState("");
  const [isExtending, setIsExtending] = useState(false);
  const [extensionError, setExtensionError] = useState<string | null>(null);
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null);
  const [originalTimeLimit, setOriginalTimeLimit] = useState(0);
  const [originalOpensLimit, setOriginalOpensLimit] = useState(0);
  const [isExtended, setIsExtended] = useState(false);

  // Load current page info on mount
  useEffect(() => {
    const loadPageInfo = async () => {
      try {
        setIsLoading(true);
        const pageInfo = await api.getCurrentPageInfo();

        // Extract hostname from URL and detect extension pages
        try {
          const url = new URL(pageInfo.url);
          setCurrentUrl(pageInfo.url);

          // Detect extension pages
          if (pageInfo.url.includes('timeout.html') || pageInfo.url.includes('timeout/index.html')) {
            setSiteName('Timeout Page');
            setPageType('timeout');
            setIsLimited(false);

            // Extract params from URL
            const urlParams = new URLSearchParams(pageInfo.url.split('?')[1]);
            const extractedSiteId = urlParams.get('siteId');
            const extractedBlockedUrl = urlParams.get('blockedUrl');

            if (extractedSiteId) {
              setSiteId(extractedSiteId);
            }
            if (extractedBlockedUrl) {
              setBlockedUrl(extractedBlockedUrl);
            }

            return;
          }
          if (pageInfo.url.includes('settings.html') || pageInfo.url.includes('settings/index.html')) {
            setSiteName('Settings Page');
            setPageType('settings');
            setIsLimited(false);
            return;
          }

          setSiteName(url.hostname);
          setPageType('normal');
        } catch {
          setCurrentUrl(pageInfo.url);
          setSiteName(pageInfo.hostname || "unknown");
          setPageType('normal');
        }

        if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
          // Check if site/group is disabled
          const siteIsEnabled = pageInfo.siteInfo.isEnabled !== false;
          const groupIsEnabled = pageInfo.siteInfo.groupInfo ? pageInfo.siteInfo.groupInfo.isEnabled : true;

          const siteDisabled = !siteIsEnabled;
          const groupDisabled = !groupIsEnabled;

          setSiteId(pageInfo.siteInfo.id);
          setGroupId(pageInfo.siteInfo.groupId || null);
          setGroupName(pageInfo.siteInfo.groupId ? pageInfo.siteInfo.groupInfo?.name : null);

          // Determine disabled reason
          if (siteDisabled || groupDisabled) {
            setIsDisabled(true);
            if (siteDisabled && groupDisabled) {
              setDisabledReason('both');
            } else if (groupDisabled) {
              setDisabledReason('group');
            } else {
              setDisabledReason('site');
            }
            setIsLimited(false);
          } else {
            // Both enabled - show tracking info
            setIsDisabled(false);
            setDisabledReason(null);
            setIsLimited(true);

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
          }
        } else {
          setIsLimited(false);
          setIsDisabled(false);
          setDisabledReason(null);
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

  // When on timeout page with siteId, fetch the site limits to show original values
  useEffect(() => {
    if (pageType === 'timeout' && siteId) {
      const fetchSiteLimits = async () => {
        try {
          const sites = await api.getSites();
          const site = sites.find((s) => s.id === siteId);
          if (site) {
            setOriginalTimeLimit(site.timeLimit || 0);
            setOriginalOpensLimit(site.opensLimit || 0);
          }
        } catch (error) {
          console.error('Error fetching site limits:', error);
        }
      };
      fetchSiteLimits();
    }
  }, [pageType, siteId]);

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

  // Periodic update of remaining time on limited sites
  useEffect(() => {
    if (!isLimited) return;

    const updateInterval = setInterval(async () => {
      try {
        const pageInfo = await api.getCurrentPageInfo();
        if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
          const limitSeconds = pageInfo.siteInfo.dailyLimitSeconds || 0;
          const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
          const usedMinutes = Math.ceil((pageInfo.siteInfo.todaySeconds || 0) / 60);
          setTimeLimit(limitMinutes);
          setTimeUsed(usedMinutes);
        }
      } catch (error) {
        console.warn("Could not update time remaining:", error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(updateInterval);
  }, [isLimited]);

  const handleSelectTimeLimit = (minutes: number) => {
    setSelectedTimeLimit(selectedTimeLimit === minutes ? null : minutes);
  };

  const handleSelectOpensLimit = (opens: number) => {
    setSelectedOpensLimit(selectedOpensLimit === opens ? null : opens);
  };

  const handleAddLimit = async () => {
    if (!selectedTimeLimit && !selectedOpensLimit) {
      toast({
        title: "Error",
        description: "Please select at least one limit type",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      // Add site with both time and opens limits
      await api.addSite({
        name: siteName,
        timeLimit: selectedTimeLimit,
        opensLimit: selectedOpensLimit,
      });

      toast({
        title: "Success",
        description: `Limit added for ${siteName}`,
      });

      // Reset selection
      setSelectedTimeLimit(null);
      setSelectedOpensLimit(null);

      // Refresh page info
      const pageInfo = await api.getCurrentPageInfo();
      if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
        setIsLimited(true);
        const limitSeconds = pageInfo.siteInfo.dailyLimitSeconds || 0;
        const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
        const usedMinutes = Math.ceil((pageInfo.siteInfo.todaySeconds || 0) / 60);
        setTimeLimit(limitMinutes);
        setTimeUsed(usedMinutes);
        setOpensLimit(pageInfo.siteInfo.dailyOpenLimit || 0);
        setOpensUsed(pageInfo.siteInfo.todayOpenCount || 0);
      }
    } catch (error) {
      console.error("Error adding limit:", error);
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

  const handleTurnOnSite = async () => {
    if (!siteId) return;
    try {
      setIsSaving(true);

      // Enable site if it's disabled
      if (disabledReason === 'site' || disabledReason === 'both') {
        await api.updateSite(siteId, { isEnabled: true });
      }

      // Enable group if it's disabled
      if ((disabledReason === 'group' || disabledReason === 'both') && groupId) {
        await api.updateGroup(groupId, { isEnabled: true });
      }

      setIsDisabled(false);
      setDisabledReason(null);
      setIsLimited(true);

      toast({
        title: "Success",
        description: "Tracking enabled",
      });

      // Refresh page info to show tracking details
      const pageInfo = await api.getCurrentPageInfo();
      if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
        const siteEnabled = pageInfo.siteInfo.isEnabled !== false;
        const groupEnabled = pageInfo.siteInfo.groupInfo ? pageInfo.siteInfo.groupInfo.isEnabled : true;

        if (siteEnabled && groupEnabled) {
          const limitSeconds = pageInfo.siteInfo.dailyLimitSeconds || 0;
          const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
          const usedMinutes = Math.ceil((pageInfo.siteInfo.todaySeconds || 0) / 60);
          setTimeLimit(limitMinutes);
          setTimeUsed(usedMinutes);
          setOpensLimit(pageInfo.siteInfo.dailyOpenLimit || 0);
          setOpensUsed(pageInfo.siteInfo.todayOpenCount || 0);
        }
      }
    } catch (error) {
      console.error("Error enabling tracking:", error);
      toast({
        title: "Error",
        description: "Failed to enable tracking",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openGroupSelector = async () => {
    try {
      setIsLoadingGroups(true);
      const groups = await api.getGroups();
      setAvailableGroups(groups);
      setShowGroupSelector(true);
    } catch (error) {
      console.error("Error loading groups:", error);
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleAddToGroup = async (groupId: string) => {
    try {
      setIsSaving(true);
      let siteToadd = siteId;

      // If site doesn't exist yet (not limited), create it first
      if (!siteId) {
        const newSite = await api.addSite({
          name: siteName,
          // Don't set any limits, just add the site
        });
        siteToadd = newSite.id;
      }

      // Add site to group
      await api.addSiteToGroup(groupId, siteToadd);

      toast({
        title: "Success",
        description: `Site added to group successfully`,
      });

      // Refresh page info
      const pageInfo = await api.getCurrentPageInfo();
      if (pageInfo.isDistractingSite && pageInfo.siteInfo) {
        setIsLimited(true);
        setGroupName(pageInfo.siteInfo.groupId ? "Group" : null);
        setGroupId(pageInfo.siteInfo.groupId || null);
        setSiteId(pageInfo.siteInfo.id);
        const limitSeconds = pageInfo.siteInfo.dailyLimitSeconds || 0;
        const limitMinutes = limitSeconds > 0 ? Math.ceil(limitSeconds / 60) : 0;
        const usedMinutes = Math.ceil((pageInfo.siteInfo.todaySeconds || 0) / 60);
        setTimeLimit(limitMinutes);
        setTimeUsed(usedMinutes);
        setOpensLimit(pageInfo.siteInfo.dailyOpenLimit || 0);
        setOpensUsed(pageInfo.siteInfo.todayOpenCount || 0);
      }

      setShowGroupSelector(false);
      setSelectedTimeLimit(null);
      setSelectedOpensLimit(null);
    } catch (error) {
      console.error("Error adding site to group:", error);
      toast({
        title: "Error",
        description: "Failed to add site to group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExtendLimit = async () => {
    if (excuse.length < 35) {
      setExtensionError("Excuse must be at least 35 characters");
      return;
    }
    if (extendMinutes <= 0 && extendOpens <= 0) {
      setExtensionError("Must extend either time or opens");
      return;
    }

    try {
      setIsExtending(true);
      setExtensionError(null);

      if (!siteId) {
        setExtensionError("Site ID not found");
        return;
      }

      await api.extendLimit(siteId, extendMinutes, extendOpens, excuse);

      toast({
        title: "Success",
        description: "Limit extended! Redirecting...",
      });

      // Reset form
      setShowExtendForm(false);
      setExtendMinutes(0);
      setExtendOpens(0);
      setExcuse("");
      setIsExtended(true);

      // Navigate back to original site if we have the URL
      if (blockedUrl) {
        setTimeout(() => {
          browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            if (tabs[0]) {
              browser.tabs.update(tabs[0].id, { url: decodeURIComponent(blockedUrl) });
            }
          });
        }, 500);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setExtensionError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsExtending(false);
    }
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

  // Show UI for disabled sites/groups (turn-on option)
  if (isDisabled && siteId) {
    const getMessage = () => {
      if (disabledReason === 'both') {
        return `Tracking is paused for this site and its group. Click below to turn it back on.`;
      } else if (disabledReason === 'group') {
        return `Tracking is paused for the group this site belongs to. Click below to enable it.`;
      } else {
        return `Tracking is paused for this site. Click below to turn it back on.`;
      }
    };

    const getLabel = () => {
      if (disabledReason === 'group') {
        return `${groupName} (disabled)`;
      } else if (disabledReason === 'both') {
        return `${siteName} (disabled)`;
      } else {
        return 'Disabled';
      }
    };

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
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Pause size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">{siteName}</p>
              <p className="text-sm text-muted-foreground">{getLabel()}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-5">
            {getMessage()}
          </p>

          <Button
            className="w-full rounded-xl"
            onClick={handleTurnOnSite}
            disabled={isSaving}
          >
            <Play size={16} className="mr-2" />
            Turn on tracking
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isLimited) {
    if (pageType === 'timeout') {
      const newTimeLimit = originalTimeLimit + extendMinutes;
      const newOpensLimit = originalOpensLimit + extendOpens;

      return (
        <Card className="w-80 shadow-soft border-0 overflow-hidden">
          <div className="gradient-mint p-4">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <Button variant="ghost" size="icon" onClick={handleOpenSettings}>
                <Settings size={18} />
              </Button>
            </div>
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="font-medium">Timeout Page</p>
                <p className="text-sm text-muted-foreground">
                  {showExtendForm || isExtended ? 'Extension Mode' : 'Limit reached'}
                </p>
              </div>
            </div>

            {!showExtendForm && !isExtended && (
              <p className="text-sm text-muted-foreground mb-4">
                You've reached a limit. Take a break and come back later.
              </p>
            )}

            {/* Extend Limits Section */}
            {siteId && (
              <div className="border-t pt-4">
                {!showExtendForm ? (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => setShowExtendForm(true)}
                  >
                    Extend Limits
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Extend your limit</p>

                    {/* Show original limits and preview of new limits */}
                    {(originalTimeLimit > 0 || originalOpensLimit > 0) && (
                      <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                        {originalTimeLimit > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Time limit:</span>
                            <span className="font-medium">
                              {originalTimeLimit} <span className="text-muted-foreground text-[10px]">min</span>
                              {extendMinutes > 0 && (
                                <> → {newTimeLimit} <span className="text-muted-foreground text-[10px]">min</span></>
                              )}
                            </span>
                          </div>
                        )}
                        {originalOpensLimit > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Open limit:</span>
                            <span className="font-medium">
                              {originalOpensLimit} <span className="text-muted-foreground text-[10px]">opens</span>
                              {extendOpens > 0 && (
                                <> → {newOpensLimit} <span className="text-muted-foreground text-[10px]">opens</span></>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Extra minutes */}
                    <div>
                      <label className="text-xs text-muted-foreground">Extra minutes (0-60)</label>
                      <Input
                        type="number"
                        min={0}
                        max={60}
                        value={extendMinutes}
                        onChange={(e) => setExtendMinutes(parseInt(e.target.value) || 0)}
                        disabled={isExtending}
                        className="rounded-xl"
                      />
                    </div>

                    {/* Extra opens */}
                    <div>
                      <label className="text-xs text-muted-foreground">Extra opens (0-10)</label>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={extendOpens}
                        onChange={(e) => setExtendOpens(parseInt(e.target.value) || 0)}
                        disabled={isExtending}
                        className="rounded-xl"
                      />
                    </div>

                    {/* Excuse */}
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Why do you need more time?
                      </label>
                      <Textarea
                        value={excuse}
                        onChange={(e) => setExcuse(e.target.value)}
                        placeholder="Explain why you need to extend this limit..."
                        disabled={isExtending}
                        className="min-h-[60px] rounded-xl"
                      />
                      <p className={`text-xs mt-1 ${excuse.length >= 35 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {excuse.length}/35 characters
                      </p>
                    </div>

                    {/* Error */}
                    {extensionError && (
                      <p className="text-xs text-red-600">{extensionError}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowExtendForm(false);
                          setExtensionError(null);
                        }}
                        disabled={isExtending}
                        className="flex-1 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleExtendLimit}
                        disabled={isExtending || excuse.length < 35 || (extendMinutes <= 0 && extendOpens <= 0)}
                        className="flex-1 rounded-xl"
                      >
                        {isExtending ? "Extending..." : "Extend"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    if (pageType === 'settings') {
      return (
        <Card className="w-80 shadow-soft border-0 overflow-hidden">
          <div className="gradient-mint p-4">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <Button variant="ghost" size="icon" onClick={handleOpenSettings}>
                <Settings size={18} />
              </Button>
            </div>
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Settings size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Settings Page</p>
                <p className="text-sm text-muted-foreground">Manage limits</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure your limits, groups, and messages here.
            </p>
          </CardContent>
        </Card>
      );
    }

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

          <p className="text-sm text-muted-foreground mb-5">
            Add limits to stay mindful while browsing this site.
          </p>

          <div className="space-y-4">
            {/* Time limit presets */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Time limit
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 60].map((minutes) => (
                  <Button
                    key={minutes}
                    variant={selectedTimeLimit === minutes ? "default" : "outline"}
                    size="sm"
                    className={`rounded-xl ${
                      selectedTimeLimit === minutes
                        ? ""
                        : "border-primary/30 hover:bg-primary/10 hover:border-primary"
                    }`}
                    onClick={() => handleSelectTimeLimit(minutes)}
                    disabled={isSaving}
                  >
                    {minutes === 60 ? "1h" : `${minutes}m`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Opens limit presets */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Opens limit
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20].map((opens) => (
                  <Button
                    key={opens}
                    variant={selectedOpensLimit === opens ? "default" : "outline"}
                    size="sm"
                    className={`rounded-xl ${
                      selectedOpensLimit === opens
                        ? ""
                        : "border-primary/30 hover:bg-primary/10 hover:border-primary"
                    }`}
                    onClick={() => handleSelectOpensLimit(opens)}
                    disabled={isSaving}
                  >
                    {opens}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add limit button */}
            <Button
              className="w-full rounded-xl"
              size="sm"
              onClick={handleAddLimit}
              disabled={isSaving || (!selectedTimeLimit && !selectedOpensLimit)}
            >
              <Plus size={14} className="mr-1.5" />
              Add limit
            </Button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
              <div className="relative flex justify-center">
                <span className="px-2 bg-card text-xs text-muted-foreground">or</span>
              </div>
            </div>

            {/* Add to group button */}
            {showGroupSelector ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Select a group
                </p>
                {isLoadingGroups ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                ) : availableGroups.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableGroups.map((group) => (
                      <Button
                        key={group.id}
                        variant="outline"
                        className="w-full rounded-xl justify-start"
                        size="sm"
                        onClick={() => handleAddToGroup(group.id)}
                        disabled={isSaving}
                      >
                        <div className={`w-2 h-2 rounded-full ${group.color} mr-2`} />
                        {group.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No groups available. Create one in settings.
                  </p>
                )}
                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-xs"
                  size="sm"
                  onClick={() => setShowGroupSelector(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full rounded-xl"
                size="sm"
                onClick={openGroupSelector}
                disabled={isSaving}
              >
                <Plus size={14} className="mr-1.5" />
                Add to group
              </Button>
            )}
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

      </CardContent>
    </Card>
  );
};

export default PluginPopup;
