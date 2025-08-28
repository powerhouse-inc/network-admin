import type { PHDocument, BaseStateFromDocument } from "document-model";
import type { PaymentTermsState } from "./schema/types.js";
import type { PaymentTermsAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type PaymentTermsLocalState = Record<PropertyKey, never>;
export type ExtendedPaymentTermsState =
  BaseStateFromDocument<PaymentTermsDocument>;
export type PaymentTermsDocument = PHDocument<
  PaymentTermsState,
  PaymentTermsLocalState
>;
export type { PaymentTermsState, PaymentTermsLocalState, PaymentTermsAction };
