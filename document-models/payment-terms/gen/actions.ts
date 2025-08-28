import type { PaymentTermsTermsAction } from "./terms/actions.js";
import type { PaymentTermsMilestonesAction } from "./milestones/actions.js";
import type { PaymentTermsClausesAction } from "./clauses/actions.js";

export * from "./terms/actions.js";
export * from "./milestones/actions.js";
export * from "./clauses/actions.js";

export type PaymentTermsAction =
  | PaymentTermsTermsAction
  | PaymentTermsMilestonesAction
  | PaymentTermsClausesAction;
