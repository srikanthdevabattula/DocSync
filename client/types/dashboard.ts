export type DocumentStatus = "synced" | "offline" | "syncing";

export type Document = {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  lastUpdated: string;
  status: DocumentStatus;
};

export type DashboardStat = {
  id: string;
  title: string;
  value: number;
  icon: "documents" | "shared" | "offline" | "recent";
};

export type DashboardUser = {
  name: string;
  email: string;
  initials: string;
};
