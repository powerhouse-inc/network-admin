import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { PaymentTermsPHState } from "@powerhousedao/network-admin/document-models/payment-terms";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/network-admin/document-models/payment-terms";

/** Document model module for the Todo List document type */
export const PaymentTerms: DocumentModelModule<PaymentTermsPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
