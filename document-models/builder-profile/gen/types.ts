import type { PHDocument } from "document-model";
import type { BuilderProfileAction } from "./actions.js";
import type { BuilderProfilePHState } from "./ph-factories.js";
import type { BuilderProfileState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type BuilderProfileLocalState = Record<PropertyKey, never>;
export type BuilderProfileDocument = PHDocument<BuilderProfilePHState>;
export type {
  BuilderProfileState,
  BuilderProfileLocalState,
  BuilderProfileAction,
};
