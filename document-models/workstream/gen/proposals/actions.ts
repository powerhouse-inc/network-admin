import type { Action } from "document-model";
import type { EditInitialProposalInput } from "../types.js";

export type EditInitialProposalAction = Action & {
  type: "EDIT_INITIAL_PROPOSAL";
  input: EditInitialProposalInput;
};

export type WorkstreamProposalsAction = EditInitialProposalAction;
