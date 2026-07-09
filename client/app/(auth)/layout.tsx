import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DocSync",
  description: "Local-first collaborative document editor",
};

export default function AuthGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
