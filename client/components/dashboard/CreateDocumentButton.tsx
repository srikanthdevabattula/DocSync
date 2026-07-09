import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CreateDocumentButtonProps = {
  variant?: "default" | "floating";
  className?: string;
  onClick?: () => void;
};

export function CreateDocumentButton({
  variant = "default",
  className,
  onClick,
}: CreateDocumentButtonProps) {
  if (variant === "floating") {
    return (
      <Button
        type="button"
        size="icon-lg"
        aria-label="Create new document"
        onClick={onClick}
        className={cn(
          "fixed right-5 bottom-5 z-40 size-14 rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 md:hidden",
          className,
        )}
      >
        <Plus className="size-6" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "hidden h-10 rounded-xl px-4 shadow-sm shadow-primary/15 transition-all hover:shadow-md hover:shadow-primary/20 md:inline-flex",
        className,
      )}
    >
      <Plus className="size-4" aria-hidden="true" />
      Create Document
    </Button>
  );
}
