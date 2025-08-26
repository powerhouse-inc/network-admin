import { BaseDocumentClass } from "document-model";
import {
  type EditRfpInput,
  type RequestForProposalsState,
  type RequestForProposalsLocalState,
} from "../types.js";
import { editRfp } from "./creators.js";
import { type RequestForProposalsAction } from "../actions.js";

export default class RequestForProposals_RfpState extends BaseDocumentClass<
  RequestForProposalsState,
  RequestForProposalsLocalState,
  RequestForProposalsAction
> {
  public editRfp(input: EditRfpInput) {
    return this.dispatch(editRfp(input));
  }
}
