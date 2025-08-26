import { type BaseAction } from "document-model";
import type {
  AddProposalInput,
  ChangeProposalStatusInput,
  RemoveProposalInput,
} from "../types.js";

export type AddProposalAction = BaseAction<
  "ADD_PROPOSAL",
  AddProposalInput,
  "global"
>;
export type ChangeProposalStatusAction = BaseAction<
  "CHANGE_PROPOSAL_STATUS",
  ChangeProposalStatusInput,
  "global"
>;
export type RemoveProposalAction = BaseAction<
  "REMOVE_PROPOSAL",
  RemoveProposalInput,
  "global"
>;

export type RequestForProposalsProposalsAction =
  | AddProposalAction
  | ChangeProposalStatusAction
  | RemoveProposalAction;
