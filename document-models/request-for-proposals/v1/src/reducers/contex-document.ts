import type { RequestForProposalsContexDocumentOperations } from "@powerhousedao/network-admin/document-models/request-for-proposals/v1";

export const requestForProposalsContexDocumentOperations: RequestForProposalsContexDocumentOperations =
  {
    addContextDocumentOperation(state, action) {
      state.contextDocuments.push({
        name: action.input.name,
        url: action.input.url,
      });
    },
    removeContextDocumentOperation(state, action) {
      state.contextDocuments = state.contextDocuments.filter(
        (document) => document.name !== action.input.name,
      );
    },
  };
