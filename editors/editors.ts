import type { EditorModule } from "document-model";
import { NetworkProfileEditor } from "./network-profile-editor/module.js";
import { RfpEditor } from "./rfp-editor/module.js";
import { PaymentTermsEditor } from "./payment-terms-editor/module.js";
import { WorkstreamEditor } from "./workstream-editor/module.js";
import { NetworkAdmin } from "./network-admin/module.js";
import { BuildersEditor } from "./builders-editor/module.js";

export const editors: EditorModule[] = [
  NetworkProfileEditor,
  RfpEditor,
  PaymentTermsEditor,
  WorkstreamEditor,
  NetworkAdmin,
  BuildersEditor,
];
