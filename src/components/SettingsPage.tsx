import { useState, useEffect } from "react";
import { Clock, Quote, Loader2, FolderOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Logo from "./Logo";
import AddSiteDialog from "./settings/AddSiteDialog";
import CreateGroupDialog from "./settings/CreateGroupDialog";
import AddSiteToGroupDialog from "./settings/AddSiteToGroupDialog";
import { IndividualSitesTab } from "./settings/IndividualSitesTab";
import { GroupsTab } from "./settings/GroupsTab";
import { MessagesTab } from "./settings/MessagesTab";
import * as api from "@/lib/api";
import { useBroadcastUpdates } from "@/hooks/useBroadcastUpdates";
import { useDialogManager } from "@/lib/hooks/useDialogManager";
import { useEditMode } from "@/lib/hooks/useEditMode";
import { logError, getErrorToastProps, getSuccessToastProps } from "@/lib/utils/errorHandler";
import type { UISite, UIGroup } from "@/lib/storage";

const SettingsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog management using custom hooks to reduce state duplication
  const addSiteDialog = useDialogManager<UISite>(null);
  const createGroupDialog = useDialogManager<UIGroup & { sites: UISite[] }>(null);
  const addToGroupDialog = useDialogManager<UIGroup & { sites: UISite[] }>(null);

  // Real data from API
  const [groups, setGroups] = useState<(UIGroup & { sites: UISite[] })[]>([]);
  const [individualSites, setIndividualSites] = useState<UISite[]>([]);
  const [motivationalMessages, setMotivationalMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [version, setVersion] = useState("");

  // Display preferences
  const [showRandomMessage, setShowRandomMessage] = useState(true);
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(true);

  // Message editing using custom hook to reduce state duplication
  const messageEditor = useEditMode<{ id: string; text: string }>(null, (msg) => msg.id);

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
        logError("Error loading settings", error);
        toast(getErrorToastProps("Failed to load settings. Please try again."));
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
        toast(getSuccessToastProps("Site added successfully"));
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
      toast(getSuccessToastProps("Site removed successfully"));
    },
    groupAdded: (data) => {
      setGroups((prev) => [
        ...prev,
        { ...data.group, expanded: true, sites: [] },
      ]);
      toast(getSuccessToastProps("Group created successfully"));
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
      toast(getSuccessToastProps("Group deleted successfully"));
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
    }).filter((g): g is (UIGroup & { sites: UISite[]; expanded: boolean }) => g !== null);
  };

  const addMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSaving(true);
      const createdMessage = await api.addMessage(newMessage.trim());
      setMotivationalMessages([...motivationalMessages, createdMessage]);
      setNewMessage("");
      toast(getSuccessToastProps("Message added successfully"));
    } catch (error) {
      logError("Error adding message", error);
      toast(getErrorToastProps("Failed to add message. Please try again."));
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
      toast(getSuccessToastProps("Message removed successfully"));
    } catch (error) {
      logError("Error removing message", error);
      toast(getErrorToastProps("Failed to remove message. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingMessage = (message: any) => {
    messageEditor.startEdit(message);
  };

  const saveEditingMessage = async () => {
    if (!messageEditor.editingData?.text.trim() || !messageEditor.editingId) return;

    try {
      setIsSaving(true);
      const updatedText = messageEditor.editingData.text.trim();
      await api.updateMessage(messageEditor.editingId as string, { text: updatedText });
      setMotivationalMessages(
        motivationalMessages.map((m) =>
          m.id === messageEditor.editingId ? { ...m, text: updatedText } : m
        )
      );
      messageEditor.finishEdit();
      toast(getSuccessToastProps("Message updated successfully"));
    } catch (error) {
      logError("Error updating message", error);
      toast(getErrorToastProps("Failed to update message. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditingMessage = () => {
    messageEditor.cancelEdit();
  };

  const handleToggleRandomMessage = async (checked: boolean) => {
    setShowRandomMessage(checked);
    try {
      await api.updateDisplayPreferences({
        showRandomMessage: checked,
        showActivitySuggestions: showActivitySuggestions,
      });
    } catch (error) {
      logError("Error updating preferences", error);
      toast(getErrorToastProps("Failed to save preference. Please try again."));
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
      logError("Error updating preferences", error);
      toast(getErrorToastProps("Failed to save preference. Please try again."));
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

      toast(getSuccessToastProps(newEnabled ? "Site enabled" : "Site disabled"));
    } catch (error) {
      logError("Error toggling site", error);
      toast(getErrorToastProps("Failed to update site"));
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

      toast(getSuccessToastProps(newEnabled ? "Group enabled" : "Group disabled"));
    } catch (error) {
      logError("Error toggling group", error);
      toast(getErrorToastProps("Failed to update group"));
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
      const siteData = addSiteDialog.data;
      if (siteData) {
        // Update existing site
        const updatedSite = await api.updateSite(siteData.id, {
          name: site.name,
          timeLimit: site.timeLimit,
          opensLimit: site.opensLimit,
        });
        setIndividualSites(individualSites.map(s => s.id === siteData.id ? updatedSite : s));
        toast(getSuccessToastProps("Site updated successfully"));
      } else {
        // Add new site
        const newSite = await api.addSite({
          name: site.name,
          timeLimit: site.timeLimit,
          opensLimit: site.opensLimit,
        });
        setIndividualSites([...individualSites, newSite]);
        toast(getSuccessToastProps("Site added successfully"));
      }
      addSiteDialog.close();
    } catch (error) {
      logError("Error adding/editing site", error);
      toast(getErrorToastProps(`Failed to ${addSiteDialog.data ? "update" : "add"} site. Please try again.`));
    } finally {
      setIsSaving(false);
    }
  };

  const openEditSiteDialog = (site: UISite) => {
    addSiteDialog.open(site);
  };

  const handleRemoveSite = async (siteId: string) => {
    try {
      setIsSaving(true);
      await api.deleteSite(siteId);
      setIndividualSites(individualSites.filter((s) => s.id !== siteId));
      toast(getSuccessToastProps("Site removed successfully"));
    } catch (error) {
      logError("Error removing site", error);
      toast(getErrorToastProps("Failed to remove site. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateGroup = async (groupData: {
    name: string;
    color: string;
    timeLimit: number;
    opensLimit?: number;
  }) => {
    try {
      setIsSaving(true);
      const groupEditData = createGroupDialog.data;

      if (groupEditData) {
        // Edit existing group
        await api.updateGroup(groupEditData.id, {
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
            expanded: g.id === groupEditData.id ? true : (groups.find(og => og.id === g.id)?.expanded || false),
          }))
        );

        toast(getSuccessToastProps("Group updated successfully"));
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
        toast(getSuccessToastProps("Group created successfully"));
      }

      createGroupDialog.close();
    } catch (error) {
      logError("Error creating/editing group", error);
      toast(getErrorToastProps(`Failed to ${createGroupDialog.data ? "update" : "create"} group. Please try again.`));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSiteToGroup = async (siteName: string) => {
    if (!addToGroupDialog.data) return;
    const groupData = addToGroupDialog.data;

    try {
      setIsSaving(true);
      // First add the site
      const newSite = await api.addSite({
        name: siteName,
      });

      // Then add it to the group
      await api.addSiteToGroup(groupData.id, newSite.id);

      // Update local state
      setGroups(
        groups.map((g) =>
          g.id === groupData.id
            ? { ...g, sites: [...(g.sites || []), newSite], expanded: true }
            : g
        )
      );

      addToGroupDialog.close();
      toast(getSuccessToastProps("Site added to group successfully"));
    } catch (error) {
      logError("Error adding site to group", error);
      toast(getErrorToastProps("Failed to add site to group. Please try again."));
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

      toast(getSuccessToastProps("Site removed from group successfully"));
    } catch (error) {
      logError("Error removing site from group", error);
      toast(getErrorToastProps("Failed to remove site from group. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const openAddToGroupDialog = (group: UIGroup & { sites: UISite[] }) => {
    addToGroupDialog.open(group);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("Are you sure you want to delete this group? Sites in this group will become standalone.")) {
      return;
    }

    try {
      setIsSaving(true);
      await api.deleteGroup(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
      toast(getSuccessToastProps("Group deleted successfully"));
    } catch (error) {
      logError("Error deleting group", error);
      toast(getErrorToastProps("Failed to delete group. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const openEditGroupDialog = (group: UIGroup & { sites: UISite[] }) => {
    createGroupDialog.open(group);
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
            <IndividualSitesTab
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              individualSites={individualSites}
              groups={groups}
              isSaving={isSaving}
              onAddSite={() => addSiteDialog.open()}
              onEditSite={openEditSiteDialog}
              onRemoveSite={handleRemoveSite}
              onToggleSiteEnabled={handleToggleSiteEnabled}
              onToggleGroupEnabled={handleToggleGroupEnabled}
              onToggleGroup={toggleGroup}
              onRemoveSiteFromGroup={handleRemoveSiteFromGroup}
              onAddSiteToGroup={openAddToGroupDialog}
              getFilteredSites={getFilteredSites}
              getFilteredGroups={getFilteredGroups}
            />
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <GroupsTab
              groups={groups}
              isSaving={isSaving}
              onCreateGroup={() => createGroupDialog.open()}
              onEditGroup={openEditGroupDialog}
              onDeleteGroup={handleDeleteGroup}
              onAddSiteToGroup={openAddToGroupDialog}
              onRemoveSiteFromGroup={handleRemoveSiteFromGroup}
            />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <MessagesTab
              messages={motivationalMessages}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              onAddMessage={addMessage}
              showRandomMessage={showRandomMessage}
              onToggleRandomMessage={handleToggleRandomMessage}
              showActivitySuggestions={showActivitySuggestions}
              onToggleActivitySuggestions={handleToggleActivitySuggestions}
              isSaving={isSaving}
              onRemoveMessage={removeMessage}
              onStartEditMessage={startEditingMessage}
              editingMessageId={messageEditor.editingId as string | null}
              editingMessageText={messageEditor.editingData?.text || ""}
              onEditMessageChange={(text) => messageEditor.updateData({ ...messageEditor.editingData!, text })}
              onSaveEditMessage={saveEditingMessage}
              onCancelEditMessage={cancelEditingMessage}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddSiteDialog
        open={addSiteDialog.isOpen}
        onOpenChange={(open) => {
          addSiteDialog.setIsOpen(open);
          if (!open) {
            addSiteDialog.reset();
          }
        }}
        onAdd={handleAddSite}
        initialSite={addSiteDialog.data || undefined}
        isEditing={!!addSiteDialog.data}
      />
      <CreateGroupDialog
        open={createGroupDialog.isOpen}
        onOpenChange={createGroupDialog.setIsOpen}
        onCreate={handleCreateGroup}
        initialGroup={createGroupDialog.data || undefined}
        isEditing={!!createGroupDialog.data}
      />
      <AddSiteToGroupDialog
        open={addToGroupDialog.isOpen}
        onOpenChange={addToGroupDialog.setIsOpen}
        groupName={addToGroupDialog.data?.name || ""}
        onAdd={handleAddSiteToGroup}
      />

      {/* Version footer - fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 text-center py-3 text-xs text-muted-foreground bg-background">
        Distraction Limiter {version && `v${version}`}
      </footer>
    </div>
  );
};

export default SettingsPage;
