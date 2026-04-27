import { baseActions } from "document-model";
import {
  requestForProposalsRfpStateActions,
  requestForProposalsContexDocumentActions,
  requestForProposalsProposalsActions,
} from "./gen/creators.js";

/** Actions for the RequestForProposals document model */

export const actions = {
  ...baseActions,
  ...requestForProposalsRfpStateActions,
  ...requestForProposalsContexDocumentActions,
  ...requestForProposalsProposalsActions,
};
