import { type SignalDispatch } from "document-model";
import {
  type AddContextDocumentAction,
  type RemoveContextDocumentAction,
} from "./actions.js";
import { type RequestForProposalsState } from "../types.js";

export interface RequestForProposalsContexDocumentOperations {
  addContextDocumentOperation: (
    state: RequestForProposalsState,
    action: AddContextDocumentAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeContextDocumentOperation: (
    state: RequestForProposalsState,
    action: RemoveContextDocumentAction,
    dispatch?: SignalDispatch,
  ) => void;
}
