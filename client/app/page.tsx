import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "DocSync",
  description: "Manage and organize your collaborative documents",
};

export default function HomePage() {
  return <Dashboard />;
}
