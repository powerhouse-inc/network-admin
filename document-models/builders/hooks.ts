import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  BuildersDocument,
  BuildersAction,
} from "@powerhousedao/network-admin/document-models/builders";
import { isBuildersDocument } from "./gen/document-schema.js";

/** Hook to get a Builders document by its id */
export function useBuildersDocumentById(
  documentId: string | null | undefined,
):
  | [BuildersDocument, DocumentDispatch<BuildersAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isBuildersDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Builders document */
export function useSelectedBuildersDocument():
  | [BuildersDocument, DocumentDispatch<BuildersAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isBuildersDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all Builders documents in the selected drive */
export function useBuildersDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isBuildersDocument);
}

/** Hook to get all Builders documents in the selected folder */
export function useBuildersDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isBuildersDocument);
}
