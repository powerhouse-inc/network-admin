/**
 * Factory methods for creating WorkstreamDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  WorkstreamDocument,
  WorkstreamLocalState,
  WorkstreamGlobalState,
  WorkstreamPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): WorkstreamGlobalState {
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
  state?: Partial<WorkstreamGlobalState>,
): WorkstreamGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as WorkstreamGlobalState;
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
  globalState?: Partial<WorkstreamGlobalState>,
  localState?: Partial<WorkstreamLocalState>,
): WorkstreamPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a WorkstreamDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createWorkstreamDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<WorkstreamGlobalState>;
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
