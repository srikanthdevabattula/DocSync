"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateDocumentButton } from "@/components/dashboard/CreateDocumentButton";
import { DocumentGrid } from "@/components/dashboard/DocumentGrid";
import { Navbar } from "@/components/dashboard/Navbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardSkeleton } from "@/components/common/skeletons";
import { CreateDocumentModal } from "@/components/modals/CreateDocumentModal";
import { RenameDocumentModal } from "@/components/modals/RenameDocumentModal";
import { DeleteDocumentDialog } from "@/components/dialogs/DeleteDocumentDialog";
import { useAppSelector } from "@/redux/hooks";
import { createDocument, listDocuments } from "@/services/document.service";
import type { Document } from "@/types/dashboard";
import type { CreateDocumentFormValues } from "@/lib/validations/documents";
import { computeDashboardStats } from "@/utils/document-factories";
import { mapToDashboardDocument } from "@/utils/document-mappers";
import { isAuthError } from "@/utils/api-error";
import { showToast } from "@/utils/toast";

export function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadDocuments() {
      setIsLoading(true);

      try {
        const response = await listDocuments();
        if (!cancelled) {
          setDocuments(response.map(mapToDashboardDocument));
        }
      } catch (error) {
        if (!cancelled && !isAuthError(error)) {
          showToast.error(
            "Could not load documents",
            error instanceof Error ? error.message : "Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDocuments();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isHydrated]);

  const stats = useMemo(() => computeDashboardStats(documents), [documents]);

  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return documents;

    return documents.filter(
      (document) =>
        document.title.toLowerCase().includes(query) ||
        document.description.toLowerCase().includes(query) ||
        document.ownerName.toLowerCase().includes(query),
    );
  }, [documents, searchQuery]);

  const handleCreateDocument = () => setCreateOpen(true);

  const handleCreateSubmit = async (values: CreateDocumentFormValues) => {
    setIsCreating(true);

    try {
      const created = await createDocument({
        title: values.title,
        description: values.description ?? "",
      });
      const dashboardDocument = mapToDashboardDocument({
        id: created.id,
        title: created.title,
        description: created.description,
        ownerName: user?.name ?? created.owner.name,
        lastUpdated: "Just now",
        status: "synced",
      });
      setDocuments((current) => [dashboardDocument, ...current]);
      showToast.success("Document created", `"${values.title}" is ready to edit.`);
      setCreateOpen(false);
      router.push(`/documents/${created.id}`);
    } catch (error) {
      showToast.error(
        "Could not create document",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenDocument = (document: Document) => {
    router.push(`/documents/${document.id}`);
  };

  const handleRename = (document: Document) => {
    setActiveDocument(document);
    setRenameOpen(true);
  };

  const handleDelete = (document: Document) => {
    setActiveDocument(document);
    setDeleteOpen(true);
  };

  const handleRenameSubmit = (values: { title: string }) => {
    if (!activeDocument) return;
    setDocuments((current) =>
      current.map((doc) =>
        doc.id === activeDocument.id ? { ...doc, title: values.title, lastUpdated: "Just now" } : doc,
      ),
    );
    showToast.success("Document renamed", `Renamed to "${values.title}".`);
  };

  const handleDeleteConfirm = () => {
    if (!activeDocument) return;
    setDocuments((current) => current.filter((doc) => doc.id !== activeDocument.id));
    showToast.success("Document deleted", `"${activeDocument.title}" was removed.`);
    setActiveDocument(null);
  };

  const handleDuplicate = (document: Document) => {
    showToast.info("Coming soon", "Document duplication will be available in a future update.");
  };

  if (!isHydrated || isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="bg-zinc-50/80 dark:bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            My Documents
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            Manage and organize your documents.
          </p>
        </section>

        <section
          aria-label="Document statistics"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </section>

        <section aria-label="Documents">
          <DocumentGrid
            documents={filteredDocuments}
            searchQuery={searchQuery}
            onCreateDocument={handleCreateDocument}
            onOpenDocument={handleOpenDocument}
            onRenameDocument={handleRename}
            onDeleteDocument={handleDelete}
            onDuplicateDocument={handleDuplicate}
          />
        </section>
      </main>

      <CreateDocumentButton variant="floating" onClick={handleCreateDocument} />

      <CreateDocumentModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
      />
      <RenameDocumentModal
        open={renameOpen}
        onOpenChange={setRenameOpen}
        initialTitle={activeDocument?.title}
        onSubmit={handleRenameSubmit}
      />
      <DeleteDocumentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        documentTitle={activeDocument?.title}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
