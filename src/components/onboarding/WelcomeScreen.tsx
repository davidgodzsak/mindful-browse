import { Lightbulb, FolderOpen, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onStart, onSkip }: WelcomeScreenProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Welcome to Mindful Browse ✨</DialogTitle>
          <DialogDescription className="text-base">
            Set up your first page limits and stay focused
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Features list */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Lightbulb
                className="text-emerald-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <div>
                <p className="font-semibold text-sm">Add Page Limits</p>
                <p className="text-xs text-muted-foreground">
                  Set time and visit limits on distracting sites
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FolderOpen className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-sm">Limit a group of pages</p>
                <p className="text-xs text-muted-foreground">
                  Limit related sites together to prevent switching
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Quote
                className="text-emerald-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <div>
                <p className="font-semibold text-sm">Custom Messages</p>
                <p className="text-xs text-muted-foreground">
                  Add motivational messages for timeout pages
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ⏱️ Takes about 2 minutes
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1 rounded-lg"
          >
            Skip onboarding
          </Button>
          <Button
            onClick={onStart}
            autoFocus
            className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            Start onboarding
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
