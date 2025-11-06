import { createAction } from "document-model/core";
import {
  z,
  type AddProposalInput,
  type ChangeProposalStatusInput,
  type RemoveProposalInput,
} from "../types.js";
import {
  type AddProposalAction,
  type ChangeProposalStatusAction,
  type RemoveProposalAction,
} from "./actions.js";

export const addProposal = (input: AddProposalInput) =>
  createAction<AddProposalAction>(
    "ADD_PROPOSAL",
    { ...input },
    undefined,
    z.AddProposalInputSchema,
    "global",
  );

export const changeProposalStatus = (input: ChangeProposalStatusInput) =>
  createAction<ChangeProposalStatusAction>(
    "CHANGE_PROPOSAL_STATUS",
    { ...input },
    undefined,
    z.ChangeProposalStatusInputSchema,
    "global",
  );

export const removeProposal = (input: RemoveProposalInput) =>
  createAction<RemoveProposalAction>(
    "REMOVE_PROPOSAL",
    { ...input },
    undefined,
    z.RemoveProposalInputSchema,
    "global",
  );
