import Link from "next/link";
import { cn } from "@/lib/utils";

const PROFILES = {
  name: "Srikanth Devabattula",
  github: "https://github.com/srikanthdevabattula",
  linkedin: "https://www.linkedin.com/in/srikanth-devabattula-a22065141/",
} as const;

type AppFooterProps = {
  className?: string;
};

export function AppFooter({ className }: AppFooterProps) {
  return (
    <footer
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 px-4 py-3 text-center text-sm text-muted-foreground backdrop-blur-md sm:px-6",
        className,
      )}
    >
      <p className="font-medium text-foreground">{PROFILES.name}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link
          href={PROFILES.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-primary"
        >
          GitHub Profile
        </Link>
        <span className="hidden text-border sm:inline" aria-hidden="true">
          ·
        </span>
        <Link
          href={PROFILES.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-primary"
        >
          LinkedIn Profile
        </Link>
      </div>
    </footer>
  );
}
