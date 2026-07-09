import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types";
import type {
  CreateDocumentPayload,
  DashboardDocumentDto,
  DocumentDto,
  ShareDocumentPayload,
  UpdateDocumentPayload,
} from "@/types/document";

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.data) {
    throw new Error(response.message || "Request failed");
  }

  return response.data;
}

export async function createDocument(payload: CreateDocumentPayload): Promise<DocumentDto> {
  const { data } = await apiClient.post<ApiResponse<DocumentDto>>("/documents", payload);
  return unwrap(data);
}

export async function listDocuments(): Promise<DashboardDocumentDto[]> {
  const { data } = await apiClient.get<ApiResponse<DashboardDocumentDto[]>>("/documents");
  return unwrap(data);
}

export async function getDocument(documentId: string): Promise<DocumentDto> {
  const { data } = await apiClient.get<ApiResponse<DocumentDto>>(`/documents/${documentId}`);
  return unwrap(data);
}

export async function updateDocument(
  documentId: string,
  payload: UpdateDocumentPayload,
): Promise<DocumentDto> {
  const { data } = await apiClient.patch<ApiResponse<DocumentDto>>(
    `/documents/${documentId}`,
    payload,
  );
  return unwrap(data);
}

export async function shareDocument(
  documentId: string,
  payload: ShareDocumentPayload,
): Promise<DocumentDto> {
  const { data } = await apiClient.post<ApiResponse<DocumentDto>>(
    `/documents/${documentId}/share`,
    payload,
  );
  return unwrap(data);
}

export async function removeCollaborator(
  documentId: string,
  userId: string,
): Promise<DocumentDto> {
  const { data } = await apiClient.delete<ApiResponse<DocumentDto>>(
    `/documents/${documentId}/share/${userId}`,
  );
  return unwrap(data);
}

export async function updateCollaboratorRole(
  documentId: string,
  userId: string,
  role: ShareDocumentPayload["role"],
): Promise<DocumentDto> {
  const { data } = await apiClient.patch<ApiResponse<DocumentDto>>(
    `/documents/${documentId}/share/${userId}`,
    { role },
  );
  return unwrap(data);
}
