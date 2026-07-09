import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types";
import type { DocumentDto, DocumentVersionDto } from "@/types/document";

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.data) {
    throw new Error(response.message || "Request failed");
  }

  return response.data;
}

export async function listDocumentVersions(documentId: string): Promise<DocumentVersionDto[]> {
  const { data } = await apiClient.get<ApiResponse<DocumentVersionDto[]>>(
    `/documents/${documentId}/versions`,
  );
  return unwrap(data);
}

export async function getDocumentVersion(
  documentId: string,
  versionId: string,
): Promise<DocumentVersionDto> {
  const { data } = await apiClient.get<ApiResponse<DocumentVersionDto>>(
    `/documents/${documentId}/versions/${versionId}`,
  );
  return unwrap(data);
}

export async function restoreDocumentVersion(
  documentId: string,
  versionId: string,
): Promise<DocumentDto> {
  const { data } = await apiClient.post<ApiResponse<DocumentDto>>(
    `/documents/${documentId}/versions/${versionId}/restore`,
  );
  return unwrap(data);
}
