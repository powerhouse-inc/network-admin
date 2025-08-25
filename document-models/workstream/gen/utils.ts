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
  type WorkstreamDocument,
  type WorkstreamState,
  type WorkstreamLocalState,
} from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: WorkstreamState = {
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

const utils: DocumentModelUtils<WorkstreamDocument> = {
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

    document.header.documentType = "powerhouse/workstream";

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
