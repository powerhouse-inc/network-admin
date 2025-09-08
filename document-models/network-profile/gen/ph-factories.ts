/**
 * Factory methods for creating NetworkProfileDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  NetworkProfileDocument,
  NetworkProfileLocalState,
  NetworkProfileState,
} from "./types.js";
import { createDocument } from "./utils.js";

export type NetworkProfilePHState = PHBaseState & {
  global: NetworkProfileState;
  local: NetworkProfileLocalState;
};

export function defaultGlobalState(): NetworkProfileState {
  return {
    name: "",
    icon: "",
    logo: "",
    logoBig: "",
    website: null,
    description: "",
    category: [],
    x: null,
    github: null,
    discord: null,
    youtube: null,
  };
}

export function defaultLocalState(): NetworkProfileLocalState {
  return {};
}

export function defaultPHState(): NetworkProfilePHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<NetworkProfileState>,
): NetworkProfileState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as NetworkProfileState;
}

export function createLocalState(
  state?: Partial<NetworkProfileLocalState>,
): NetworkProfileLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as NetworkProfileLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<NetworkProfileState>,
  localState?: Partial<NetworkProfileLocalState>,
): NetworkProfilePHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a NetworkProfileDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createNetworkProfileDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<NetworkProfileState>;
    local?: Partial<NetworkProfileLocalState>;
  }>,
): NetworkProfileDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}
