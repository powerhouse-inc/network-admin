import { createAction } from "document-model/core";
import {
  z,
  type EditInitialProposalInput,
  type AddAlternativeProposalInput,
  type EditAlternativeProposalInput,
  type RemoveAlternativeProposalInput,
} from "../types.js";
import {
  type EditInitialProposalAction,
  type AddAlternativeProposalAction,
  type EditAlternativeProposalAction,
  type RemoveAlternativeProposalAction,
} from "./actions.js";

export const editInitialProposal = (input: EditInitialProposalInput) =>
  createAction<EditInitialProposalAction>(
    "EDIT_INITIAL_PROPOSAL",
    { ...input },
    undefined,
    z.EditInitialProposalInputSchema,
    "global",
  );

export const addAlternativeProposal = (input: AddAlternativeProposalInput) =>
  createAction<AddAlternativeProposalAction>(
    "ADD_ALTERNATIVE_PROPOSAL",
    { ...input },
    undefined,
    z.AddAlternativeProposalInputSchema,
    "global",
  );

export const editAlternativeProposal = (input: EditAlternativeProposalInput) =>
  createAction<EditAlternativeProposalAction>(
    "EDIT_ALTERNATIVE_PROPOSAL",
    { ...input },
    undefined,
    z.EditAlternativeProposalInputSchema,
    "global",
  );

export const removeAlternativeProposal = (
  input: RemoveAlternativeProposalInput,
) =>
  createAction<RemoveAlternativeProposalAction>(
    "REMOVE_ALTERNATIVE_PROPOSAL",
    { ...input },
    undefined,
    z.RemoveAlternativeProposalInputSchema,
    "global",
  );
