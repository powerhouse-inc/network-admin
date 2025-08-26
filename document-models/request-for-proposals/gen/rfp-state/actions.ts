import { type Action } from "document-model";
import type { EditRfpInput } from "../types.js";

export type EditRfpAction = Action & { type: "EDIT_RFP"; input: EditRfpInput };

export type RequestForProposalsRfpStateAction = EditRfpAction;
