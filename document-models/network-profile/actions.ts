import { baseActions } from "document-model";
import { networkProfileManagementActions } from "./gen/creators.js";

/** Actions for the NetworkProfile document model */
export const actions = { ...baseActions, ...networkProfileManagementActions };
