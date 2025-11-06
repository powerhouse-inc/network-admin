import type { PHDocument, PHBaseState } from "document-model";
import type { PaymentTermsAction } from "./actions.js";
import type { PaymentTermsState as PaymentTermsGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type PaymentTermsLocalState = Record<PropertyKey, never>;
type PaymentTermsPHState = PHBaseState & {
  global: PaymentTermsGlobalState;
  local: PaymentTermsLocalState;
};
type PaymentTermsDocument = PHDocument<PaymentTermsPHState>;

export type {
  PaymentTermsGlobalState,
  PaymentTermsLocalState,
  PaymentTermsPHState,
  PaymentTermsAction,
  PaymentTermsDocument,
};
