import {
  type DocumentModelUtils,
  baseCreateDocument,
  baseCreateExtendedState,
  baseSaveToFile,
  baseSaveToFileHandle,
  baseLoadFromFile,
  baseLoadFromInput,
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
  contextDocuments: [],
  proposals: [],
  deadline: null,
  tags: null,
};
export const initialLocalState: RequestForProposalsLocalState = {};

const utils: DocumentModelUtils<RequestForProposalsDocument> = {
  fileExtension: "",
  createState(state) {
    return {
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createExtendedState(extendedState) {
    return baseCreateExtendedState({ ...extendedState }, utils.createState);
  },
  createDocument(state) {
    const document = baseCreateDocument(
      utils.createExtendedState(state),
      utils.createState,
    );

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

export default utils;
