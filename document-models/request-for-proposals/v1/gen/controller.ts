import { PHDocumentController } from "document-model/core";
import { RequestForProposals } from "../module.js";
import type {
  RequestForProposalsAction,
  RequestForProposalsPHState,
} from "./types.js";

export const RequestForProposalsController =
  PHDocumentController.forDocumentModel<
    RequestForProposalsPHState,
    RequestForProposalsAction
  >(RequestForProposals);
