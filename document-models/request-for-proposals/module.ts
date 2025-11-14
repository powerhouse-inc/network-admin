import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { RequestForProposalsPHState } from "@powerhousedao/network-admin/document-models/request-for-proposals";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/network-admin/document-models/request-for-proposals";

/** Document model module for the Todo List document type */
export const RequestForProposals: DocumentModelModule<RequestForProposalsPHState> =
  {
    reducer,
    actions,
    utils,
    documentModel: createState(defaultBaseState(), documentModel),
  };
