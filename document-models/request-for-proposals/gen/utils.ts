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
  type RequestForProposalsState,
  type RequestForProposalsLocalState,
} from "./types.js";
import { RequestForProposalsPHState } from "./ph-factories.js";
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

export const createState: CreateState<RequestForProposalsPHState> = (state) => {
  return {
    ...defaultBaseState(),
    global: { ...initialGlobalState, ...(state?.global ?? {}) },
    local: { ...initialLocalState, ...(state?.local ?? {}) },
  };
};

export const createDocument: CreateDocument<RequestForProposalsPHState> = (
  state,
) => {
  const document = baseCreateDocument(createState, state);
  document.header.documentType = "powerhouse/rfp";
  // for backwards compatibility, but this is NOT a valid signed document id
  document.header.id = generateId();
  return document;
};

export const saveToFile = (document: any, path: string, name?: string) => {
  return baseSaveToFile(document, path, ".phdm", name);
};

export const saveToFileHandle = (document: any, input: any) => {
  return baseSaveToFileHandle(document, input);
};

export const loadFromFile: LoadFromFile<RequestForProposalsPHState> = (
  path,
) => {
  return baseLoadFromFile(path, reducer);
};

export const loadFromInput: LoadFromInput<RequestForProposalsPHState> = (
  input,
) => {
  return baseLoadFromInput(input, reducer);
};

const utils = {
  fileExtension: ".phdm",
  createState,
  createDocument,
  saveToFile,
  saveToFileHandle,
  loadFromFile,
  loadFromInput,
};

export default utils;
