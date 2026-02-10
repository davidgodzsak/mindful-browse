import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Clock,
  MousePointerClick,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Quote,
  Settings2,
  GripVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Logo from "./Logo";
import AddSiteDialog from "./settings/AddSiteDialog";
import CreateGroupDialog from "./settings/CreateGroupDialog";
import AddSiteToGroupDialog from "./settings/AddSiteToGroupDialog";
import * as api from "@/lib/api";
import { useBroadcastUpdates } from "@/hooks/useBroadcastUpdates";

interface Site {
  id: string;
  name: string;
  favicon: string;
  timeLimit?: number;
  opensLimit?: number;
  isEnabled?: boolean;
}

interface Group {
  id: string;
  name: string;
  color: string;
  timeLimit: number;
  opensLimit: number;
  sites: Site[];
  expanded?: boolean;
  isEnabled?: boolean;
}

const getFaviconEmoji = (siteName: string): string => {
  const emojiMap: Record<string, string> = {
    "facebook.com": "📘",
    "instagram.com": "📸",
    "twitter.com": "🐦",
    "reddit.com": "🤖",
    "youtube.com": "▶️",
    "netflix.com": "🎬",
    "twitch.tv": "💜",
    "tiktok.com": "🎵",
    "linkedin.com": "💼",
    "pinterest.com": "📌",
    "snapchat.com": "👻",
  };
  return emojiMap[siteName.toLowerCase()] || "🌐";
};

const SettingsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [addSiteDialogOpen, setAddSiteDialogOpen] = useState(false);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [addToGroupDialogOpen, setAddToGroupDialogOpen] = useState(false);
  const [selectedGroupForAdd, setSelectedGroupForAdd] = useState<Group | null>(null);
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<Group | null>(null);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  // Real data from API
  const [groups, setGroups] = useState<Group[]>([]);
  const [individualSites, setIndividualSites] = useState<Site[]>([]);
  const [motivationalMessages, setMotivationalMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [version, setVersion] = useState("");

  // Display preferences
  const [showRandomMessage, setShowRandomMessage] = useState(true);
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  // Load version from manifest
  useEffect(() => {
    const loadVersion = async () => {
      try {
        const response = await fetch('/manifest.json');
        const manifest = await response.json();
        if (manifest.version) {
          setVersion(manifest.version);
        }
      } catch (error) {
        console.error("Failed to load version:", error);
      }
    };
    loadVersion();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [sitesData, groupsData, messagesData] = await Promise.all([
          api.getSites(),
          api.getGroups(),
          api.getMessages(),
        ]);

        // Separate standalone sites from group sites
        const standalone = sitesData.filter((s) => !s.groupId);
        setIndividualSites(standalone);
        setGroups(
          groupsData.map((g) => ({
            ...g,
            expanded: false, // Start collapsed
          }))
        );
        setMotivationalMessages(messagesData);

        // Load display preferences separately (optional)
        try {
          const preferencesData = await api.getDisplayPreferences();
          if (preferencesData) {
            setShowRandomMessage(preferencesData.showRandomMessage !== false);
            setShowActivitySuggestions(preferencesData.showActivitySuggestions !== false);
          }
        } catch (prefError) {
          console.warn("Could not load display preferences:", prefError);
          // Use defaults if preferences can't be loaded
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Listen for real-time updates
  useBroadcastUpdates({
    siteAdded: (data) => {
      if (!data.site.groupId) {
        setIndividualSites((prev) => [...prev, data.site]);
        toast({
          title: "Success",
          description: "Site added successfully",
        });
      }
    },
    siteUpdated: (data) => {
      if (!data.site.groupId) {
        setIndividualSites((prev) =>
          prev.map((s) =>
            s.id === data.site.id ? { ...s, ...data.site } : s
          )
        );
      } else {
        // If site now has a groupId, remove it from individual sites
        setIndividualSites((prev) =>
          prev.filter((s) => s.id !== data.site.id)
        );
      }
    },
    siteDeleted: (data) => {
      setIndividualSites((prev) => prev.filter((s) => s.id !== data.siteId));
      toast({
        title: "Success",
        description: "Site removed successfully",
      });
    },
    groupAdded: (data) => {
      setGroups((prev) => [
        ...prev,
        { ...data.group, expanded: true, sites: [] },
      ]);
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    groupUpdated: (data) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === data.group.id ? { ...g, ...data.group } : g
        )
      );
    },
    groupDeleted: (data) => {
      setGroups((prev) => prev.filter((g) => g.id !== data.groupId));
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    },
    siteAddedToGroup: (data) => {
      // Remove site from individual sites if it was there
      setIndividualSites((prev) =>
        prev.filter((s) => s.id !== data.siteId)
      );
      setGroups((prev) =>
        prev.map((g) =>
          g.id === data.group.id
            ? { ...data.group, expanded: true }
            : g
        )
      );
    },
    siteRemovedFromGroup: (data) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === data.group.id ? { ...data.group, expanded: true } : g
        )
      );
    },
  });

  const toggleGroup = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, expanded: !g.expanded } : g
      )
    );
  };

  // Filter logic for search
  const getFilteredSites = () => {
    if (!searchQuery.trim()) return individualSites;
    const query = searchQuery.toLowerCase();
    return individualSites.filter((site) =>
      site.name.toLowerCase().includes(query)
    );
  };

  const getFilteredGroups = () => {
    if (!searchQuery.trim()) return groups;
    const query = searchQuery.toLowerCase();
    return groups.map((group) => {
      const matchesGroupName = group.name.toLowerCase().includes(query);
      const matchingSites = (group.sites || []).filter((site) =>
        site.name.toLowerCase().includes(query)
      );

      // If group name matches or any site matches, include the group
      if (matchesGroupName || matchingSites.length > 0) {
        return {
          ...group,
          // Expand group if it has matching sites and search is active
          expanded: matchingSites.length > 0 ? true : group.expanded,
          // Show only matching sites
          sites: matchingSites.length > 0 ? matchingSites : group.sites,
        };
      }
      return null;
    }).filter((g): g is Group => g !== null);
  };

  const addMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSaving(true);
      const createdMessage = await api.addMessage(newMessage.trim());
      setMotivationalMessages([...motivationalMessages, createdMessage]);
      setNewMessage("");
      toast({
        title: "Success",
        description: "Message added successfully",
      });
    } catch (error) {
      console.error("Error adding message:", error);
      toast({
        title: "Error",
        description: "Failed to add message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeMessage = async (messageId: string) => {
    try {
      setIsSaving(true);
      await api.deleteMessage(messageId);
      setMotivationalMessages(
        motivationalMessages.filter((m) => m.id !== messageId)
      );
      toast({
        title: "Success",
        description: "Message removed successfully",
      });
    } catch (error) {
      console.error("Error removing message:", error);
      toast({
        title: "Error",
        description: "Failed to remove message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingMessage = (message: any) => {
    setEditingMessageId(message.id);
    setEditingMessageText(message.text);
  };

  const saveEditingMessage = async () => {
    if (!editingMessageText.trim() || !editingMessageId) return;

    try {
      setIsSaving(true);
      await api.updateMessage(editingMessageId, { text: editingMessageText.trim() });
      setMotivationalMessages(
        motivationalMessages.map((m) =>
          m.id === editingMessageId ? { ...m, text: editingMessageText.trim() } : m
        )
      );
      setEditingMessageId(null);
      setEditingMessageText("");
      toast({
        title: "Success",
        description: "Message updated successfully",
      });
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditingMessage = () => {
    setEditingMessageId(null);
    setEditingMessageText("");
  };

  const handleToggleRandomMessage = async (checked: boolean) => {
    setShowRandomMessage(checked);
    try {
      await api.updateDisplayPreferences({
        showRandomMessage: checked,
        showActivitySuggestions: showActivitySuggestions,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preference. Please try again.",
        variant: "destructive",
      });
      // Revert on error
      setShowRandomMessage(!checked);
    }
  };

  const handleToggleActivitySuggestions = async (checked: boolean) => {
    setShowActivitySuggestions(checked);
    try {
      await api.updateDisplayPreferences({
        showRandomMessage: showRandomMessage,
        showActivitySuggestions: checked,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preference. Please try again.",
        variant: "destructive",
      });
      // Revert on error
      setShowActivitySuggestions(!checked);
    }
  };

  const handleToggleSiteEnabled = async (siteId: string, currentValue: boolean) => {
    try {
      setIsSaving(true);

      // Update via API first
      const newEnabled = !currentValue;
      await api.updateSite(siteId, { isEnabled: newEnabled });

      // Then update UI with correct state
      setIndividualSites((prevSites) =>
        prevSites.map((site) =>
          site.id === siteId ? { ...site, isEnabled: newEnabled } : site
        )
      );

      // Also update sites within groups
      setGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          sites: (group.sites || []).map((site) =>
            site.id === siteId ? { ...site, isEnabled: newEnabled } : site
          ),
        }))
      );

      toast({
        title: "Success",
        description: newEnabled ? "Site enabled" : "Site disabled",
      });
    } catch (error) {
      console.error("Error toggling site:", error);
      toast({
        title: "Error",
        description: "Failed to update site",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleGroupEnabled = async (groupId: string, currentValue: boolean) => {
    try {
      setIsSaving(true);

      // Update via API first
      const newEnabled = !currentValue;
      await api.updateGroup(groupId, { isEnabled: newEnabled });

      // Then update UI - just toggle the flag, preserve sites
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId ? { ...group, isEnabled: newEnabled } : group
        )
      );

      toast({
        title: "Success",
        description: newEnabled ? "Group enabled" : "Group disabled",
      });
    } catch (error) {
      console.error("Error toggling group:", error);
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSite = async (site: {
    name: string;
    timeLimit?: number;
    opensLimit?: number;
  }) => {
    try {
      setIsSaving(true);
      if (editingSite) {
        // Update existing site
        const updatedSite = await api.updateSite(editingSite.id, {
          name: site.name,
          timeLimit: site.timeLimit,
          opensLimit: site.opensLimit,
        });
        setIndividualSites(individualSites.map(s => s.id === editingSite.id ? updatedSite : s));
        setEditingSite(null);
        toast({
          title: "Success",
          description: "Site updated successfully",
        });
      } else {
        // Add new site
        const newSite = await api.addSite({
          name: site.name,
          timeLimit: site.timeLimit,
          opensLimit: site.opensLimit,
        });
        setIndividualSites([...individualSites, newSite]);
        toast({
          title: "Success",
          description: "Site added successfully",
        });
      }
      setAddSiteDialogOpen(false);
    } catch (error) {
      console.error("Error adding/editing site:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingSite ? "update" : "add"} site. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openEditSiteDialog = (site: Site) => {
    setEditingSite(site);
    setAddSiteDialogOpen(true);
  };

  const handleRemoveSite = async (siteId: string) => {
    try {
      setIsSaving(true);
      await api.deleteSite(siteId);
      setIndividualSites(individualSites.filter((s) => s.id !== siteId));
      toast({
        title: "Success",
        description: "Site removed successfully",
      });
    } catch (error) {
      console.error("Error removing site:", error);
      toast({
        title: "Error",
        description: "Failed to remove site. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateGroup = async (groupData: {
    name: string;
    color: string;
    timeLimit: number;
    opensLimit: number;
  }) => {
    try {
      setIsSaving(true);

      if (selectedGroupForEdit) {
        // Edit existing group
        await api.updateGroup(selectedGroupForEdit.id, {
          name: groupData.name,
          color: groupData.color,
          timeLimit: groupData.timeLimit,
          opensLimit: groupData.opensLimit,
        });

        // Refetch groups to ensure UI shows latest data (especially for removed limits)
        const updatedGroupsList = await api.getGroups();
        setGroups(
          updatedGroupsList.map((g) => ({
            ...g,
            expanded: g.id === selectedGroupForEdit.id ? true : (groups.find(og => og.id === g.id)?.expanded || false),
          }))
        );

        toast({
          title: "Success",
          description: "Group updated successfully",
        });
      } else {
        // Create new group
        const newGroup = await api.addGroup({
          name: groupData.name,
          color: groupData.color,
          timeLimit: groupData.timeLimit,
          opensLimit: groupData.opensLimit,
        });
        setGroups([
          ...groups,
          { ...newGroup, expanded: true, sites: [] },
        ]);
        toast({
          title: "Success",
          description: "Group created successfully",
        });
      }

      setCreateGroupDialogOpen(false);
      setSelectedGroupForEdit(null);
    } catch (error) {
      console.error("Error creating/editing group:", error);
      toast({
        title: "Error",
        description: `Failed to ${selectedGroupForEdit ? "update" : "create"} group. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSiteToGroup = async (siteName: string) => {
    if (!selectedGroupForAdd) return;

    try {
      setIsSaving(true);
      // First add the site
      const newSite = await api.addSite({
        name: siteName,
      });

      // Then add it to the group
      await api.addSiteToGroup(selectedGroupForAdd.id, newSite.id);

      // Update local state
      setGroups(
        groups.map((g) =>
          g.id === selectedGroupForAdd.id
            ? { ...g, sites: [...(g.sites || []), newSite], expanded: true }
            : g
        )
      );

      setAddToGroupDialogOpen(false);
      toast({
        title: "Success",
        description: "Site added to group successfully",
      });
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

  const handleRemoveSiteFromGroup = async (groupId: string, siteId: string) => {
    try {
      setIsSaving(true);
      await api.removeSiteFromGroup(groupId, siteId);

      // Update local state
      setGroups(
        groups.map((g) =>
          g.id === groupId
            ? { ...g, sites: (g.sites || []).filter((s) => s.id !== siteId) }
            : g
        )
      );

      toast({
        title: "Success",
        description: "Site removed from group successfully",
      });
    } catch (error) {
      console.error("Error removing site from group:", error);
      toast({
        title: "Error",
        description: "Failed to remove site from group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openAddToGroupDialog = (group: Group) => {
    setSelectedGroupForAdd(group);
    setAddToGroupDialogOpen(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("Are you sure you want to delete this group? Sites in this group will become standalone.")) {
      return;
    }

    try {
      setIsSaving(true);
      await api.deleteGroup(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "Error",
        description: "Failed to delete group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openEditGroupDialog = (group: Group) => {
    setSelectedGroupForEdit(group);
    setCreateGroupDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-calm flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 pb-20">
        <Tabs defaultValue="limits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-muted/80">
            <TabsTrigger value="limits" className="rounded-xl">
              <Clock size={16} className="mr-2" />
              Limits
            </TabsTrigger>
            <TabsTrigger value="groups" className="rounded-xl">
              <FolderOpen size={16} className="mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-xl">
              <Quote size={16} className="mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Limits Tab */}
          <TabsContent value="limits" className="space-y-6">
            {/* Search bar */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search sites and groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 rounded-xl border-0 bg-card shadow-soft"
              />
            </div>

            {/* Individual Sites */}
            <Card className="shadow-soft border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Individual Sites</CardTitle>
                    <Badge variant="secondary" className="rounded-full">
                      {individualSites.length}
                    </Badge>
                  </div>
                  <Button
                    className="rounded-xl"
                    size="sm"
                    onClick={() => setAddSiteDialogOpen(true)}
                    disabled={isSaving}
                  >
                    <Plus size={16} className="mr-2" />
                    Add site
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {getFilteredSites().map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <GripVertical
                      size={16}
                      className="text-muted-foreground/50 cursor-grab"
                    />
                    <span className="text-xl">{site.favicon}</span>
                    <span className="flex-1 font-medium">{site.name}</span>
                    {site.timeLimit && (
                      <Badge variant="outline" className="rounded-full gap-1">
                        <Clock size={12} />
                        {site.timeLimit} min
                      </Badge>
                    )}
                    {site.opensLimit && (
                      <Badge variant="outline" className="rounded-full gap-1">
                        <MousePointerClick size={12} />
                        {site.opensLimit} opens
                      </Badge>
                    )}
                    <Switch
                      checked={site.isEnabled !== false}
                      onCheckedChange={() => handleToggleSiteEnabled(site.id, site.isEnabled !== false)}
                      disabled={isSaving}
                      title={site.isEnabled !== false ? "Enabled" : "Disabled"}
                    />
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditSiteDialog(site)}
                        disabled={isSaving}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveSite(site.id)}
                        disabled={isSaving}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Groups Overview */}
            {getFilteredGroups().length > 0 && (
            <Card className="shadow-soft border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Groups
                  <Badge variant="secondary" className="rounded-full">
                    {groups.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getFilteredGroups().map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl border bg-card overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="flex-1 flex items-center gap-3"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${group.color}`}
                        />
                        <span className="font-semibold text-left">
                          {group.name}
                        </span>
                        {group.timeLimit > 0 && (
                          <Badge variant="outline" className="rounded-full gap-1">
                            <Clock size={12} />
                            {group.timeLimit} min
                          </Badge>
                        )}
                        {group.opensLimit > 0 && (
                          <Badge variant="outline" className="rounded-full gap-1">
                            <MousePointerClick size={12} />
                            {group.opensLimit}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="rounded-full">
                          {(group.sites || []).length} sites
                        </Badge>
                        {group.expanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                      <Switch
                        checked={group.isEnabled !== false}
                        onCheckedChange={() => handleToggleGroupEnabled(group.id, group.isEnabled !== false)}
                        disabled={isSaving}
                        title={group.isEnabled !== false ? "Enabled" : "Disabled"}
                      />
                    </div>
                    {group.expanded && (
                      <div className="border-t bg-muted/30 p-3 space-y-2">
                        {(group.sites || []).map((site) => (
                          <div
                            key={site.id}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-card transition-colors group"
                          >
                            <span className="text-lg">{site.favicon}</span>
                            <span className="flex-1 text-sm">{site.name}</span>
                            <Switch
                              checked={site.isEnabled !== false}
                              onCheckedChange={() => handleToggleSiteEnabled(site.id, site.isEnabled !== false)}
                              disabled={isSaving}
                              title={site.isEnabled !== false ? "Enabled" : "Disabled"}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                              onClick={() => handleRemoveSiteFromGroup(group.id, site.id)}
                              disabled={isSaving}
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full border-dashed border rounded-xl text-muted-foreground"
                          onClick={() => openAddToGroupDialog(group)}
                          disabled={isSaving}
                        >
                          <Plus size={14} className="mr-2" />
                          Add site to group
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Manage Groups</h2>
                <p className="text-muted-foreground">
                  Create groups to share limits across related sites
                </p>
              </div>
              <Button
                className="rounded-xl shadow-soft"
                onClick={() => setCreateGroupDialogOpen(true)}
                disabled={isSaving}
              >
                <Plus size={18} className="mr-2" />
                New group
              </Button>
            </div>

            <div className="grid gap-4">
              {groups.map((group) => (
                <Card key={group.id} className="shadow-soft border-0">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl ${group.color} flex items-center justify-center`}
                      >
                        <FolderOpen size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {(group.sites || []).length} sites sharing limits
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(group.sites || []).map((site) => (
                            <Badge
                              key={site.id}
                              variant="secondary"
                              className="rounded-full gap-1.5 pr-1"
                            >
                              <span>{site.favicon}</span>
                              {site.name}
                              <button
                                className="ml-1 hover:bg-background rounded-full p-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleRemoveSiteFromGroup(group.id, site.id)}
                                disabled={isSaving}
                              >
                                <Trash2 size={10} />
                              </button>
                            </Badge>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-6 text-xs"
                            onClick={() => openAddToGroupDialog(group)}
                            disabled={isSaving}
                          >
                            <Plus size={12} className="mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 text-right space-y-1">
                        {group.timeLimit > 0 && (
                          <div className="flex items-center gap-2 text-sm justify-end">
                            <Clock size={14} className="text-muted-foreground" />
                            <span className="font-medium">
                              {group.timeLimit} min/day
                            </span>
                          </div>
                        )}
                        {group.opensLimit > 0 && (
                          <div className="flex items-center gap-2 text-sm justify-end">
                            <MousePointerClick
                              size={14}
                              className="text-muted-foreground"
                            />
                            <span className="font-medium">
                              {group.opensLimit} opens/day
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEditGroupDialog(group)}
                          disabled={isSaving}
                          title="Edit group"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteGroup(group.id)}
                          disabled={isSaving}
                          title="Delete group"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Motivational Messages</h2>
              <p className="text-muted-foreground">
                These will appear when you reach your limits
              </p>
            </div>

            <Card className="shadow-soft border-0">
              <CardContent className="p-5 space-y-4">
                {/* Add new message */}
                <div className="flex gap-3">
                  <Input
                    placeholder="Add a new motivational message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addMessage()}
                    className="rounded-xl"
                    disabled={isSaving}
                  />
                  <Button
                    onClick={addMessage}
                    className="rounded-xl"
                    disabled={isSaving || !newMessage.trim()}
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Plus size={18} />
                    )}
                  </Button>
                </div>

                {/* Messages list */}
                <div className="space-y-2">
                  {motivationalMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 group"
                    >
                      <Quote size={18} className="text-primary shrink-0" />
                      {editingMessageId === message.id ? (
                        <Input
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditingMessage();
                            if (e.key === "Escape") cancelEditingMessage();
                          }}
                          className="flex-1 rounded-xl"
                          autoFocus
                          disabled={isSaving}
                        />
                      ) : (
                        <p className="flex-1 cursor-text" onClick={() => startEditingMessage(message)}>
                          {message.text}
                        </p>
                      )}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                        {editingMessageId === message.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary"
                              onClick={saveEditingMessage}
                              disabled={isSaving || !editingMessageText.trim()}
                            >
                              ✓
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={cancelEditingMessage}
                              disabled={isSaving}
                            >
                              ✕
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => startEditingMessage(message)}
                              disabled={isSaving}
                              title="Edit message"
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeMessage(message.id)}
                              disabled={isSaving}
                              title="Delete message"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="text-lg">Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show random message</p>
                    <p className="text-sm text-muted-foreground">
                      Display a random message each time
                    </p>
                  </div>
                  <Switch
                    checked={showRandomMessage}
                    onCheckedChange={handleToggleRandomMessage}
                    disabled={isSaving}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show activity suggestions</p>
                    <p className="text-sm text-muted-foreground">
                      Display cards with things to do instead
                    </p>
                  </div>
                  <Switch
                    checked={showActivitySuggestions}
                    onCheckedChange={handleToggleActivitySuggestions}
                    disabled={isSaving}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddSiteDialog
        open={addSiteDialogOpen}
        onOpenChange={(open) => {
          setAddSiteDialogOpen(open);
          if (!open) {
            setEditingSite(null);
          }
        }}
        onAdd={handleAddSite}
        isLoading={isSaving}
        initialSite={editingSite || undefined}
        isEditing={!!editingSite}
      />
      <CreateGroupDialog
        open={createGroupDialogOpen}
        onOpenChange={setCreateGroupDialogOpen}
        onCreate={handleCreateGroup}
        initialGroup={selectedGroupForEdit || undefined}
        isEditing={!!selectedGroupForEdit}
        isLoading={isSaving}
      />
      <AddSiteToGroupDialog
        open={addToGroupDialogOpen}
        onOpenChange={setAddToGroupDialogOpen}
        groupName={selectedGroupForAdd?.name || ""}
        onAdd={handleAddSiteToGroup}
        isLoading={isSaving}
      />

      {/* Version footer - fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 text-center py-3 text-xs text-muted-foreground bg-background">
        Distraction Limiter {version && `v${version}`}
      </footer>
    </div>
  );
};

export default SettingsPage;
