import { baseActions } from "document-model";
import { networkProfileNetworkProfileManagementActions } from "./gen/creators.js";

/** Actions for the NetworkProfile document model */

export const actions = {
  ...baseActions,
  ...networkProfileNetworkProfileManagementActions,
};
