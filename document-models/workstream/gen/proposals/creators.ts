import { createAction } from "document-model/core";
import { EditInitialProposalInputSchema } from "../schema/zod.js";
import type { EditInitialProposalInput } from "../types.js";
import type { EditInitialProposalAction } from "./actions.js";

export const editInitialProposal = (input: EditInitialProposalInput) =>
  createAction<EditInitialProposalAction>(
    "EDIT_INITIAL_PROPOSAL",
    { ...input },
    undefined,
    EditInitialProposalInputSchema,
    "global",
  );
