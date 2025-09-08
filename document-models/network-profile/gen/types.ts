import type { PHDocument } from "document-model";
import type { NetworkProfileAction } from "./actions.js";
import type { NetworkProfilePHState } from "./ph-factories.js";
import type { NetworkProfileState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type NetworkProfileLocalState = Record<PropertyKey, never>;
export type NetworkProfileDocument = PHDocument<NetworkProfilePHState>;
export type {
  NetworkProfileState,
  NetworkProfileLocalState,
  NetworkProfileAction,
};
