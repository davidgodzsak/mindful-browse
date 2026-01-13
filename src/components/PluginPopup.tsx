import { useState } from "react";
import { Settings, Plus, Clock, MousePointerClick, Pause, Play, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Logo from "./Logo";
import CircularProgress from "./CircularProgress";

interface PluginPopupProps {
  isLimited?: boolean;
  siteName?: string;
  groupName?: string;
  timeUsed?: number;
  timeLimit?: number;
  opensUsed?: number;
  opensLimit?: number;
  onSettings?: () => void;
}

const PluginPopup = ({
  isLimited = true,
  siteName = "facebook.com",
  groupName = "Social Media",
  timeUsed = 8,
  timeLimit = 15,
  opensUsed = 3,
  opensLimit = 10,
  onSettings,
}: PluginPopupProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const timeRemaining = timeLimit - timeUsed;
  const opensRemaining = opensLimit - opensUsed;

  if (!isLimited) {
    return (
      <Card className="w-80 shadow-soft border-0 overflow-hidden">
        <div className="gradient-mint p-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <Button variant="ghost" size="icon" onClick={onSettings} className="hover:bg-white/50">
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
              <p className="font-medium text-foreground">example.com</p>
              <p className="text-sm text-muted-foreground">Not tracked</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Add limits to stay mindful while browsing this site.
          </p>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick presets</p>
            <div className="grid grid-cols-3 gap-2">
              {["15 min", "30 min", "1 hour"].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-primary/30 hover:bg-primary/10 hover:border-primary"
                >
                  {preset}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button className="rounded-xl" size="sm">
                <Clock size={14} className="mr-1.5" />
                Time limit
              </Button>
              <Button variant="secondary" className="rounded-xl" size="sm">
                <MousePointerClick size={14} className="mr-1.5" />
                Opens limit
              </Button>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="w-full rounded-xl border-dashed" size="sm">
                <Plus size={14} className="mr-1.5" />
                Add to existing group
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 shadow-soft border-0 overflow-hidden">
      {/* Header */}
      <div className="gradient-mint p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={onSettings} className="hover:bg-white/50">
            <Settings size={18} />
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Site info */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <span className="text-lg">📘</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{siteName}</p>
            <p className="text-sm text-primary font-medium">{groupName}</p>
          </div>
        </div>

        {/* Circular progress */}
        <div className="flex justify-center mb-5">
          <CircularProgress value={timeUsed} max={timeLimit} size={140} strokeWidth={10}>
            <span className="text-3xl font-bold text-foreground">{timeRemaining}</span>
            <span className="text-sm text-muted-foreground">min left</span>
          </CircularProgress>
        </div>

        {/* Opens counter */}
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
          <Progress value={(opensUsed / opensLimit) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {opensRemaining} opens remaining
          </p>
        </div>

        {/* Quick actions */}
        <Button
          variant={isPaused ? "default" : "outline"}
          className="w-full rounded-xl"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? (
            <>
              <Play size={16} className="mr-2" />
              Resume tracking
            </>
          ) : (
            <>
              <Pause size={16} className="mr-2" />
              Pause for 5 min
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PluginPopup;
