import type { PHDocument, ExtendedState } from "document-model";
import type { RequestForProposalsState } from "./schema/types.js";
import type { RequestForProposalsAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type RequestForProposalsLocalState = Record<PropertyKey, never>;
export type ExtendedRequestForProposalsState = ExtendedState<
  RequestForProposalsState,
  RequestForProposalsLocalState
>;
export type RequestForProposalsDocument = PHDocument<
  RequestForProposalsState,
  RequestForProposalsLocalState,
  RequestForProposalsAction
>;
export type {
  RequestForProposalsState,
  RequestForProposalsLocalState,
  RequestForProposalsAction,
};
