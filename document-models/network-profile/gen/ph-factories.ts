/**
 * Factory methods for creating NetworkProfileDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  NetworkProfileDocument,
  NetworkProfileLocalState,
  NetworkProfileGlobalState,
  NetworkProfilePHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): NetworkProfileGlobalState {
  return {
    name: "",
    icon: "",
    darkThemeIcon: "",
    logo: "",
    darkThemeLogo: "",
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
  state?: Partial<NetworkProfileGlobalState>,
): NetworkProfileGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as NetworkProfileGlobalState;
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
  globalState?: Partial<NetworkProfileGlobalState>,
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
    global?: Partial<NetworkProfileGlobalState>;
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
