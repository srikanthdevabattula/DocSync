import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  CloudOff,
  FileText,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types/dashboard";

const iconMap: Record<DashboardStat["icon"], LucideIcon> = {
  documents: FileText,
  shared: Users,
  offline: CloudOff,
  recent: Clock3,
};

type StatsCardProps = {
  stat: DashboardStat;
  className?: string;
};

export function StatsCard({ stat, className }: StatsCardProps) {
  const Icon = iconMap[stat.icon];

  return (
    <Card
      className={cn(
        "rounded-xl border-border/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-card",
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
