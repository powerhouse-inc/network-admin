import type { PHDocument } from "document-model";
import type { RequestForProposalsAction } from "./actions.js";
import type { RequestForProposalsPHState } from "./ph-factories.js";
import type { RequestForProposalsState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type RequestForProposalsLocalState = Record<PropertyKey, never>;
export type RequestForProposalsDocument =
  PHDocument<RequestForProposalsPHState>;
export type {
  RequestForProposalsState,
  RequestForProposalsLocalState,
  RequestForProposalsAction,
};
