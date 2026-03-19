import { PHDocumentController } from "document-model/core";
import { PaymentTerms } from "../module.js";
import type { PaymentTermsAction, PaymentTermsPHState } from "./types.js";

export const PaymentTermsController = PHDocumentController.forDocumentModel<
  PaymentTermsPHState,
  PaymentTermsAction
>(PaymentTerms);
