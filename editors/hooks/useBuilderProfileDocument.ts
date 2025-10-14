import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  BuilderProfileAction,
  BuilderProfileDocument,
} from "../../document-models/builder-profile/index.js";

export function useBuilderProfileDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<BuilderProfileDocument, BuilderProfileAction>(
    documentId,
    "powerhouse/builder-profile",
  );
}

export function useSelectedBuilderProfileDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useBuilderProfileDocument(selectedDocumentId);
}
