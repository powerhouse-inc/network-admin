import { PHDocumentController } from "document-model/core";
import { Builders } from "../module.js";
import type { BuildersAction, BuildersPHState } from "./types.js";

export const BuildersController = PHDocumentController.forDocumentModel<
  BuildersPHState,
  BuildersAction
>(Builders);
