import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export function Loader({ size = "md", label = "Loading", className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)} role="status" aria-live="polite">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
