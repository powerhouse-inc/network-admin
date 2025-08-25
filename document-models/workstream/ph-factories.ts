/**
 * Factory methods for creating WorkstreamDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  WorkstreamDocument,
  WorkstreamLocalState,
  WorkstreamState,
} from "./gen/types.js";
import { createDocument } from "./gen/utils.js";

export function defaultGlobalState(): WorkstreamState {
  return {
    code: null,
    title: null,
    status: "RFP_DRAFT",
    client: null,
    rfp: null,
    initialProposal: null,
    alternativeProposals: [],
    sow: null,
    paymentTerms: null,
    paymentRequests: [],
  };
}

export function defaultLocalState(): WorkstreamLocalState {
  return {};
}

export function defaultPHState(): WorkstreamPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<WorkstreamState>,
): WorkstreamState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as WorkstreamState;
}

export function createLocalState(
  state?: Partial<WorkstreamLocalState>,
): WorkstreamLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as WorkstreamLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<WorkstreamState>,
  localState?: Partial<WorkstreamLocalState>,
): WorkstreamPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

export type WorkstreamPHState = PHBaseState & {
  global: WorkstreamState;
  local: WorkstreamLocalState;
};

/**
 * Creates a WorkstreamDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createWorkstreamDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<WorkstreamState>;
    local?: Partial<WorkstreamLocalState>;
  }>,
): WorkstreamDocument {
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
