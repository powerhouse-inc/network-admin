import {
  type CreateDocument,
  type CreateState,
  type LoadFromFile,
  type LoadFromInput,
  baseCreateDocument,
  baseSaveToFile,
  baseSaveToFileHandle,
  baseLoadFromFile,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model";
import {
  type PaymentTermsState,
  type PaymentTermsLocalState,
} from "./types.js";
import { PaymentTermsPHState } from "./ph-factories.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: PaymentTermsState = {
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

export const createState: CreateState<PaymentTermsPHState> = (state) => {
  return {
    ...defaultBaseState(),
    global: { ...initialGlobalState, ...(state?.global ?? {}) },
    local: { ...initialLocalState, ...(state?.local ?? {}) },
  };
};

export const createDocument: CreateDocument<PaymentTermsPHState> = (state) => {
  const document = baseCreateDocument(createState, state);
  document.header.documentType = "payment-terms";
  // for backwards compatibility, but this is NOT a valid signed document id
  document.header.id = generateId();
  return document;
};

export const saveToFile = (document: any, path: string, name?: string) => {
  return baseSaveToFile(document, path, "pterms", name);
};

export const saveToFileHandle = (document: any, input: any) => {
  return baseSaveToFileHandle(document, input);
};

export const loadFromFile: LoadFromFile<PaymentTermsPHState> = (path) => {
  return baseLoadFromFile(path, reducer);
};

export const loadFromInput: LoadFromInput<PaymentTermsPHState> = (input) => {
  return baseLoadFromInput(input, reducer);
};

const utils = {
  fileExtension: "pterms",
  createState,
  createDocument,
  saveToFile,
  saveToFileHandle,
  loadFromFile,
  loadFromInput,
};

export default utils;
