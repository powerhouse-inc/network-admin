import { baseActions } from "document-model";
import {
  termsActions,
  milestonesActions,
  clausesActions,
} from "./gen/creators.js";

/** Actions for the PaymentTerms document model */
export const actions = {
  ...baseActions,
  ...termsActions,
  ...milestonesActions,
  ...clausesActions,
};
