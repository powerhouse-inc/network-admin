import { BaseDocumentClass } from "document-model";
import { RequestForProposalsPHState } from "../ph-factories.js";
import { type EditRfpInput } from "../types.js";
import { editRfp } from "./creators.js";
import { type RequestForProposalsAction } from "../actions.js";

export default class RequestForProposals_RfpState extends BaseDocumentClass<RequestForProposalsPHState> {
  public editRfp(input: EditRfpInput) {
    return this.dispatch(editRfp(input));
  }
}
