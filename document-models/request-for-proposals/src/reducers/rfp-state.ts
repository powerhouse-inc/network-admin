/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { RequestForProposalsRfpStateOperations } from "../../gen/rfp-state/operations.js";

export const reducer: RequestForProposalsRfpStateOperations = {
  editRfpOperation(state, action, dispatch) {
    // TODO: Implement "editRfpOperation" reducer
   
    state.title = action.input.title || state.title;
    state.code = action.input.code || state.code;
    state.description = action.input.description || state.description;
    state.eligibilityCriteria = action.input.eligibilityCriteria || state.eligibilityCriteria;	
    state.evaluationCriteria = action.input.evaluationCriteria || state.evaluationCriteria;
    state.status = action.input.status || state.status;
    state.deadline = action.input.deadline || state.deadline;
    state.tags = action.input.tags || state.tags;
    state.budgetRange = action.input.budgetRange ? {
      min: action.input.budgetRange.min ?? null,
      max: action.input.budgetRange.max ?? null,
      currency: action.input.budgetRange.currency ?? null,
    } : state.budgetRange;

  },
};
