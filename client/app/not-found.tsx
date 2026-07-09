import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center bg-zinc-50/80 px-4 dark:bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-white p-8 text-center shadow-xl shadow-zinc-200/60 dark:bg-card dark:shadow-none">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileQuestion className="size-8" aria-hidden="true" />
        </div>
        <p className="text-5xl font-bold tracking-tight text-primary">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Page Not Found</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-8 rounded-xl")}>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
