import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  PaymentTermsGlobalState,
  PaymentTermsLocalState,
} from "./types.js";
import type { PaymentTermsPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { paymentTermsDocumentType } from "./document-type.js";
import {
  isPaymentTermsDocument,
  assertIsPaymentTermsDocument,
  isPaymentTermsState,
  assertIsPaymentTermsState,
} from "./document-schema.js";

export const initialGlobalState: PaymentTermsGlobalState = {
  status: "DRAFT",
  proposer: "",
  payer: "",
  currency: "USD",
  paymentModel: "MILESTONE",
  totalAmount: null,
  milestoneSchedule: [],
  timeAndMaterials: null,
  escrowDetails: null,
  evaluation: null,
  bonusClauses: [],
  penaltyClauses: [],
};
export const initialLocalState: PaymentTermsLocalState = {};

export const utils: DocumentModelUtils<PaymentTermsPHState> = {
  fileExtension: "pterms",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = paymentTermsDocumentType;

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
  isStateOfType(state) {
    return isPaymentTermsState(state);
  },
  assertIsStateOfType(state) {
    return assertIsPaymentTermsState(state);
  },
  isDocumentOfType(document) {
    return isPaymentTermsDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsPaymentTermsDocument(document);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;
export const isStateOfType = utils.isStateOfType;
export const assertIsStateOfType = utils.assertIsStateOfType;
export const isDocumentOfType = utils.isDocumentOfType;
export const assertIsDocumentOfType = utils.assertIsDocumentOfType;
