import { createAction } from "document-model/core";
import { z, type EditRfpInput } from "../types.js";
import { type EditRfpAction } from "./actions.js";

export const editRfp = (input: EditRfpInput) =>
  createAction<EditRfpAction>(
    "EDIT_RFP",
    { ...input },
    undefined,
    z.EditRfpInputSchema,
    "global",
  );
