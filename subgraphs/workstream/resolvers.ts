import { type Subgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import {
  actions,
  type EditWorkstreamInput,
  type EditClientInfoInput,
  type SetRequestForProposalInput,
  type AddPaymentRequestInput,
  type RemovePaymentRequestInput,
  type EditInitialProposalInput,
  type AddAlternativeProposalInput,
  type EditAlternativeProposalInput,
  type RemoveAlternativeProposalInput,
  type WorkstreamDocument,
} from "../../document-models/workstream/index.js";
import { setName } from "document-model";

export const getResolvers = (subgraph: Subgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      Workstream: async () => {
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

            const doc = await reactor.getDocument<WorkstreamDocument>(docId);
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
                  await reactor.getDocument<WorkstreamDocument>(docId);
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
              (doc) => doc.header.documentType === "powerhouse/workstream",
            );
          },
        };
      },
    },
    Mutation: {
      Workstream_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument("powerhouse/workstream");

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: "powerhouse/workstream",
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      Workstream_editWorkstream: async (
        _: unknown,
        args: { docId: string; input: EditWorkstreamInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editWorkstream(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editWorkstream");
        }

        return true;
      },

      Workstream_editClientInfo: async (
        _: unknown,
        args: { docId: string; input: EditClientInfoInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editClientInfo(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to editClientInfo");
        }

        return true;
      },

      Workstream_setRequestForProposal: async (
        _: unknown,
        args: { docId: string; input: SetRequestForProposalInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setRequestForProposal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setRequestForProposal",
          );
        }

        return true;
      },

      Workstream_addPaymentRequest: async (
        _: unknown,
        args: { docId: string; input: AddPaymentRequestInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addPaymentRequest(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addPaymentRequest",
          );
        }

        return true;
      },

      Workstream_removePaymentRequest: async (
        _: unknown,
        args: { docId: string; input: RemovePaymentRequestInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removePaymentRequest(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removePaymentRequest",
          );
        }

        return true;
      },

      Workstream_editInitialProposal: async (
        _: unknown,
        args: { docId: string; input: EditInitialProposalInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editInitialProposal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to editInitialProposal",
          );
        }

        return true;
      },

      Workstream_addAlternativeProposal: async (
        _: unknown,
        args: { docId: string; input: AddAlternativeProposalInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addAlternativeProposal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addAlternativeProposal",
          );
        }

        return true;
      },

      Workstream_editAlternativeProposal: async (
        _: unknown,
        args: { docId: string; input: EditAlternativeProposalInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editAlternativeProposal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to editAlternativeProposal",
          );
        }

        return true;
      },

      Workstream_removeAlternativeProposal: async (
        _: unknown,
        args: { docId: string; input: RemoveAlternativeProposalInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<WorkstreamDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeAlternativeProposal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeAlternativeProposal",
          );
        }

        return true;
      },
    },
  };
};
