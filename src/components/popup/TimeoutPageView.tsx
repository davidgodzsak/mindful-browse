import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, AlertCircle, Loader2 } from "lucide-react";
import Logo from "../Logo";

interface TimeoutPageViewProps {
  originalTimeLimit: number;
  originalOpensLimit: number;
  siteId: string | null;
  blockedUrl: string | null;
  isSaving: boolean;
  onExtendLimit: (minutes: number, opens: number, excuse: string) => Promise<void>;
  onOpenSettings: () => void;
}

export function TimeoutPageView({
  originalTimeLimit,
  originalOpensLimit,
  siteId,
  blockedUrl,
  isSaving,
  onExtendLimit,
  onOpenSettings,
}: TimeoutPageViewProps) {
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(0);
  const [extendOpens, setExtendOpens] = useState(0);
  const [excuse, setExcuse] = useState("");
  const [isExtending, setIsExtending] = useState(false);
  const [extensionError, setExtensionError] = useState<string | null>(null);
  const [isExtended, setIsExtended] = useState(false);

  const newTimeLimit = originalTimeLimit + extendMinutes;
  const newOpensLimit = originalOpensLimit + extendOpens;

  const handleExtend = async () => {
    if (excuse.length < 35) {
      setExtensionError("Excuse must be at least 35 characters");
      return;
    }
    if (extendMinutes <= 0 && extendOpens <= 0) {
      setExtensionError("Must extend either time or opens");
      return;
    }

    try {
      setIsExtending(true);
      setExtensionError(null);
      await onExtendLimit(extendMinutes, extendOpens, excuse);
      setShowExtendForm(false);
      setExtendMinutes(0);
      setExtendOpens(0);
      setExcuse("");
      setIsExtended(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setExtensionError(message);
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <Card className="w-80 shadow-soft border-0 overflow-hidden">
      <div className="gradient-mint p-4">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings size={18} />
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="font-medium">Timeout Page</p>
            <p className="text-sm text-muted-foreground">
              {showExtendForm || isExtended ? "Extension Mode" : "Limit reached"}
            </p>
          </div>
        </div>

        {!showExtendForm && !isExtended && (
          <p className="text-sm text-muted-foreground mb-4">
            You've reached a limit. Take a break and come back later.
          </p>
        )}

        {siteId && (
          <div className="border-t pt-4">
            {!showExtendForm ? (
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => setShowExtendForm(true)}
              >
                Extend Limits
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">Extend your limit</p>

                {(originalTimeLimit > 0 || originalOpensLimit > 0) && (
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    {originalTimeLimit > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Time limit:</span>
                        <span className="font-medium">
                          {originalTimeLimit}{" "}
                          <span className="text-muted-foreground text-[10px]">
                            min
                          </span>
                          {extendMinutes > 0 && (
                            <>
                              {" "}
                              → {newTimeLimit}{" "}
                              <span className="text-muted-foreground text-[10px]">
                                min
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    {originalOpensLimit > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Open limit:
                        </span>
                        <span className="font-medium">
                          {originalOpensLimit}{" "}
                          <span className="text-muted-foreground text-[10px]">
                            opens
                          </span>
                          {extendOpens > 0 && (
                            <>
                              {" "}
                              → {newOpensLimit}{" "}
                              <span className="text-muted-foreground text-[10px]">
                                opens
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground">
                    Extra minutes (0-60)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={60}
                    value={extendMinutes}
                    onChange={(e) => setExtendMinutes(parseInt(e.target.value) || 0)}
                    disabled={isExtending}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">
                    Extra opens (0-10)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={extendOpens}
                    onChange={(e) => setExtendOpens(parseInt(e.target.value) || 0)}
                    disabled={isExtending}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">
                    Why do you need more time?
                  </label>
                  <Textarea
                    value={excuse}
                    onChange={(e) => setExcuse(e.target.value)}
                    placeholder="Explain why you need to extend this limit..."
                    disabled={isExtending}
                    className="min-h-[60px] rounded-xl"
                  />
                  <p
                    className={`text-xs mt-1 ${
                      excuse.length >= 35
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {excuse.length}/35 characters
                  </p>
                </div>

                {extensionError && (
                  <p className="text-xs text-red-600">{extensionError}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowExtendForm(false);
                      setExtensionError(null);
                    }}
                    disabled={isExtending}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExtend}
                    disabled={
                      isExtending ||
                      excuse.length < 35 ||
                      (extendMinutes <= 0 && extendOpens <= 0)
                    }
                    className="flex-1 rounded-xl"
                  >
                    {isExtending ? (
                      <>
                        <Loader2 size={14} className="mr-1 animate-spin" />
                        Extending...
                      </>
                    ) : (
                      "Extend"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
