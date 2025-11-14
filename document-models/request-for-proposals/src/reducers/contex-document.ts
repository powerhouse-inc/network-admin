import type { RequestForProposalsContexDocumentOperations } from "@powerhousedao/network-admin/document-models/request-for-proposals";

export const requestForProposalsContexDocumentOperations: RequestForProposalsContexDocumentOperations = {
    addContextDocumentOperation(state, action) {
        // TODO: Implement "addContextDocumentOperation" reducer
        if (action.input.name === undefined || action.input.name === null) {
            throw new Error('Context document name is required');
        }
        if (action.input.url === undefined || action.input.url === null) {
            throw new Error('Context document URL is required');
        }
        state.contextDocuments.push({
            name: action.input.name,
            url: action.input.url,
        });
    },
    removeContextDocumentOperation(state, action) {
        // TODO: Implement "removeContextDocumentOperation" reducer
        if (action.input.name === undefined || action.input.name === null) {
            throw new Error('Context document name is required');
        }
        state.contextDocuments = state.contextDocuments.filter(
            (document) => document.name !== action.input.name,
        );
    },
};
