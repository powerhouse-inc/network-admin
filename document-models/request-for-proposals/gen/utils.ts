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
import { requestForProposalsDocumentType } from "./document-type.js";
import {
  isRequestForProposalsDocument,
  assertIsRequestForProposalsDocument,
  isRequestForProposalsState,
  assertIsRequestForProposalsState,
} from "./document-schema.js";

export const initialGlobalState: RequestForProposalsGlobalState = {
  issuer: "placeholder-id",
  code: "",
  title: "",
  summary: "",
  briefing: "",
  rfpCommenter: [],
  eligibilityCriteria: "",
  evaluationCriteria: "",
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

export const utils: DocumentModelUtils<RequestForProposalsPHState> = {
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

    document.header.documentType = requestForProposalsDocumentType;

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
    return isRequestForProposalsState(state);
  },
  assertIsStateOfType(state) {
    return assertIsRequestForProposalsState(state);
  },
  isDocumentOfType(document) {
    return isRequestForProposalsDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsRequestForProposalsDocument(document);
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
