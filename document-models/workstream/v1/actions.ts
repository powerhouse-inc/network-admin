import { baseActions } from "document-model";
import {
  workstreamWorkstreamActions,
  workstreamProposalsActions,
} from "./gen/creators.js";

/** Actions for the Workstream document model */

export const actions = {
  ...baseActions,
  ...workstreamWorkstreamActions,
  ...workstreamProposalsActions,
};
