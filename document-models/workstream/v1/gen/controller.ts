import { PHDocumentController } from "document-model/core";
import { Workstream } from "../module.js";
import type { WorkstreamAction, WorkstreamPHState } from "./types.js";

export const WorkstreamController = PHDocumentController.forDocumentModel<
  WorkstreamPHState,
  WorkstreamAction
>(Workstream);
