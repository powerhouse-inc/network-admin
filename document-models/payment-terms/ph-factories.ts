/**
 * Factory methods for creating PaymentTermsDocument instances
 */

import {
  createBaseState,
  defaultBaseState,
  type PHAuthState,
  type PHDocumentState,
  type PHBaseState,
} from "document-model";
import type {
  PaymentTermsDocument,
  PaymentTermsLocalState,
  PaymentTermsState,
} from "./gen/types.js";
import { createDocument } from "./gen/utils.js";

export function defaultGlobalState(): PaymentTermsState {
  return {
    status: "DRAFT",
    proposer: "",
    payer: "",
    currency: "USD",
    paymentModel: "MILESTONE",
    totalAmount: null,
    milestoneSchedule: [],
    timeAndMaterials: null,
    escrowDetails: null,
    evaluation: null,
    bonusClauses: [],
    penaltyClauses: [],
  };
}

export function defaultLocalState(): PaymentTermsLocalState {
  return {};
}

export function defaultPHState(): PaymentTermsPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<PaymentTermsState>,
): PaymentTermsState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as PaymentTermsState;
}

export function createLocalState(
  state?: Partial<PaymentTermsLocalState>,
): PaymentTermsLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as PaymentTermsLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<PaymentTermsState>,
  localState?: Partial<PaymentTermsLocalState>,
): PaymentTermsPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

export type PaymentTermsPHState = PHBaseState & {
  global: PaymentTermsState;
  local: PaymentTermsLocalState;
};

/**
 * Creates a PaymentTermsDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createPaymentTermsDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<PaymentTermsState>;
    local?: Partial<PaymentTermsLocalState>;
  }>,
): PaymentTermsDocument {
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
