import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  requestForProposalsDocumentType,
} from "../../document-models/request-for-proposals/index.js";

import type {
  RequestForProposalsDocument,
  EditRfpInput,
  AddContextDocumentInput,
  RemoveContextDocumentInput,
  AddProposalInput,
  ChangeProposalStatusInput,
  RemoveProposalInput,
} from "../../document-models/request-for-proposals/index.js";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      RequestForProposals: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc =
              await reactor.getDocument<RequestForProposalsDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<RequestForProposalsDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) =>
                doc.header.documentType === requestForProposalsDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      RequestForProposals_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          requestForProposalsDocumentType,
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: requestForProposalsDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      RequestForProposals_editRfp: async (
        _: unknown,
        args: { docId: string; input: EditRfpInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<RequestForProposalsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.editRfp(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editRfp");
        }

        return true;
      },

      RequestForProposals_addContextDocument: async (
        _: unknown,
        args: { docId: string; input: AddContextDocumentInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<RequestForProposalsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addContextDocument(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addContextDocument",
          );
        }

        return true;
      },

      RequestForProposals_removeContextDocument: async (
        _: unknown,
        args: { docId: string; input: RemoveContextDocumentInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<RequestForProposalsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeContextDocument(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeContextDocument",
          );
        }

        return true;
      },

      RequestForProposals_addProposal: async (
        _: unknown,
        args: { docId: string; input: AddProposalInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<RequestForProposalsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addProposal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addProposal");
        }

        return true;
      },

      RequestForProposals_changeProposalStatus: async (
        _: unknown,
        args: { docId: string; input: ChangeProposalStatusInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<RequestForProposalsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.changeProposalStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to changeProposalStatus",
          );
        }

        return true;
      },

      RequestForProposals_removeProposal: async (
        _: unknown,
        args: { docId: string; input: RemoveProposalInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<RequestForProposalsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeProposal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeProposal");
        }

        return true;
      },
    },
  };
};
