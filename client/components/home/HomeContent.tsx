"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/auth-slice";

export function HomeContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isHydrated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  if (!isHydrated) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">DocSync — collaborative document editor</p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign Up
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border/80 bg-white p-8 text-center shadow-xl shadow-zinc-200/60 dark:bg-card dark:shadow-none">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <FileText className="size-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;re signed in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Your document workspace is ready. Start creating and collaborating soon.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-8 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign Out
        </Button>
      </div>
    </main>
  );
}
