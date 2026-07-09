import type { Metadata } from "next";
import { DocumentEditorPage } from "@/components/editor/DocumentEditorPage";

type DocumentPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Document ${id} | DocSync`,
    description: "Edit and collaborate on your document",
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;

  return <DocumentEditorPage documentId={id} />;
}
