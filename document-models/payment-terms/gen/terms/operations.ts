import { type SignalDispatch } from "document-model";
import {
  type SetBasicTermsAction,
  type UpdateStatusAction,
  type SetTimeAndMaterialsAction,
  type SetEscrowDetailsAction,
  type SetEvaluationTermsAction,
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
  setTimeAndMaterialsOperation: (
    state: PaymentTermsState,
    action: SetTimeAndMaterialsAction,
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
}
