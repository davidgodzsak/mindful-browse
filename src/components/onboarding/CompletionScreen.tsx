import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import browserImg from "@/browser.png";

interface CompletionScreenProps {
  onClose: () => void;
}

export function CompletionScreen({ onClose }: CompletionScreenProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">All Set! ✨</DialogTitle>
          <DialogDescription className="text-base">
            You're ready to stay focused
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Completion message */}
          <div className="flex items-start gap-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Your first page limits and messages are ready. The extension will start tracking your time right away. Thanks for using Mindful Browse.
              </p>
            </div>
          </div>

          {/* Toolbar icon explanation */}
          <div className="space-y-3">
            <p className="font-semibold text-sm">Quick access from toolbar</p>
            <div className="relative bg-muted p-4 rounded-xl overflow-hidden">
              {/* Browser image with fade transparency */}
              <img
                src={browserImg}
                alt="Browser toolbar"
                className="w-full h-auto"
                style={{
                  opacity: 0.6,
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                }}
              />
              <p className="text-xs text-muted-foreground mt-3">
                Click the green icon in your toolbar durring browsing to quickly add limits to the page that is open.
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <Button
          onClick={onClose}
          className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          Start browsing
        </Button>
      </DialogContent>
    </Dialog>
  );
}
