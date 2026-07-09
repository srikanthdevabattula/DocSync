import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { EditorDocument, SaveStatus, CollaboratorRole } from "@/types/editor";
import { ROLE_BADGE_CLASS, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/utils/document-permissions";
import { cn } from "@/lib/utils";

const statusLabels: Record<SaveStatus, string> = {
  saving: "Saving",
  saved: "Synced",
  offline: "Offline",
};

type DocumentInfoProps = {
  document: Pick<
    EditorDocument,
    | "owner"
    | "createdDate"
    | "lastUpdated"
    | "wordCount"
    | "characterCount"
    | "status"
    | "versionNumber"
  >;
  userRole?: CollaboratorRole | null;
  className?: string;
};

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export function DocumentInfo({ document, userRole, className }: DocumentInfoProps) {
  return (
    <aside className={cn("w-full shrink-0 lg:w-80", className)}>
      <Card className="rounded-xl border-border/80 bg-white shadow-sm dark:bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Document Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userRole ? (
            <>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Your access</span>
                <Badge
                  variant="outline"
                  className={cn("rounded-full", ROLE_BADGE_CLASS[userRole])}
                >
                  {ROLE_LABELS[userRole]}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {ROLE_DESCRIPTIONS[userRole]}
              </p>
              <Separator />
            </>
          ) : null}
          <InfoRow label="Owner" value={document.owner} />
          <Separator />
          <InfoRow label="Created" value={document.createdDate} />
          <InfoRow label="Last Updated" value={document.lastUpdated} />
          <Separator />
          <InfoRow label="Word Count" value={document.wordCount.toLocaleString()} />
          <InfoRow label="Character Count" value={document.characterCount.toLocaleString()} />
          <Separator />
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="rounded-full">
              {statusLabels[document.status]}
            </Badge>
          </div>
          <InfoRow label="Version" value={`v${document.versionNumber}`} />
        </CardContent>
      </Card>
    </aside>
  );
}
