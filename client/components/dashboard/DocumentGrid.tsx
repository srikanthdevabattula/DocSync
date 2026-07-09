import { DocumentCard } from "@/components/dashboard/DocumentCard";
import {
  NoDocumentsEmptyState,
  SearchEmptyState,
} from "@/components/common/empty-states";
import type { Document } from "@/types/dashboard";

type DocumentGridProps = {
  documents: Document[];
  searchQuery?: string;
  onCreateDocument?: () => void;
  onOpenDocument?: (document: Document) => void;
  onRenameDocument?: (document: Document) => void;
  onDeleteDocument?: (document: Document) => void;
  onDuplicateDocument?: (document: Document) => void;
};

export function DocumentGrid({
  documents,
  searchQuery = "",
  onCreateDocument,
  onOpenDocument,
  onRenameDocument,
  onDeleteDocument,
  onDuplicateDocument,
}: DocumentGridProps) {
  if (documents.length === 0) {
    if (searchQuery.trim()) {
      return <SearchEmptyState query={searchQuery.trim()} />;
    }
    return <NoDocumentsEmptyState onCreateDocument={onCreateDocument} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onOpen={onOpenDocument}
          onRename={onRenameDocument}
          onDelete={onDeleteDocument}
          onDuplicate={onDuplicateDocument}
        />
      ))}
    </div>
  );
}
