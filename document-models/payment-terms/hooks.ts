import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  PaymentTermsDocument,
  PaymentTermsAction,
} from "@powerhousedao/network-admin/document-models/payment-terms";
import { isPaymentTermsDocument } from "./gen/document-schema.js";

/** Hook to get a PaymentTerms document by its id */
export function usePaymentTermsDocumentById(
  documentId: string | null | undefined,
):
  | [PaymentTermsDocument, DocumentDispatch<PaymentTermsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isPaymentTermsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected PaymentTerms document */
export function useSelectedPaymentTermsDocument():
  | [PaymentTermsDocument, DocumentDispatch<PaymentTermsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isPaymentTermsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all PaymentTerms documents in the selected drive */
export function usePaymentTermsDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isPaymentTermsDocument);
}

/** Hook to get all PaymentTerms documents in the selected folder */
export function usePaymentTermsDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isPaymentTermsDocument);
}
