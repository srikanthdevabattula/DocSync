"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { EditorSkeleton } from "@/components/common/skeletons";
import { useAppSelector } from "@/redux/hooks";
import { getDocument } from "@/services/document.service";
import type { DocumentDto } from "@/types/document";
import type { Collaborator, EditorDocument, CollaboratorRole } from "@/types/editor";
import { applyDraftIfNewer } from "@/utils/document-draft-storage";
import { mapToEditorDocument } from "@/utils/document-mappers";
import {
  canEditWithRole,
  canManageSharingWithRole,
  getUserDocumentRole,
} from "@/utils/document-permissions";
import { isAuthError } from "@/utils/api-error";
import { showToast } from "@/utils/toast";

type DocumentEditorPageProps = {
  documentId: string;
};

export function DocumentEditorPage({ documentId }: DocumentEditorPageProps) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAppSelector((state) => state.auth);
  const [document, setDocument] = useState<EditorDocument | null>(null);
  const [sourceDocument, setSourceDocument] = useState<DocumentDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    async function loadDocument() {
      setIsLoading(true);

      try {
        const response = await getDocument(documentId);
        const merged = applyDraftIfNewer(response, documentId);

        if (!cancelled) {
          setSourceDocument(merged);
          setDocument(mapToEditorDocument(merged));
        }
      } catch (error) {
        if (!cancelled && !isAuthError(error)) {
          showToast.error(
            "Could not load document",
            error instanceof Error ? error.message : "Please try again.",
          );
          router.replace("/");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDocument();

    return () => {
      cancelled = true;
    };
  }, [documentId, isAuthenticated, isHydrated, router]);

  const userRole = useMemo<CollaboratorRole | null>(
    () => (user && sourceDocument ? getUserDocumentRole(sourceDocument, user.id) : null),
    [sourceDocument, user],
  );

  const canEdit = canEditWithRole(userRole);
  const canManageSharing = canManageSharingWithRole(userRole);

  const handleCollaboratorsChange = (collaborators: Collaborator[]) => {
    setDocument((current) => (current ? { ...current, collaborators } : current));
  };

  if (!isHydrated || isLoading || !document) {
    return <EditorSkeleton />;
  }

  return (
    <DocumentEditor
      document={document}
      userRole={userRole}
      currentUserId={user?.id}
      canEdit={canEdit}
      canManageSharing={canManageSharing}
      onCollaboratorsChange={handleCollaboratorsChange}
    />
  );
}
