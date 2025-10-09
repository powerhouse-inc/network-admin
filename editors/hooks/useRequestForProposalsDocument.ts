import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  RequestForProposalsAction,
  RequestForProposalsDocument,
} from "../../document-models/request-for-proposals/index.js";

export function useRequestForProposalsDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<RequestForProposalsDocument, RequestForProposalsAction>(
    documentId,
    "powerhouse/rfp",
  );
}

export function useSelectedRequestForProposalsDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useRequestForProposalsDocument(selectedDocumentId);
}
