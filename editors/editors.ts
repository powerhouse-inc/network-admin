import type { EditorModule } from "document-model";
import { NetworkAdmin } from "./network-admin/module.js";
import { NetworkProfileEditor } from "./network-profile/module.js";
import { PaymentTermsEditor } from "./payment-terms/module.js";
import { RequestForProposalsEditor } from "./request-for-proposals/module.js";
import { WorkstreamEditor } from "./workstream/module.js";

export const editors: EditorModule[] = [
  NetworkAdmin,
  NetworkProfileEditor,
  PaymentTermsEditor,
  RequestForProposalsEditor,
  WorkstreamEditor,
];
