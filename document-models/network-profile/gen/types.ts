import type { PHDocument, PHBaseState } from "document-model";
import type { NetworkProfileAction } from "./actions.js";
import type { NetworkProfileState as NetworkProfileGlobalState } from "./schema/types.js";

type NetworkProfileLocalState = Record<PropertyKey, never>;
type NetworkProfilePHState = PHBaseState & {
  global: NetworkProfileGlobalState;
  local: NetworkProfileLocalState;
};
type NetworkProfileDocument = PHDocument<NetworkProfilePHState>;

export * from "./schema/types.js";

export type {
  NetworkProfileGlobalState,
  NetworkProfileLocalState,
  NetworkProfilePHState,
  NetworkProfileAction,
  NetworkProfileDocument,
};
