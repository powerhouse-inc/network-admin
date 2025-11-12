import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  WorkstreamDocument,
  WorkstreamAction,
} from "./gen/types.js";
import { isWorkstreamDocument } from "./gen/document-schema.js";

/** Hook to get a Workstream document by its id */
export function useWorkstreamDocumentById(
  documentId: string | null | undefined,
):
  | [WorkstreamDocument, DocumentDispatch<WorkstreamAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isWorkstreamDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Workstream document */
export function useSelectedWorkstreamDocument():
  | [WorkstreamDocument, DocumentDispatch<WorkstreamAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isWorkstreamDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all Workstream documents in the selected drive */
export function useWorkstreamDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isWorkstreamDocument);
}

/** Hook to get all Workstream documents in the selected folder */
export function useWorkstreamDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isWorkstreamDocument);
}
