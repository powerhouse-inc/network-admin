/**
 * Factory methods for creating RequestForProposalsDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  RequestForProposalsDocument,
  RequestForProposalsLocalState,
  RequestForProposalsState,
} from "./types.js";
import { createDocument } from "./utils.js";

export type RequestForProposalsPHState = PHBaseState & {
  global: RequestForProposalsState;
  local: RequestForProposalsLocalState;
};

export function defaultGlobalState(): RequestForProposalsState {
  return {
    issuer: "placeholder-id",
    title: "",
    description: "",
    rfpCommenter: [],
    eligibilityCriteria: [],
    evaluationCriteria: [],
    budgetRange: {
      min: null,
      max: null,
      currency: null,
    },
    contextDocuments: [],
    status: "DRAFT",
    proposals: [],
    deadline: null,
    tags: null,
  };
}

export function defaultLocalState(): RequestForProposalsLocalState {
  return {};
}

export function defaultPHState(): RequestForProposalsPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<RequestForProposalsState>,
): RequestForProposalsState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as RequestForProposalsState;
}

export function createLocalState(
  state?: Partial<RequestForProposalsLocalState>,
): RequestForProposalsLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as RequestForProposalsLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<RequestForProposalsState>,
  localState?: Partial<RequestForProposalsLocalState>,
): RequestForProposalsPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a RequestForProposalsDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createRequestForProposalsDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<RequestForProposalsState>;
    local?: Partial<RequestForProposalsLocalState>;
  }>,
): RequestForProposalsDocument {
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
