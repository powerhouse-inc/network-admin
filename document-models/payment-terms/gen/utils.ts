import {
  type DocumentModelUtils,
  baseCreateDocument,
  baseSaveToFile,
  baseSaveToFileHandle,
  baseLoadFromFile,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model";
import {
  type PaymentTermsDocument,
  type PaymentTermsState,
  type PaymentTermsLocalState,
} from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: PaymentTermsState = {
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

const utils: DocumentModelUtils<PaymentTermsDocument> = {
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
  saveToFile(document, path, name) {
    return baseSaveToFile(document, path, "pterms", name);
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromFile(path) {
    return baseLoadFromFile(path, reducer);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFile = utils.saveToFile;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromFile = utils.loadFromFile;
export const loadFromInput = utils.loadFromInput;

export default utils;
