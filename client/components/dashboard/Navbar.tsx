"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, LogOut, Menu, Plus, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateDocumentButton } from "@/components/dashboard/CreateDocumentButton";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { appConfig } from "@/lib/env";
import { logout } from "@/redux/slices/auth-slice";
import { cn } from "@/lib/utils";

type NavbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isHydrated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-white/90 backdrop-blur-md dark:bg-background/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">
                {appConfig.name}
              </span>
            </Link>
          </div>

          <div className="hidden flex-1 justify-center px-6 md:flex lg:px-10">
            <SearchBar value={searchQuery} onChange={onSearchChange} className="max-w-xl" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <CreateDocumentButton />

            {isHydrated && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label="Open user menu"
                >
                  <Avatar size="default">
                    <AvatarFallback className="bg-primary/10 font-medium text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg">
                    <User className="size-4" aria-hidden="true" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="rounded-lg"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost" }), "rounded-xl")}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-xl shadow-sm shadow-primary/15",
                  )}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className="rounded-xl sm:hidden"
                  />
                }
              >
                <Menu className="size-5" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100vw-2rem,20rem)] rounded-l-2xl">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-3 px-1">
                  <SearchBar value={searchQuery} onChange={onSearchChange} />
                  <Button type="button" className="h-10 w-full rounded-xl" onClick={() => undefined}>
                    <Plus className="size-4" aria-hidden="true" />
                    Create Document
                  </Button>
                  {isHydrated && !isAuthenticated ? (
                    <>
                      <Link
                        href="/login"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-10 w-full rounded-xl",
                        )}
                      >
                        Log In
                      </Link>
                      <Link
                        href="/register"
                        className={cn(buttonVariants({ variant: "default" }), "h-10 w-full rounded-xl")}
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="md:hidden">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {isHydrated && !isAuthenticated ? (
          <div className="flex gap-2 sm:hidden">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }), "h-9 flex-1 rounded-xl")}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "default" }), "h-9 flex-1 rounded-xl")}
            >
              Sign Up
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
