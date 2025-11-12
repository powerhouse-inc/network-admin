import { baseActions } from "document-model";
import { workstreamActions, proposalsActions } from "./gen/creators.js";

/** Actions for the Workstream document model */
export const actions = {
  ...baseActions,
  ...workstreamActions,
  ...proposalsActions,
};
