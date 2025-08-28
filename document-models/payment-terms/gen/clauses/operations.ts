import { type SignalDispatch } from "document-model";
import {
  type AddBonusClauseAction,
  type UpdateBonusClauseAction,
  type DeleteBonusClauseAction,
  type AddPenaltyClauseAction,
  type UpdatePenaltyClauseAction,
  type DeletePenaltyClauseAction,
} from "./actions.js";
import { type PaymentTermsState } from "../types.js";

export interface PaymentTermsClausesOperations {
  addBonusClauseOperation: (
    state: PaymentTermsState,
    action: AddBonusClauseAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateBonusClauseOperation: (
    state: PaymentTermsState,
    action: UpdateBonusClauseAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteBonusClauseOperation: (
    state: PaymentTermsState,
    action: DeleteBonusClauseAction,
    dispatch?: SignalDispatch,
  ) => void;
  addPenaltyClauseOperation: (
    state: PaymentTermsState,
    action: AddPenaltyClauseAction,
    dispatch?: SignalDispatch,
  ) => void;
  updatePenaltyClauseOperation: (
    state: PaymentTermsState,
    action: UpdatePenaltyClauseAction,
    dispatch?: SignalDispatch,
  ) => void;
  deletePenaltyClauseOperation: (
    state: PaymentTermsState,
    action: DeletePenaltyClauseAction,
    dispatch?: SignalDispatch,
  ) => void;
}
