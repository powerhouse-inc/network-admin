import { type SignalDispatch } from "document-model";
import {
  type EditInitialProposalAction,
  type AddAlternativeProposalAction,
  type EditAlternativeProposalAction,
  type RemoveAlternativeProposalAction,
} from "./actions.js";
import { type WorkstreamState } from "../types.js";

export interface WorkstreamProposalsOperations {
  editInitialProposalOperation: (
    state: WorkstreamState,
    action: EditInitialProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
  addAlternativeProposalOperation: (
    state: WorkstreamState,
    action: AddAlternativeProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
  editAlternativeProposalOperation: (
    state: WorkstreamState,
    action: EditAlternativeProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeAlternativeProposalOperation: (
    state: WorkstreamState,
    action: RemoveAlternativeProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
}
