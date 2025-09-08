// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { PaymentTermsPHState } from "./ph-factories.js";
import { z } from "./types.js";

import { reducer as TermsReducer } from "../src/reducers/terms.js";
import { reducer as MilestonesReducer } from "../src/reducers/milestones.js";
import { reducer as ClausesReducer } from "../src/reducers/clauses.js";

export const stateReducer: StateReducer<PaymentTermsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "SET_BASIC_TERMS":
      z.SetBasicTermsInputSchema().parse(action.input);
      TermsReducer.setBasicTermsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_STATUS":
      z.UpdateStatusInputSchema().parse(action.input);
      TermsReducer.updateStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_COST_AND_MATERIALS":
      z.SetCostAndMaterialsInputSchema().parse(action.input);
      TermsReducer.setCostAndMaterialsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_ESCROW_DETAILS":
      z.SetEscrowDetailsInputSchema().parse(action.input);
      TermsReducer.setEscrowDetailsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_EVALUATION_TERMS":
      z.SetEvaluationTermsInputSchema().parse(action.input);
      TermsReducer.setEvaluationTermsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_RETAINER_DETAILS":
      z.SetRetainerDetailsInputSchema().parse(action.input);
      TermsReducer.setRetainerDetailsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_MILESTONE":
      z.AddMilestoneInputSchema().parse(action.input);
      MilestonesReducer.addMilestoneOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_MILESTONE":
      z.UpdateMilestoneInputSchema().parse(action.input);
      MilestonesReducer.updateMilestoneOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_MILESTONE_STATUS":
      z.UpdateMilestoneStatusInputSchema().parse(action.input);
      MilestonesReducer.updateMilestoneStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_MILESTONE":
      z.DeleteMilestoneInputSchema().parse(action.input);
      MilestonesReducer.deleteMilestoneOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REORDER_MILESTONES":
      z.ReorderMilestonesInputSchema().parse(action.input);
      MilestonesReducer.reorderMilestonesOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_BONUS_CLAUSE":
      z.AddBonusClauseInputSchema().parse(action.input);
      ClausesReducer.addBonusClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_BONUS_CLAUSE":
      z.UpdateBonusClauseInputSchema().parse(action.input);
      ClausesReducer.updateBonusClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_BONUS_CLAUSE":
      z.DeleteBonusClauseInputSchema().parse(action.input);
      ClausesReducer.deleteBonusClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_PENALTY_CLAUSE":
      z.AddPenaltyClauseInputSchema().parse(action.input);
      ClausesReducer.addPenaltyClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_PENALTY_CLAUSE":
      z.UpdatePenaltyClauseInputSchema().parse(action.input);
      ClausesReducer.updatePenaltyClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_PENALTY_CLAUSE":
      z.DeletePenaltyClauseInputSchema().parse(action.input);
      ClausesReducer.deletePenaltyClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<PaymentTermsPHState>(stateReducer);
