import type { PHDocument, BaseStateFromDocument } from "document-model";
import type { WorkstreamState } from "./schema/types.js";
import type { WorkstreamAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type WorkstreamLocalState = Record<PropertyKey, never>;
export type ExtendedWorkstreamState = BaseStateFromDocument<WorkstreamDocument>;
export type WorkstreamDocument = PHDocument<
  WorkstreamState,
  WorkstreamLocalState
>;
export type { WorkstreamState, WorkstreamLocalState, WorkstreamAction };
