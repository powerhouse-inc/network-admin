import { baseActions } from "document-model";
import {
  paymentTermsTermsActions,
  paymentTermsMilestonesActions,
  paymentTermsClausesActions,
} from "./gen/creators.js";

/** Actions for the PaymentTerms document model */

export const actions = {
  ...baseActions,
  ...paymentTermsTermsActions,
  ...paymentTermsMilestonesActions,
  ...paymentTermsClausesActions,
};
