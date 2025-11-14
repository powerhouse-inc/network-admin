import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { WorkstreamPHState } from "@powerhousedao/network-admin/document-models/workstream";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/network-admin/document-models/workstream";

/** Document model module for the Todo List document type */
export const Workstream: DocumentModelModule<WorkstreamPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
