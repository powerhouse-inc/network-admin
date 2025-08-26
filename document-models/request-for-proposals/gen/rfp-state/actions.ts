import { type BaseAction } from "document-model";
import type { EditRfpInput } from "../types.js";

export type EditRfpAction = BaseAction<"EDIT_RFP", EditRfpInput, "global">;

export type RequestForProposalsRfpStateAction = EditRfpAction;
