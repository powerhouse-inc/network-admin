import type { DocumentModelModule } from "document-model";
import { NetworkProfile } from "./network-profile/module.js";
import { PaymentTerms } from "./payment-terms/module.js";
import { RequestForProposals } from "./request-for-proposals/module.js";
import { Workstream } from "./workstream/module.js";
import { Builders } from "./builders/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  NetworkProfile,
  PaymentTerms,
  RequestForProposals,
  Workstream,
  Builders,
];
