import { useEffect, useState } from "react";
import {
  ChevronRight,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SpotlightOverlayProps {
  targetSelector: string;
  title: string;
  message: string;
  onSkip: () => void;
  onContinue?: () => void;
  onFinish?: () => void;
  isLastStep?: boolean;
  successMessage?: string;
  showSuccess?: boolean;
  hideNextButton?: boolean;
}

export function SpotlightOverlay({
  targetSelector,
  title,
  message,
  onSkip,
  onContinue,
  onFinish,
  isLastStep,
  successMessage,
  showSuccess,
  hideNextButton,
}: SpotlightOverlayProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [bubblePosition, setBubblePosition] = useState<{
    top: number;
    left: number;
    direction: "right" | "bottom";
  }>({ top: 0, left: 0, direction: "right" });

  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(targetSelector) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        setTargetElement(element);

        // Add glow to element
        element.style.boxShadow =
          "0 0 0 3px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.8)";
        element.classList.add("animate-pulse");

        // Position bubble to the right of the element, or below if on the right side
        const rightSpace = window.innerWidth - rect.right;
        const bubbleWidth = 360;

        if (rightSpace > bubbleWidth + 20) {
          // Enough space on the right
          setBubblePosition({
            top: rect.top + rect.height / 2,
            left: rect.right + 20,
            direction: "right",
          });
        } else {
          // Position below
          setBubblePosition({
            top: rect.bottom + 20,
            left: Math.max(10, rect.left + rect.width / 2 - bubbleWidth / 2),
            direction: "bottom",
          });
        }
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);

      // Clean up glow when unmounting
      if (targetElement) {
        targetElement.style.boxShadow = "";
        targetElement.classList.remove("animate-pulse");
      }
    };
  }, [targetSelector, targetElement]);

  if (!targetRect) return null;

  return (
    <>
      {/* Message Bubble using shadcn Card */}
      <div
        className="fixed z-50 pointer-events-auto w-96"
        style={{
          top: `${bubblePosition.top}px`,
          left: `${bubblePosition.left}px`,
          transform:
            bubblePosition.direction === "right"
              ? "translateY(-50%)"
              : "translateY(0)",
        }}
      >
        <Card className="border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg rounded-3xl">
          {showSuccess && successMessage ? (
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold text-emerald-900">{successMessage}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <Lightbulb className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                <h3 className="font-bold text-foreground text-lg leading-tight">
                  {title}
                </h3>
              </div>

              {/* Message */}
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                {message}
              </p>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSkip}
                  className="rounded-lg"
                >
                  Skip onboarding
                </Button>
                {!hideNextButton && (
                  <>
                    {isLastStep ? (
                      <Button
                        size="sm"
                        onClick={onFinish}
                        className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-1"
                      >
                        Finish
                        <ChevronRight size={16} />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={onContinue}
                        className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-1"
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Arrow pointer */}
        <div
          className="absolute w-3 h-3 bg-emerald-50 border-2 border-emerald-500 rotate-45"
          style={{
            top:
              bubblePosition.direction === "right"
                ? "calc(50% - 6px)"
                : "-6px",
            left:
              bubblePosition.direction === "right"
                ? "-6px"
                : "calc(50% - 6px)",
          }}
        />
      </div>
    </>
  );
}
