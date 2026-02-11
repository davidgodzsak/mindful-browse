import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Play, Pause } from "lucide-react";
import Logo from "../Logo";

interface DisabledStateViewProps {
  siteName: string;
  disabledReason: "site" | "group" | "both" | null;
  groupName: string | null;
  isSaving: boolean;
  onTurnOnSite: () => void;
  onOpenSettings: () => void;
}

export function DisabledStateView({
  siteName,
  disabledReason,
  groupName,
  isSaving,
  onTurnOnSite,
  onOpenSettings,
}: DisabledStateViewProps) {
  const getMessage = () => {
    if (disabledReason === "both") {
      return "Tracking is paused for this site and its group. Click below to turn it back on.";
    } else if (disabledReason === "group") {
      return "Tracking is paused for the group this site belongs to. Click below to enable it.";
    } else {
      return "Tracking is paused for this site. Click below to turn it back on.";
    }
  };

  const getLabel = () => {
    if (disabledReason === "group") {
      return `${groupName} (disabled)`;
    } else if (disabledReason === "both") {
      return `${siteName} (disabled)`;
    } else {
      return "Disabled";
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
            onClick={onOpenSettings}
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

        <p className="text-sm text-muted-foreground mb-5">{getMessage()}</p>

        <Button
          className="w-full rounded-xl"
          onClick={onTurnOnSite}
          disabled={isSaving}
        >
          <Play size={16} className="mr-2" />
          Turn on tracking
        </Button>
      </CardContent>
    </Card>
  );
}
