import type { DocumentModelModule } from "document-model";
import { Builders as BuildersV1 } from "./builders/v1/module.js";
import { NetworkProfile as NetworkProfileV1 } from "./network-profile/v1/module.js";
import { PaymentTerms as PaymentTermsV1 } from "./payment-terms/v1/module.js";
import { RequestForProposals as RequestForProposalsV1 } from "./request-for-proposals/v1/module.js";
import { Workstream as WorkstreamV1 } from "./workstream/v1/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  BuildersV1,
  NetworkProfileV1,
  PaymentTermsV1,
  RequestForProposalsV1,
  WorkstreamV1,
];
