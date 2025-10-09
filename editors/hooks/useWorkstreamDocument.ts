import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  WorkstreamAction,
  WorkstreamDocument,
} from "../../document-models/workstream/index.js";

export function useWorkstreamDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<WorkstreamDocument, WorkstreamAction>(
    documentId,
    "powerhouse/workstream",
  );
}

export function useSelectedWorkstreamDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useWorkstreamDocument(selectedDocumentId);
}
