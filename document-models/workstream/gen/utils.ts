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

const utils: DocumentModelUtils<WorkstreamPHState> = {
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

    document.header.documentType = "powerhouse/workstream";

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
