import type { PaymentTermsTermsOperations } from "../../gen/terms/operations.js";

export const reducer: PaymentTermsTermsOperations = {
    setBasicTermsOperation(state, action, dispatch) {
        state.proposer = action.input.proposer;
        state.payer = action.input.payer;
        state.currency = action.input.currency;
        state.paymentModel = action.input.paymentModel;
        state.totalAmount = action.input.totalAmount || null;
    },
    updateStatusOperation(state, action, dispatch) {
        state.status = action.input.status;
    },
    setEscrowDetailsOperation(state, action, dispatch) {
        state.escrowDetails = {
          amountHeld: action.input.amountHeld,
          proofOfFundsDocumentId: action.input.proofOfFundsDocumentId || null,
          releaseConditions: action.input.releaseConditions,
          escrowProvider: action.input.escrowProvider || null
        };
    },
    setEvaluationTermsOperation(state, action, dispatch) {
        state.evaluation = {
          evaluationFrequency: action.input.evaluationFrequency,
          evaluatorTeam: action.input.evaluatorTeam,
          criteria: action.input.criteria,
          impactsPayout: action.input.impactsPayout,
          impactsReputation: action.input.impactsReputation,
          commentsVisibleToClient: action.input.commentsVisibleToClient
        };
    },
    setCostAndMaterialsOperation(state, action, dispatch) {
        state.costAndMaterials = {
          hourlyRate: action.input.hourlyRate || null,
          variableCap: action.input.variableCap || null,
          billingFrequency: action.input.billingFrequency,
          timesheetRequired: action.input.timesheetRequired
        };
    },
    setRetainerDetailsOperation(state, action, dispatch) {
        state.retainerDetails = {
          retainerAmount: action.input.retainerAmount,
          billingFrequency: action.input.billingFrequency,
          startDate: action.input.startDate,
          endDate: action.input.endDate || null,
          autoRenew: action.input.autoRenew,
          servicesIncluded: action.input.servicesIncluded
        };
    }
};
