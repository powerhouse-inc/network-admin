// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { PaymentTermsPHState } from "@powerhousedao/network-admin/document-models/payment-terms";

import { paymentTermsTermsOperations } from "../src/reducers/terms.js";
import { paymentTermsMilestonesOperations } from "../src/reducers/milestones.js";
import { paymentTermsClausesOperations } from "../src/reducers/clauses.js";

import {
  SetBasicTermsInputSchema,
  UpdateStatusInputSchema,
  SetTimeAndMaterialsInputSchema,
  SetEscrowDetailsInputSchema,
  SetEvaluationTermsInputSchema,
  AddMilestoneInputSchema,
  UpdateMilestoneInputSchema,
  UpdateMilestoneStatusInputSchema,
  DeleteMilestoneInputSchema,
  ReorderMilestonesInputSchema,
  AddBonusClauseInputSchema,
  UpdateBonusClauseInputSchema,
  DeleteBonusClauseInputSchema,
  AddPenaltyClauseInputSchema,
  UpdatePenaltyClauseInputSchema,
  DeletePenaltyClauseInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<PaymentTermsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "SET_BASIC_TERMS":
      SetBasicTermsInputSchema().parse(action.input);
      paymentTermsTermsOperations.setBasicTermsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_STATUS":
      UpdateStatusInputSchema().parse(action.input);
      paymentTermsTermsOperations.updateStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_TIME_AND_MATERIALS":
      SetTimeAndMaterialsInputSchema().parse(action.input);
      paymentTermsTermsOperations.setTimeAndMaterialsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_ESCROW_DETAILS":
      SetEscrowDetailsInputSchema().parse(action.input);
      paymentTermsTermsOperations.setEscrowDetailsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_EVALUATION_TERMS":
      SetEvaluationTermsInputSchema().parse(action.input);
      paymentTermsTermsOperations.setEvaluationTermsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_MILESTONE":
      AddMilestoneInputSchema().parse(action.input);
      paymentTermsMilestonesOperations.addMilestoneOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_MILESTONE":
      UpdateMilestoneInputSchema().parse(action.input);
      paymentTermsMilestonesOperations.updateMilestoneOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_MILESTONE_STATUS":
      UpdateMilestoneStatusInputSchema().parse(action.input);
      paymentTermsMilestonesOperations.updateMilestoneStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_MILESTONE":
      DeleteMilestoneInputSchema().parse(action.input);
      paymentTermsMilestonesOperations.deleteMilestoneOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REORDER_MILESTONES":
      ReorderMilestonesInputSchema().parse(action.input);
      paymentTermsMilestonesOperations.reorderMilestonesOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_BONUS_CLAUSE":
      AddBonusClauseInputSchema().parse(action.input);
      paymentTermsClausesOperations.addBonusClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_BONUS_CLAUSE":
      UpdateBonusClauseInputSchema().parse(action.input);
      paymentTermsClausesOperations.updateBonusClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_BONUS_CLAUSE":
      DeleteBonusClauseInputSchema().parse(action.input);
      paymentTermsClausesOperations.deleteBonusClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_PENALTY_CLAUSE":
      AddPenaltyClauseInputSchema().parse(action.input);
      paymentTermsClausesOperations.addPenaltyClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_PENALTY_CLAUSE":
      UpdatePenaltyClauseInputSchema().parse(action.input);
      paymentTermsClausesOperations.updatePenaltyClauseOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "DELETE_PENALTY_CLAUSE":
      DeletePenaltyClauseInputSchema().parse(action.input);
      paymentTermsClausesOperations.deletePenaltyClauseOperation(
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
