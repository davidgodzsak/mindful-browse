import { useState, useEffect } from "react";
import { Plus, Clock, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddSiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (site: { name: string; timeLimit?: number; opensLimit?: number }) => void;
  initialSite?: { id: string; name: string; timeLimit?: number; opensLimit?: number };
  isEditing?: boolean;
}

const AddSiteDialog = ({ open, onOpenChange, onAdd, initialSite, isEditing }: AddSiteDialogProps) => {
  const [siteName, setSiteName] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [opensLimit, setOpensLimit] = useState("");

  // Update form when dialog opens/closes or when editing site changes
  useEffect(() => {
    if (open && isEditing && initialSite) {
      setSiteName(initialSite.name);
      setTimeLimit(initialSite.timeLimit ? initialSite.timeLimit.toString() : "");
      setOpensLimit(initialSite.opensLimit ? initialSite.opensLimit.toString() : "");
    } else if (open && !isEditing) {
      setSiteName("");
      setTimeLimit("");
      setOpensLimit("");
    }
  }, [open, isEditing, initialSite]);

  const handleAdd = () => {
    if (!siteName.trim()) {
      return;
    }

    const parsedTimeLimit = timeLimit ? parseInt(timeLimit) : undefined;
    const parsedOpensLimit = opensLimit ? parseInt(opensLimit) : undefined;

    // Ensure at least one limit is set
    if (!parsedTimeLimit && !parsedOpensLimit) {
      alert("Please set at least a time limit or an opens limit");
      return;
    }

    onAdd({
      name: siteName.trim(),
      timeLimit: parsedTimeLimit,
      opensLimit: parsedOpensLimit,
    });
    setSiteName("");
    setTimeLimit("");
    setOpensLimit("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Site" : "Add New Site"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the limits for this website." : "Add a website to track with time or opens limits."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Website URL</Label>
            <Input
              id="site-name"
              placeholder="e.g., facebook.com"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time-limit" className="flex items-center gap-2">
                <Clock size={14} />
                Time limit (min)
              </Label>
              <Input
                id="time-limit"
                type="number"
                placeholder="e.g., 30"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opens-limit" className="flex items-center gap-2">
                <MousePointerClick size={14} />
                Opens limit
              </Label>
              <Input
                id="opens-limit"
                type="number"
                placeholder="e.g., 10"
                value={opensLimit}
                onChange={(e) => setOpensLimit(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!siteName.trim() || (!timeLimit && !opensLimit)}
            className="rounded-xl"
          >
            {isEditing ? (
              <>Update Site</>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Add Site
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSiteDialog;
