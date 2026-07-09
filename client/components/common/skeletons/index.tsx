import { Skeleton } from "@/components/ui/skeleton";

export function DocumentCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/80 bg-white p-5 shadow-sm dark:bg-card">
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="size-11 rounded-xl" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      <Skeleton className="mt-3 h-4 w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-5/6 rounded-lg" />
      <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="bg-zinc-50/80 dark:bg-background">
      <div className="border-b border-border/80 bg-white px-4 py-3 dark:bg-card sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="hidden h-10 max-w-xl flex-1 rounded-xl md:block" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-72 rounded-lg" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border/80 bg-white p-5 dark:bg-card">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="mt-3 h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <DocumentCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="bg-zinc-50/80 dark:bg-background">
      <div className="border-b border-border/80 bg-white px-4 py-3 dark:bg-card sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </div>
      <div className="border-b border-border/80 bg-white px-4 py-2 dark:bg-card">
        <div className="flex gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="size-8 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <Skeleton className="min-h-[60vh] rounded-2xl" />
      </div>
    </div>
  );
}

export function ShareModalSkeleton() {
  return (
    <div className="space-y-5 p-1">
      <Skeleton className="h-4 w-40 rounded-lg" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-4 w-36 rounded-lg" />
      <div className="space-y-2 rounded-xl border border-border/80 p-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-2">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-28 rounded-lg" />
              <Skeleton className="h-3 w-36 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VersionHistorySkeleton() {
  return (
    <div className="mt-6 space-y-6 pr-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <Skeleton className="h-32 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
