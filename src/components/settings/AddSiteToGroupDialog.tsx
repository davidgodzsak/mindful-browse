import { useState } from "react";
import { Plus } from "lucide-react";
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

interface AddSiteToGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  onAdd: (siteName: string) => void;
}

const AddSiteToGroupDialog = ({ open, onOpenChange, groupName, onAdd }: AddSiteToGroupDialogProps) => {
  const [siteName, setSiteName] = useState("");

  const handleAdd = () => {
    if (siteName.trim()) {
      onAdd(siteName.trim());
      setSiteName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Site to {groupName}</DialogTitle>
          <DialogDescription>
            This site will share the group's time and opens limits.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="site-url">Website URL</Label>
            <Input
              id="site-url"
              placeholder="e.g., tiktok.com"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="rounded-xl"
            />
          </div>
          {/* Common suggestions */}
          <div className="space-y-2">
            <Label>Quick add</Label>
            <div className="flex flex-wrap gap-2">
              {["tiktok.com", "linkedin.com", "pinterest.com", "snapchat.com"].map((site) => (
                <Button
                  key={site}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setSiteName(site)}
                >
                  {site}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!siteName.trim()} className="rounded-xl">
            <Plus size={16} className="mr-2" />
            Add to Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSiteToGroupDialog;
