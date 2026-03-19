import { createAction } from "document-model/core";
import {
  EditInitialProposalInputSchema,
  AddAlternativeProposalInputSchema,
  EditAlternativeProposalInputSchema,
  RemoveAlternativeProposalInputSchema,
} from "../schema/zod.js";
import type {
  EditInitialProposalInput,
  AddAlternativeProposalInput,
  EditAlternativeProposalInput,
  RemoveAlternativeProposalInput,
} from "../types.js";
import type {
  EditInitialProposalAction,
  AddAlternativeProposalAction,
  EditAlternativeProposalAction,
  RemoveAlternativeProposalAction,
} from "./actions.js";

export const editInitialProposal = (input: EditInitialProposalInput) =>
  createAction<EditInitialProposalAction>(
    "EDIT_INITIAL_PROPOSAL",
    { ...input },
    undefined,
    EditInitialProposalInputSchema,
    "global",
  );

export const addAlternativeProposal = (input: AddAlternativeProposalInput) =>
  createAction<AddAlternativeProposalAction>(
    "ADD_ALTERNATIVE_PROPOSAL",
    { ...input },
    undefined,
    AddAlternativeProposalInputSchema,
    "global",
  );

export const editAlternativeProposal = (input: EditAlternativeProposalInput) =>
  createAction<EditAlternativeProposalAction>(
    "EDIT_ALTERNATIVE_PROPOSAL",
    { ...input },
    undefined,
    EditAlternativeProposalInputSchema,
    "global",
  );

export const removeAlternativeProposal = (
  input: RemoveAlternativeProposalInput,
) =>
  createAction<RemoveAlternativeProposalAction>(
    "REMOVE_ALTERNATIVE_PROPOSAL",
    { ...input },
    undefined,
    RemoveAlternativeProposalInputSchema,
    "global",
  );
