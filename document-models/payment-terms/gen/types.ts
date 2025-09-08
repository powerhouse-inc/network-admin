import type { PHDocument } from "document-model";
import type { PaymentTermsAction } from "./actions.js";
import type { PaymentTermsPHState } from "./ph-factories.js";
import type { PaymentTermsState } from "./schema/types.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type PaymentTermsLocalState = Record<PropertyKey, never>;
export type PaymentTermsDocument = PHDocument<PaymentTermsPHState>;
export type { PaymentTermsState, PaymentTermsLocalState, PaymentTermsAction };
