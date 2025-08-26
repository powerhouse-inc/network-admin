import { type BaseAction } from "document-model";
import type {
  AddContextDocumentInput,
  RemoveContextDocumentInput,
} from "../types.js";

export type AddContextDocumentAction = BaseAction<
  "ADD_CONTEXT_DOCUMENT",
  AddContextDocumentInput,
  "global"
>;
export type RemoveContextDocumentAction = BaseAction<
  "REMOVE_CONTEXT_DOCUMENT",
  RemoveContextDocumentInput,
  "global"
>;

export type RequestForProposalsContexDocumentAction =
  | AddContextDocumentAction
  | RemoveContextDocumentAction;
