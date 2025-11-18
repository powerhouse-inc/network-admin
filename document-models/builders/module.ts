import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { BuildersPHState } from "@powerhousedao/network-admin/document-models/builders";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/network-admin/document-models/builders";

/** Document model module for the Todo List document type */
export const Builders: DocumentModelModule<BuildersPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
