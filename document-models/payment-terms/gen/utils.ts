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

export const initialGlobalState: PaymentTermsGlobalState = {
  status: "DRAFT",
  proposer: "",
  payer: "",
  currency: "USD",
  paymentModel: "MILESTONE",
  totalAmount: null,
  milestoneSchedule: [],
  costAndMaterials: null,
  retainerDetails: null,
  escrowDetails: null,
  evaluation: null,
  bonusClauses: [],
  penaltyClauses: [],
};
export const initialLocalState: PaymentTermsLocalState = {};

const utils: DocumentModelUtils<PaymentTermsPHState> = {
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

    document.header.documentType = "payment-terms";

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
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;

export default utils;
