import { PHDocumentController } from "document-model/core";
import { NetworkProfile } from "../module.js";
import type { NetworkProfileAction, NetworkProfilePHState } from "./types.js";

export const NetworkProfileController = PHDocumentController.forDocumentModel<
  NetworkProfilePHState,
  NetworkProfileAction
>(NetworkProfile);
