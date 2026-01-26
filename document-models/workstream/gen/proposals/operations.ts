import { type SignalDispatch } from "document-model";
import type { EditInitialProposalAction } from "./actions.js";
import type { WorkstreamState } from "../types.js";

export interface WorkstreamProposalsOperations {
  editInitialProposalOperation: (
    state: WorkstreamState,
    action: EditInitialProposalAction,
    dispatch?: SignalDispatch,
  ) => void;
}
