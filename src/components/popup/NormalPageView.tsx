import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings, MousePointerClick, Info } from "lucide-react";
import Logo from "../Logo";
import CircularProgress from "../CircularProgress";

interface NormalPageViewProps {
  siteName: string;
  groupName: string | null;
  timeUsed: number;
  timeLimit: number;
  timeRemaining: number;
  opensUsed: number;
  opensLimit: number;
  opensRemaining: number;
  onSettings: () => void;
  onInfo?: () => void;
}

export function NormalPageView({
  siteName,
  groupName,
  timeUsed,
  timeLimit,
  timeRemaining,
  opensUsed,
  opensLimit,
  opensRemaining,
  onSettings,
  onInfo,
}: NormalPageViewProps) {
  return (
    <Card className="w-80 shadow-soft border-0 overflow-hidden">
      <div className="gradient-mint p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex gap-1">
            {onInfo && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onInfo}
                className="hover:bg-white/50"
                title="About this extension"
              >
                <Info size={18} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettings}
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
            <span className="text-lg">📘</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{siteName}</p>
            {groupName && (
              <p className="text-sm text-primary font-medium">{groupName}</p>
            )}
          </div>
        </div>

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
}
