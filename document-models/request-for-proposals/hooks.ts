import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  RequestForProposalsDocument,
  RequestForProposalsAction,
} from "@powerhousedao/network-admin/document-models/request-for-proposals";
import { isRequestForProposalsDocument } from "./gen/document-schema.js";

/** Hook to get a RequestForProposals document by its id */
export function useRequestForProposalsDocumentById(
  documentId: string | null | undefined,
):
  | [RequestForProposalsDocument, DocumentDispatch<RequestForProposalsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isRequestForProposalsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected RequestForProposals document */
export function useSelectedRequestForProposalsDocument():
  | [RequestForProposalsDocument, DocumentDispatch<RequestForProposalsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isRequestForProposalsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all RequestForProposals documents in the selected drive */
export function useRequestForProposalsDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isRequestForProposalsDocument);
}

/** Hook to get all RequestForProposals documents in the selected folder */
export function useRequestForProposalsDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isRequestForProposalsDocument);
}
