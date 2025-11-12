import { baseActions } from "document-model";
import {
  rfpStateActions,
  contexDocumentActions,
  proposalsActions,
} from "./gen/creators.js";

/** Actions for the RequestForProposals document model */
export const actions = {
  ...baseActions,
  ...rfpStateActions,
  ...contexDocumentActions,
  ...proposalsActions,
};
