import type { PaymentTermsTermsOperations } from "@powerhousedao/network-admin/document-models/payment-terms";

export const paymentTermsTermsOperations: PaymentTermsTermsOperations = {
    setBasicTermsOperation(state, action) {
        state.proposer = action.input.proposer;
        state.payer = action.input.payer;
        state.currency = action.input.currency;
        state.paymentModel = action.input.paymentModel;
        state.totalAmount = action.input.totalAmount || null;
    },
    updateStatusOperation(state, action) {
        state.status = action.input.status;
    },
    setTimeAndMaterialsOperation(state, action) {
        state.timeAndMaterials = {
          retainerAmount: action.input.retainerAmount || null,
          hourlyRate: action.input.hourlyRate || null,
          variableCap: action.input.variableCap || null,
          billingFrequency: action.input.billingFrequency,
          timesheetRequired: action.input.timesheetRequired
        };
    },
    setEscrowDetailsOperation(state, action) {
        state.escrowDetails = {
          amountHeld: action.input.amountHeld,
          proofOfFundsDocumentId: action.input.proofOfFundsDocumentId || null,
          releaseConditions: action.input.releaseConditions,
          escrowProvider: action.input.escrowProvider || null
        };
    },
    setEvaluationTermsOperation(state, action) {
        state.evaluation = {
          evaluationFrequency: action.input.evaluationFrequency,
          evaluatorTeam: action.input.evaluatorTeam,
          criteria: action.input.criteria,
          impactsPayout: action.input.impactsPayout,
          impactsReputation: action.input.impactsReputation,
          commentsVisibleToClient: action.input.commentsVisibleToClient
        };
    }
};
