import type { ReactNode } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { appConfig } from "@/lib/env";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
};

export function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50/80 px-4 py-10 dark:bg-zinc-950">
      <div className={cn("w-full max-w-[430px]", className)}>
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105"
            aria-label={`${appConfig.name} home`}
          >
            <FileText className="size-6" aria-hidden="true" />
          </Link>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {appConfig.name}
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>

        <Card className="border border-border/80 bg-white shadow-xl shadow-zinc-200/60 dark:bg-card dark:shadow-none">
          <CardContent className="px-6 py-7 sm:px-8">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
