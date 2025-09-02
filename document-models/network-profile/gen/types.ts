import type { PHDocument, BaseStateFromDocument } from "document-model";
import type { NetworkProfileState } from "./schema/types.js";
import type { NetworkProfileAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type NetworkProfileLocalState = Record<PropertyKey, never>;
export type ExtendedNetworkProfileState =
  BaseStateFromDocument<NetworkProfileDocument>;
export type NetworkProfileDocument = PHDocument<
  NetworkProfileState,
  NetworkProfileLocalState
>;
export type {
  NetworkProfileState,
  NetworkProfileLocalState,
  NetworkProfileAction,
};
