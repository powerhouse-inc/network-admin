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
  type RequestForProposalsDocument,
  type RequestForProposalsState,
  type RequestForProposalsLocalState,
} from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: RequestForProposalsState = {
  issuer: "placeholder-id",
  title: "",
  description: "",
  rfpCommenter: [],
  eligibilityCriteria: [],
  evaluationCriteria: [],
  budgetRange: {
    min: null,
    max: null,
    currency: null,
  },
  contextDocuments: [],
  status: "DRAFT",
  proposals: [],
  deadline: null,
  tags: null,
};
export const initialLocalState: RequestForProposalsLocalState = {};

const utils: DocumentModelUtils<RequestForProposalsDocument> = {
  fileExtension: "",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = "powerhouse/rfp";

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFile(document, path, name) {
    return baseSaveToFile(document, path, "", name);
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
