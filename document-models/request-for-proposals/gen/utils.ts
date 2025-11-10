import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  RequestForProposalsGlobalState,
  RequestForProposalsLocalState,
} from "./types.js";
import type { RequestForProposalsPHState } from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: RequestForProposalsGlobalState = {
  issuer: "placeholder-id",
  code: "",
  title: "",
  summary: "",
  briefing: "",
  rfpCommenter: [],
  eligibilityCriteria: '',
  evaluationCriteria: '',
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

const utils: DocumentModelUtils<RequestForProposalsPHState> = {
  fileExtension: ".phdm",
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
