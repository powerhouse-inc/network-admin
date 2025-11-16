import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  paymentTermsDocumentType,
} from "@powerhousedao/network-admin/document-models/payment-terms";

import type {
  PaymentTermsDocument,
  SetBasicTermsInput,
  UpdateStatusInput,
  SetTimeAndMaterialsInput,
  SetEscrowDetailsInput,
  SetEvaluationTermsInput,
  AddMilestoneInput,
  UpdateMilestoneInput,
  UpdateMilestoneStatusInput,
  DeleteMilestoneInput,
  ReorderMilestonesInput,
  AddBonusClauseInput,
  UpdateBonusClauseInput,
  DeleteBonusClauseInput,
  AddPenaltyClauseInput,
  UpdatePenaltyClauseInput,
  DeletePenaltyClauseInput,
} from "@powerhousedao/network-admin/document-models/payment-terms";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      PaymentTerms: async () => {
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

            const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
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
                  await reactor.getDocument<PaymentTermsDocument>(docId);
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
              (doc) => doc.header.documentType === paymentTermsDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      PaymentTerms_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(paymentTermsDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: paymentTermsDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      PaymentTerms_setBasicTerms: async (
        _: unknown,
        args: { docId: string; input: SetBasicTermsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setBasicTerms(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setBasicTerms");
        }

        return true;
      },

      PaymentTerms_updateStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateStatus");
        }

        return true;
      },

      PaymentTerms_setTimeAndMaterials: async (
        _: unknown,
        args: { docId: string; input: SetTimeAndMaterialsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setTimeAndMaterials(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setTimeAndMaterials",
          );
        }

        return true;
      },

      PaymentTerms_setEscrowDetails: async (
        _: unknown,
        args: { docId: string; input: SetEscrowDetailsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setEscrowDetails(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setEscrowDetails",
          );
        }

        return true;
      },

      PaymentTerms_setEvaluationTerms: async (
        _: unknown,
        args: { docId: string; input: SetEvaluationTermsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setEvaluationTerms(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setEvaluationTerms",
          );
        }

        return true;
      },

      PaymentTerms_addMilestone: async (
        _: unknown,
        args: { docId: string; input: AddMilestoneInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addMilestone(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addMilestone");
        }

        return true;
      },

      PaymentTerms_updateMilestone: async (
        _: unknown,
        args: { docId: string; input: UpdateMilestoneInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateMilestone(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateMilestone");
        }

        return true;
      },

      PaymentTerms_updateMilestoneStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateMilestoneStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateMilestoneStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateMilestoneStatus",
          );
        }

        return true;
      },

      PaymentTerms_deleteMilestone: async (
        _: unknown,
        args: { docId: string; input: DeleteMilestoneInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteMilestone(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteMilestone");
        }

        return true;
      },

      PaymentTerms_reorderMilestones: async (
        _: unknown,
        args: { docId: string; input: ReorderMilestonesInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.reorderMilestones(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to reorderMilestones",
          );
        }

        return true;
      },

      PaymentTerms_addBonusClause: async (
        _: unknown,
        args: { docId: string; input: AddBonusClauseInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addBonusClause(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addBonusClause");
        }

        return true;
      },

      PaymentTerms_updateBonusClause: async (
        _: unknown,
        args: { docId: string; input: UpdateBonusClauseInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateBonusClause(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateBonusClause",
          );
        }

        return true;
      },

      PaymentTerms_deleteBonusClause: async (
        _: unknown,
        args: { docId: string; input: DeleteBonusClauseInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteBonusClause(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to deleteBonusClause",
          );
        }

        return true;
      },

      PaymentTerms_addPenaltyClause: async (
        _: unknown,
        args: { docId: string; input: AddPenaltyClauseInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addPenaltyClause(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to addPenaltyClause",
          );
        }

        return true;
      },

      PaymentTerms_updatePenaltyClause: async (
        _: unknown,
        args: { docId: string; input: UpdatePenaltyClauseInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updatePenaltyClause(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updatePenaltyClause",
          );
        }

        return true;
      },

      PaymentTerms_deletePenaltyClause: async (
        _: unknown,
        args: { docId: string; input: DeletePenaltyClauseInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<PaymentTermsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deletePenaltyClause(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to deletePenaltyClause",
          );
        }

        return true;
      },
    },
  };
};
