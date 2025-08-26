import { createAction } from "document-model";
import {
  z,
  type AddContextDocumentInput,
  type RemoveContextDocumentInput,
} from "../types.js";
import {
  type AddContextDocumentAction,
  type RemoveContextDocumentAction,
} from "./actions.js";

export const addContextDocument = (input: AddContextDocumentInput) =>
  createAction<AddContextDocumentAction>(
    "ADD_CONTEXT_DOCUMENT",
    { ...input },
    undefined,
    z.AddContextDocumentInputSchema,
    "global",
  );

export const removeContextDocument = (input: RemoveContextDocumentInput) =>
  createAction<RemoveContextDocumentAction>(
    "REMOVE_CONTEXT_DOCUMENT",
    { ...input },
    undefined,
    z.RemoveContextDocumentInputSchema,
    "global",
  );
