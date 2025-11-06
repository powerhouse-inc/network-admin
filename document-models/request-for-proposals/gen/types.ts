import type { PHDocument, PHBaseState } from "document-model";
import type { RequestForProposalsAction } from "./actions.js";
import type { RequestForProposalsState as RequestForProposalsGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type RequestForProposalsLocalState = Record<PropertyKey, never>;
type RequestForProposalsPHState = PHBaseState & {
  global: RequestForProposalsGlobalState;
  local: RequestForProposalsLocalState;
};
type RequestForProposalsDocument = PHDocument<RequestForProposalsPHState>;

export type {
  RequestForProposalsGlobalState,
  RequestForProposalsLocalState,
  RequestForProposalsPHState,
  RequestForProposalsAction,
  RequestForProposalsDocument,
};
