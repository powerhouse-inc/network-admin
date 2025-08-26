import { type SignalDispatch } from "document-model";
import { type EditRfpAction } from "./actions.js";
import { type RequestForProposalsState } from "../types.js";

export interface RequestForProposalsRfpStateOperations {
  editRfpOperation: (
    state: RequestForProposalsState,
    action: EditRfpAction,
    dispatch?: SignalDispatch,
  ) => void;
}
