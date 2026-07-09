"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { removeCollaborator, shareDocument, updateCollaboratorRole } from "@/services/document.service";
import type { Collaborator, CollaboratorRole, ShareableRole } from "@/types/editor";
import { mapCollaborators } from "@/utils/document-mappers";
import {
  ROLE_BADGE_CLASS,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  sortCollaboratorsByRole,
} from "@/utils/document-permissions";
import { cn } from "@/lib/utils";
import { showToast } from "@/utils/toast";

const ALL_ROLES: CollaboratorRole[] = ["owner", "editor", "viewer"];

type ShareDocumentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  collaborators: Collaborator[];
  currentUserId?: string;
  canManageSharing: boolean;
  onCollaboratorsChange: (collaborators: Collaborator[]) => void;
};

export function ShareDocumentModal({
  open,
  onOpenChange,
  documentId,
  collaborators,
  currentUserId,
  canManageSharing,
  onCollaboratorsChange,
}: ShareDocumentModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ShareableRole>("editor");
  const [people, setPeople] = useState(collaborators);
  const [isInviting, setIsInviting] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (open) setPeople(collaborators);
  }, [open, collaborators]);

  const sortedPeople = useMemo(() => sortCollaboratorsByRole(people), [people]);

  const handleRemove = async (person: Collaborator) => {
    if (!canManageSharing || person.role === "owner") return;

    setRemovingUserId(person.userId);

    try {
      const updated = await removeCollaborator(documentId, person.userId);
      const nextCollaborators = mapCollaborators(updated);
      setPeople(nextCollaborators);
      onCollaboratorsChange(nextCollaborators);
      showToast.info("Access removed", "Collaborator removed from this document.");
    } catch (error) {
      showToast.error(
        "Could not remove access",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleRoleChange = async (person: Collaborator, nextRole: ShareableRole) => {
    if (!canManageSharing || person.role === "owner" || person.role === nextRole) return;

    setUpdatingUserId(person.userId);

    try {
      const updated = await updateCollaboratorRole(documentId, person.userId, nextRole);
      const nextCollaborators = mapCollaborators(updated);
      setPeople(nextCollaborators);
      onCollaboratorsChange(nextCollaborators);
      showToast.success("Role updated", `${person.name} is now a ${nextRole}.`);
    } catch (error) {
      showToast.error(
        "Could not update role",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleInvite = async () => {
    if (!canManageSharing) {
      showToast.error("Permission denied", "Only the document owner can share this document.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      showToast.error("Invalid email", "Please enter a valid email address.");
      return;
    }

    setIsInviting(true);

    try {
      const updated = await shareDocument(documentId, { email: email.trim(), role });
      const nextCollaborators = mapCollaborators(updated);
      setPeople(nextCollaborators);
      onCollaboratorsChange(nextCollaborators);
      showToast.success("Document shared", `Access granted to ${email.trim()}`);
      setEmail("");
    } catch (error) {
      showToast.error(
        "Could not share document",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md">
        <DialogHeader className="space-y-1.5 border-b border-border/80 px-5 py-4">
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            Invite collaborators and manage their access permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-5 py-4">
          <div className="space-y-2.5 rounded-xl border border-border/80 bg-muted/15 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Role permissions
            </p>
            <div className="space-y-2">
              {ALL_ROLES.map((roleKey) => (
                <div key={roleKey} className="flex items-start gap-2.5">
                  <Badge
                    variant="outline"
                    className={cn("mt-0.5 shrink-0 rounded-full px-2.5", ROLE_BADGE_CLASS[roleKey])}
                  >
                    {ROLE_LABELS[roleKey]}
                  </Badge>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {ROLE_DESCRIPTIONS[roleKey]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {canManageSharing ? (
            <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3">
              <Label htmlFor="invite-email" className="text-sm font-medium">
                Invite by email
              </Label>
              <div className="space-y-2">
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-lg"
                  disabled={isInviting}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void handleInvite();
                  }}
                />
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as ShareableRole)}
                    disabled={isInviting}
                  >
                    <SelectTrigger className="h-10 w-full rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    className="h-10 shrink-0 rounded-lg px-4"
                    onClick={handleInvite}
                    disabled={isInviting}
                  >
                    {isInviting ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <UserPlus className="size-4" aria-hidden="true" />
                    )}
                    Invite
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
              Only the document owner can invite collaborators.
            </p>
          )}

          <div className="space-y-2.5">
            <p className="text-sm font-medium text-foreground">
              People with access ({sortedPeople.length})
            </p>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-border/80">
              {sortedPeople.map((person, index) => {
                const isCurrentUser = currentUserId === person.userId;

                return (
                  <div
                    key={person.id}
                    className={cn(
                      "flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between",
                      index !== sortedPeople.length - 1 && "border-b border-border/60",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="sm" className="shrink-0">
                        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                          {person.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {person.name}
                          {isCurrentUser ? (
                            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                              (you)
                            </span>
                          ) : null}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{person.email}</p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                      {canManageSharing && person.role !== "owner" ? (
                        <>
                          <Select
                            value={person.role}
                            onValueChange={(value) =>
                              handleRoleChange(person, value as ShareableRole)
                            }
                            disabled={
                              updatingUserId === person.userId ||
                              removingUserId === person.userId
                            }
                          >
                            <SelectTrigger
                              className="h-9 w-[7.25rem] rounded-lg text-xs"
                              aria-label={`Change role for ${person.email}`}
                            >
                              {updatingUserId === person.userId ? (
                                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-lg text-muted-foreground hover:text-destructive"
                            aria-label={`Remove access for ${person.email}`}
                            onClick={() => handleRemove(person)}
                            disabled={removingUserId === person.userId}
                          >
                            {removingUserId === person.userId ? (
                              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <UserMinus className="size-4" aria-hidden="true" />
                            )}
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant="outline"
                          className={cn("rounded-full px-2.5", ROLE_BADGE_CLASS[person.role])}
                        >
                          {ROLE_LABELS[person.role]}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
