import { Lightbulb, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FirstInstallViewProps {
  onOpenSettings: () => void;
  onAddLimit: () => void;
}

export function FirstInstallView({ onOpenSettings, onAddLimit }: FirstInstallViewProps) {
  return (
    <div className="w-80 p-4">
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-3xl mb-2">✨</div>
            <h2 className="text-lg font-semibold">Welcome to Mindful Browse</h2>
            <p className="text-sm text-muted-foreground">
              Get started by setting up your first page limit
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="flex gap-3">
              <Lightbulb className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-emerald-900">
                Set up your first page limits in settings to start tracking your time on distracting sites.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={onOpenSettings}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2"
            >
              <Settings size={16} />
              Open Settings
            </Button>

            <Button
              onClick={onAddLimit}
              variant="outline"
              className="w-full rounded-lg"
            >
              Or add limit
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You'll be able to add quick limits from here once set up
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
