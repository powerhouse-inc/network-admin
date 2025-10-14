/**
 * Factory methods for creating BuilderProfileDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  BuilderProfileDocument,
  BuilderProfileLocalState,
  BuilderProfileState,
} from "./types.js";
import { createDocument } from "./utils.js";

export type BuilderProfilePHState = PHBaseState & {
  global: BuilderProfileState;
  local: BuilderProfileLocalState;
};

export function defaultGlobalState(): BuilderProfileState {
  return {
    id: null,
    slug: null,
    name: null,
    icon: null,
    description: null,
  };
}

export function defaultLocalState(): BuilderProfileLocalState {
  return {};
}

export function defaultPHState(): BuilderProfilePHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<BuilderProfileState>,
): BuilderProfileState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as BuilderProfileState;
}

export function createLocalState(
  state?: Partial<BuilderProfileLocalState>,
): BuilderProfileLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as BuilderProfileLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<BuilderProfileState>,
  localState?: Partial<BuilderProfileLocalState>,
): BuilderProfilePHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a BuilderProfileDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createBuilderProfileDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<BuilderProfileState>;
    local?: Partial<BuilderProfileLocalState>;
  }>,
): BuilderProfileDocument {
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
