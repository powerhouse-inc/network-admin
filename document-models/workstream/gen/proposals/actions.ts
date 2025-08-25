import { type BaseAction } from "document-model";
import type {
  EditInitialProposalInput,
  AddAlternativeProposalInput,
  EditAlternativeProposalInput,
  RemoveAlternativeProposalInput,
} from "../types.js";

export type EditInitialProposalAction = BaseAction<
  "EDIT_INITIAL_PROPOSAL",
  EditInitialProposalInput,
  "global"
>;
export type AddAlternativeProposalAction = BaseAction<
  "ADD_ALTERNATIVE_PROPOSAL",
  AddAlternativeProposalInput,
  "global"
>;
export type EditAlternativeProposalAction = BaseAction<
  "EDIT_ALTERNATIVE_PROPOSAL",
  EditAlternativeProposalInput,
  "global"
>;
export type RemoveAlternativeProposalAction = BaseAction<
  "REMOVE_ALTERNATIVE_PROPOSAL",
  RemoveAlternativeProposalInput,
  "global"
>;

export type WorkstreamProposalsAction =
  | EditInitialProposalAction
  | AddAlternativeProposalAction
  | EditAlternativeProposalAction
  | RemoveAlternativeProposalAction;
