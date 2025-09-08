import type { PHDocument } from "document-model";
import type { WorkstreamAction } from "./actions.js";
import type { WorkstreamPHState } from "./ph-factories.js";
import type { WorkstreamState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type WorkstreamLocalState = Record<PropertyKey, never>;
export type WorkstreamDocument = PHDocument<WorkstreamPHState>;
export type { WorkstreamState, WorkstreamLocalState, WorkstreamAction };
