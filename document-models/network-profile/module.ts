import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { NetworkProfilePHState } from "@powerhousedao/network-admin/document-models/network-profile";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/network-admin/document-models/network-profile";

/** Document model module for the Todo List document type */
export const NetworkProfile: DocumentModelModule<NetworkProfilePHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
