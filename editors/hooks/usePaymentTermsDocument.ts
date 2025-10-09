import {
  useDocumentOfType,
  useSelectedDocumentId,
} from "@powerhousedao/reactor-browser";
import type {
  PaymentTermsAction,
  PaymentTermsDocument,
} from "../../document-models/payment-terms/index.js";

export function usePaymentTermsDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<PaymentTermsDocument, PaymentTermsAction>(
    documentId,
    "payment-terms",
  );
}

export function useSelectedPaymentTermsDocument() {
  const selectedDocumentId = useSelectedDocumentId();
  return usePaymentTermsDocument(selectedDocumentId);
}
