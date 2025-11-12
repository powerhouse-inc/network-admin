import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { PaymentTermsPHState } from "./gen/types.js";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "./index.js";

/** Document model module for the Todo List document type */
export const PaymentTerms: DocumentModelModule<PaymentTermsPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
