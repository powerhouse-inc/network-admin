import { type SignalDispatch } from "document-model";
import {
  type AddProposalAction,
  type ChangeProposalStatusAction,
  type RemoveProposalAction,
} from "./actions.js";
import { type RequestForProposalsState } from "../types.js";

export interface RequestForProposalsProposalsOperations {
  addProposalOperation: (
    state: RequestForProposalsState,
    action: AddProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
  changeProposalStatusOperation: (
    state: RequestForProposalsState,
    action: ChangeProposalStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeProposalOperation: (
    state: RequestForProposalsState,
    action: RemoveProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
}
