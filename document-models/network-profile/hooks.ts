import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  NetworkProfileDocument,
  NetworkProfileAction,
} from "./gen/types.js";
import { isNetworkProfileDocument } from "./gen/document-schema.js";

/** Hook to get a NetworkProfile document by its id */
export function useNetworkProfileDocumentById(
  documentId: string | null | undefined,
):
  | [NetworkProfileDocument, DocumentDispatch<NetworkProfileAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isNetworkProfileDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected NetworkProfile document */
export function useSelectedNetworkProfileDocument():
  | [NetworkProfileDocument, DocumentDispatch<NetworkProfileAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isNetworkProfileDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all NetworkProfile documents in the selected drive */
export function useNetworkProfileDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isNetworkProfileDocument);
}

/** Hook to get all NetworkProfile documents in the selected folder */
export function useNetworkProfileDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isNetworkProfileDocument);
}
