import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Plus, Globe, Loader2 } from "lucide-react";
import { UIGroup } from "@/lib/storage";
import Logo from "../Logo";

interface UnlimitedSiteViewProps {
  siteName: string;
  selectedTimeLimit: number | null;
  selectedOpensLimit: number | null;
  showGroupSelector: boolean;
  isLoadingGroups: boolean;
  availableGroups: UIGroup[];
  isSaving: boolean;
  onSelectTimeLimit: (minutes: number) => void;
  onSelectOpensLimit: (opens: number) => void;
  onAddLimit: () => void;
  onOpenSettings: () => void;
  onOpenGroupSelector: () => void;
  onAddToGroup: (groupId: string) => void;
  onCloseGroupSelector: () => void;
}

export function UnlimitedSiteView({
  siteName,
  selectedTimeLimit,
  selectedOpensLimit,
  showGroupSelector,
  isLoadingGroups,
  availableGroups,
  isSaving,
  onSelectTimeLimit,
  onSelectOpensLimit,
  onAddLimit,
  onOpenSettings,
  onOpenGroupSelector,
  onAddToGroup,
  onCloseGroupSelector,
}: UnlimitedSiteViewProps) {
  return (
    <Card className="w-80 shadow-soft border-0 overflow-hidden">
      <div className="gradient-mint p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
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
                  onClick={() => onSelectTimeLimit(minutes)}
                  disabled={isSaving}
                >
                  {minutes === 60 ? "1h" : `${minutes}m`}
                </Button>
              ))}
            </div>
          </div>

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
                  onClick={() => onSelectOpensLimit(opens)}
                  disabled={isSaving}
                >
                  {opens}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full rounded-xl"
            size="sm"
            onClick={onAddLimit}
            disabled={isSaving || (!selectedTimeLimit && !selectedOpensLimit)}
          >
            <Plus size={14} className="mr-1.5" />
            Add limit
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <div className="relative flex justify-center">
              <span className="px-2 bg-card text-xs text-muted-foreground">
                or
              </span>
            </div>
          </div>

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
                      onClick={() => onAddToGroup(group.id as string)}
                      disabled={isSaving}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${group.color} mr-2`}
                      />
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
                onClick={onCloseGroupSelector}
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
              onClick={onOpenGroupSelector}
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
