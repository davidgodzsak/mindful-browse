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
import { t } from "@/lib/utils/i18n";

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
          <DialogTitle>{t("dialog_addToGroup_title", groupName)}</DialogTitle>
          <DialogDescription>
            {t("dialog_addToGroup_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="site-url">{t("dialog_addToGroup_label_websiteUrl")}</Label>
            <Input
              id="site-url"
              placeholder={t("dialog_addToGroup_placeholder_websiteUrl")}
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="rounded-xl"
            />
          </div>
          {/* Common suggestions */}
          <div className="space-y-2">
            <Label>{t("dialog_addToGroup_quickAdd_label")}</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "tiktok", value: "dialog_addToGroup_quickAdd_tiktok" },
                { key: "linkedin", value: "dialog_addToGroup_quickAdd_linkedin" },
                { key: "pinterest", value: "dialog_addToGroup_quickAdd_pinterest" },
                { key: "snapchat", value: "dialog_addToGroup_quickAdd_snapchat" },
              ].map((site) => (
                <Button
                  key={site.key}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setSiteName(t(site.value))}
                >
                  {t(site.value)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            {t("dialog_addToGroup_button_cancel")}
          </Button>
          <Button onClick={handleAdd} disabled={!siteName.trim()} className="rounded-xl">
            <Plus size={16} className="mr-2" />
            {t("dialog_addToGroup_button_add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSiteToGroupDialog;
