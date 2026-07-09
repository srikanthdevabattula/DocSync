import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  className,
  placeholder = "Search documents...",
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search documents"
        className="h-10 w-full rounded-xl border-border/80 bg-white pl-10 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:shadow-md dark:bg-card"
      />
    </div>
  );
}
