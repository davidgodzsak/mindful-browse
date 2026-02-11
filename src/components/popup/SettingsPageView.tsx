import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import Logo from "../Logo";

interface SettingsPageViewProps {
  onOpenSettings: () => void;
}

export function SettingsPageView({ onOpenSettings }: SettingsPageViewProps) {
  return (
    <Card className="w-80 shadow-soft border-0 overflow-hidden">
      <div className="gradient-mint p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
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
