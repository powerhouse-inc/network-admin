import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type { WorkstreamGlobalState, WorkstreamLocalState } from "./types.js";
import type { WorkstreamPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { workstreamDocumentType } from "./document-type.js";
import {
  isWorkstreamDocument,
  assertIsWorkstreamDocument,
  isWorkstreamState,
  assertIsWorkstreamState,
} from "./document-schema.js";

export const initialGlobalState: WorkstreamGlobalState = {
  code: null,
  title: null,
  status: "RFP_DRAFT",
  client: null,
  rfp: null,
  initialProposal: null,
  alternativeProposals: [],
  sow: null,
  paymentTerms: null,
  paymentRequests: [],
};
export const initialLocalState: WorkstreamLocalState = {};

export const utils: DocumentModelUtils<WorkstreamPHState> = {
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

    document.header.documentType = workstreamDocumentType;

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
    return isWorkstreamState(state);
  },
  assertIsStateOfType(state) {
    return assertIsWorkstreamState(state);
  },
  isDocumentOfType(document) {
    return isWorkstreamDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsWorkstreamDocument(document);
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
