import type { PHDocument, BaseStateFromDocument } from "document-model";
import type { RequestForProposalsState } from "./schema/types.js";
import type { RequestForProposalsAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type RequestForProposalsLocalState = Record<PropertyKey, never>;
export type ExtendedRequestForProposalsState =
  BaseStateFromDocument<RequestForProposalsDocument>;
export type RequestForProposalsDocument = PHDocument<
  RequestForProposalsState,
  RequestForProposalsLocalState
>;
export type {
  RequestForProposalsState,
  RequestForProposalsLocalState,
  RequestForProposalsAction,
};
