import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Logo from "./Logo";

interface Site {
  id: string;
  name: string;
  favicon: string;
  timeLimit?: number;
  opensLimit?: number;
}

interface Group {
  id: string;
  name: string;
  color: string;
  timeLimit: number;
  opensLimit: number;
  sites: Site[];
  expanded?: boolean;
}

const SettingsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Social Media",
      color: "bg-blue-500",
      timeLimit: 30,
      opensLimit: 15,
      sites: [
        { id: "1a", name: "facebook.com", favicon: "📘" },
        { id: "1b", name: "instagram.com", favicon: "📸" },
        { id: "1c", name: "twitter.com", favicon: "🐦" },
        { id: "1d", name: "reddit.com", favicon: "🤖" },
      ],
      expanded: true,
    },
    {
      id: "2",
      name: "Entertainment",
      color: "bg-red-500",
      timeLimit: 45,
      opensLimit: 10,
      sites: [
        { id: "2a", name: "youtube.com", favicon: "▶️" },
        { id: "2b", name: "netflix.com", favicon: "🎬" },
        { id: "2c", name: "twitch.tv", favicon: "💜" },
      ],
      expanded: false,
    },
  ]);

  const [individualSites, setIndividualSites] = useState<Site[]>([
    { id: "i1", name: "news.ycombinator.com", favicon: "🟧", timeLimit: 20 },
    { id: "i2", name: "producthunt.com", favicon: "🔶", opensLimit: 5 },
  ]);

  const [motivationalMessages, setMotivationalMessages] = useState([
    "Take a deep breath and go for a short walk 🚶",
    "How about reading that book you've been meaning to start? 📚",
    "Drink some water and stretch your body 💧",
    "Call a friend or family member you haven't talked to in a while 📱",
    "Try 5 minutes of meditation to clear your mind 🧘",
  ]);

  const [newMessage, setNewMessage] = useState("");

  const toggleGroup = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, expanded: !g.expanded } : g
      )
    );
  };

  const addMessage = () => {
    if (newMessage.trim()) {
      setMotivationalMessages([...motivationalMessages, newMessage.trim()]);
      setNewMessage("");
    }
  };

  const removeMessage = (index: number) => {
    setMotivationalMessages(motivationalMessages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button variant="outline" className="rounded-xl">
            <Settings2 size={16} className="mr-2" />
            Preferences
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
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
            {/* Search & Add */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 rounded-xl border-0 bg-card shadow-soft"
                />
              </div>
              <Button className="rounded-xl shadow-soft">
                <Plus size={18} className="mr-2" />
                Add site
              </Button>
            </div>

            {/* Individual Sites */}
            <Card className="shadow-soft border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Individual Sites
                  <Badge variant="secondary" className="rounded-full">
                    {individualSites.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {individualSites.map((site) => (
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
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Groups Overview */}
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
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${group.color}`}
                      />
                      <span className="font-semibold flex-1 text-left">
                        {group.name}
                      </span>
                      <Badge variant="outline" className="rounded-full gap-1">
                        <Clock size={12} />
                        {group.timeLimit} min
                      </Badge>
                      <Badge variant="outline" className="rounded-full gap-1">
                        <MousePointerClick size={12} />
                        {group.opensLimit}
                      </Badge>
                      <Badge variant="secondary" className="rounded-full">
                        {group.sites.length} sites
                      </Badge>
                      {group.expanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                    {group.expanded && (
                      <div className="border-t bg-muted/30 p-3 space-y-2">
                        {group.sites.map((site) => (
                          <div
                            key={site.id}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-card transition-colors group"
                          >
                            <span className="text-lg">{site.favicon}</span>
                            <span className="flex-1 text-sm">{site.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full border-dashed border rounded-xl text-muted-foreground"
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
              <Button className="rounded-xl shadow-soft">
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
                          {group.sites.length} sites sharing limits
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.sites.map((site) => (
                            <Badge
                              key={site.id}
                              variant="secondary"
                              className="rounded-full gap-1.5 pr-1"
                            >
                              <span>{site.favicon}</span>
                              {site.name}
                              <button className="ml-1 hover:bg-background rounded-full p-0.5">
                                <Trash2 size={10} />
                              </button>
                            </Badge>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-6 text-xs"
                          >
                            <Plus size={12} className="mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-muted-foreground" />
                          <span className="font-medium">
                            {group.timeLimit} min/day
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MousePointerClick
                            size={14}
                            className="text-muted-foreground"
                          />
                          <span className="font-medium">
                            {group.opensLimit} opens/day
                          </span>
                        </div>
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
                  />
                  <Button onClick={addMessage} className="rounded-xl">
                    <Plus size={18} />
                  </Button>
                </div>

                {/* Messages list */}
                <div className="space-y-2">
                  {motivationalMessages.map((message, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 group"
                    >
                      <Quote size={18} className="text-primary shrink-0" />
                      <p className="flex-1">{message}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive"
                        onClick={() => removeMessage(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
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
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show activity suggestions</p>
                    <p className="text-sm text-muted-foreground">
                      Display cards with things to do instead
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
