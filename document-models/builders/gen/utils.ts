import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type { BuildersGlobalState, BuildersLocalState } from "./types.js";
import type { BuildersPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { buildersDocumentType } from "./document-type.js";
import {
  isBuildersDocument,
  assertIsBuildersDocument,
  isBuildersState,
  assertIsBuildersState,
} from "./document-schema.js";

export const initialGlobalState: BuildersGlobalState = {
  builders: [],
};
export const initialLocalState: BuildersLocalState = {};

export const utils: DocumentModelUtils<BuildersPHState> = {
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

    document.header.documentType = buildersDocumentType;

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
    return isBuildersState(state);
  },
  assertIsStateOfType(state) {
    return assertIsBuildersState(state);
  },
  isDocumentOfType(document) {
    return isBuildersDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsBuildersDocument(document);
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
