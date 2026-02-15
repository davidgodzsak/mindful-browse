import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Info } from "lucide-react";
import Logo from "../Logo";
import { t } from "@/lib/utils/i18n";

interface SettingsPageViewProps {
  onOpenSettings: () => void;
  onOpenInfo?: () => void;
}

export function SettingsPageView({ onOpenSettings, onOpenInfo }: SettingsPageViewProps) {
  return (
    <Card className="w-80 shadow-soft border-0 overflow-hidden">
      <div className="gradient-mint p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex gap-1">
            {onOpenInfo && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenInfo}
                className="hover:bg-white/50"
                title="About this extension"
              >
                <Info size={18} />
              </Button>
            )}
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
      </div>

      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Settings size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{t("settingsPageView_title")}</p>
            <p className="text-sm text-muted-foreground">{t("settingsPageView_subtitle")}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("settingsPageView_description")}
        </p>
      </CardContent>
    </Card>
  );
}
