import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  NetworkProfileAction,
  NetworkProfileDocument,
} from "../../document-models/network-profile/index.js";

export function useNetworkProfileDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<NetworkProfileDocument, NetworkProfileAction>(
    documentId,
    "powerhouse/network-profile",
  );
}

export function useSelectedNetworkProfileDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return useNetworkProfileDocument(selectedDocumentId);
}
