import { type SignalDispatch } from "document-model";
import {
  type EditWorkstreamAction,
  type EditClientInfoAction,
  type SetRequestForProposalAction,
  type AddPaymentRequestAction,
  type RemovePaymentRequestAction,
} from "./actions.js";
import { type WorkstreamState } from "../types.js";

export interface WorkstreamWorkstreamOperations {
  editWorkstreamOperation: (
    state: WorkstreamState,
    action: EditWorkstreamAction,
    dispatch?: SignalDispatch,
  ) => void;
  editClientInfoOperation: (
    state: WorkstreamState,
    action: EditClientInfoAction,
    dispatch?: SignalDispatch,
  ) => void;
  setRequestForProposalOperation: (
    state: WorkstreamState,
    action: SetRequestForProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
  addPaymentRequestOperation: (
    state: WorkstreamState,
    action: AddPaymentRequestAction,
    dispatch?: SignalDispatch,
  ) => void;
  removePaymentRequestOperation: (
    state: WorkstreamState,
    action: RemovePaymentRequestAction,
    dispatch?: SignalDispatch,
  ) => void;
}
