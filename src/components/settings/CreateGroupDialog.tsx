import { useState } from "react";
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

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (group: { name: string; color: string; timeLimit: number; opensLimit: number }) => void;
}

const colorOptions = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Green", value: "bg-emerald-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Pink", value: "bg-pink-500" },
];

const CreateGroupDialog = ({ open, onOpenChange, onCreate }: CreateGroupDialogProps) => {
  const [groupName, setGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");
  const [timeLimit, setTimeLimit] = useState("30");
  const [opensLimit, setOpensLimit] = useState("10");

  const handleCreate = () => {
    if (groupName.trim()) {
      onCreate({
        name: groupName.trim(),
        color: selectedColor,
        timeLimit: parseInt(timeLimit) || 30,
        opensLimit: parseInt(opensLimit) || 10,
      });
      setGroupName("");
      setSelectedColor("bg-blue-500");
      setTimeLimit("30");
      setOpensLimit("10");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a group to share limits across multiple sites.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="e.g., Social Media"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          
          {/* Color picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full ${color.value} transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-offset-2 ring-primary"
                      : "hover:scale-110"
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="group-time-limit" className="flex items-center gap-2">
                <Clock size={14} />
                Time limit (min)
              </Label>
              <Input
                id="group-time-limit"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-opens-limit" className="flex items-center gap-2">
                <MousePointerClick size={14} />
                Opens limit
              </Label>
              <Input
                id="group-opens-limit"
                type="number"
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
          <Button onClick={handleCreate} disabled={!groupName.trim()} className="rounded-xl">
            <Plus size={16} className="mr-2" />
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
