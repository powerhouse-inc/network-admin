import type { EditorModule } from "document-model";
import { NetworkProfile } from "./network-profile/module.js";
import { PaymentTerms } from "./payment-terms/module.js";
import { RequestForProposals } from "./request-for-proposals/module.js";
import { Workstream } from "./workstream/module.js";
import { NetworkAdmin } from "./network-admin/module.js";

export const editors: EditorModule[] = [
  NetworkProfile,
  PaymentTerms,
  RequestForProposals,
  Workstream,
  NetworkAdmin,
];
