import type { WorkstreamWorkstreamAction } from "./workstream/actions.js";
import type { WorkstreamProposalsAction } from "./proposals/actions.js";

export * from "./workstream/actions.js";
export * from "./proposals/actions.js";

export type WorkstreamAction =
  | WorkstreamWorkstreamAction
  | WorkstreamProposalsAction;
