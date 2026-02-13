import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Info } from "lucide-react";
import Logo from "../Logo";

interface InfoPageViewProps {
  onOpenSettings: () => void;
}

export function InfoPageView({ onOpenSettings }: InfoPageViewProps) {
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
            title="Go to Settings"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Info size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium">About This Extension</p>
            <p className="text-sm text-muted-foreground">Learn & configure</p>
          </div>
        </div>

        <p className="text-sm text-foreground/70 mb-5">
          Distraction Limiter helps you stay focused by limiting time on distracting sites. Privacy-first, free, and open-source.
        </p>

        <div className="space-y-2">
          <Button
            onClick={onOpenSettings}
            className="w-full rounded-full bg-primary hover:bg-primary/90 gap-2"
          >
            <Settings size={16} />
            Go to Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
