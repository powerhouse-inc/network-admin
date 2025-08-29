import { type SignalDispatch } from "document-model";
import {
  type SetBasicTermsAction,
  type UpdateStatusAction,
  type SetCostAndMaterialsAction,
  type SetEscrowDetailsAction,
  type SetEvaluationTermsAction,
  type SetRetainerDetailsAction,
} from "./actions.js";
import { type PaymentTermsState } from "../types.js";

export interface PaymentTermsTermsOperations {
  setBasicTermsOperation: (
    state: PaymentTermsState,
    action: SetBasicTermsAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateStatusOperation: (
    state: PaymentTermsState,
    action: UpdateStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  setCostAndMaterialsOperation: (
    state: PaymentTermsState,
    action: SetCostAndMaterialsAction,
    dispatch?: SignalDispatch,
  ) => void;
  setEscrowDetailsOperation: (
    state: PaymentTermsState,
    action: SetEscrowDetailsAction,
    dispatch?: SignalDispatch,
  ) => void;
  setEvaluationTermsOperation: (
    state: PaymentTermsState,
    action: SetEvaluationTermsAction,
    dispatch?: SignalDispatch,
  ) => void;
  setRetainerDetailsOperation: (
    state: PaymentTermsState,
    action: SetRetainerDetailsAction,
    dispatch?: SignalDispatch,
  ) => void;
}
