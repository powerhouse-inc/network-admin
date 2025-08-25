import { BaseDocumentClass } from "document-model";
import {
  type EditWorkstreamInput,
  type EditClientInfoInput,
  type SetRequestForProposalInput,
  type AddPaymentRequestInput,
  type RemovePaymentRequestInput,
  type WorkstreamState,
  type WorkstreamLocalState,
} from "../types.js";
import {
  editWorkstream,
  editClientInfo,
  setRequestForProposal,
  addPaymentRequest,
  removePaymentRequest,
} from "./creators.js";
import { type WorkstreamAction } from "../actions.js";

export default class Workstream_Workstream extends BaseDocumentClass<
  WorkstreamState,
  WorkstreamLocalState,
  WorkstreamAction
> {
  public editWorkstream(input: EditWorkstreamInput) {
    return this.dispatch(editWorkstream(input));
  }

  public editClientInfo(input: EditClientInfoInput) {
    return this.dispatch(editClientInfo(input));
  }

  public setRequestForProposal(input: SetRequestForProposalInput) {
    return this.dispatch(setRequestForProposal(input));
  }

  public addPaymentRequest(input: AddPaymentRequestInput) {
    return this.dispatch(addPaymentRequest(input));
  }

  public removePaymentRequest(input: RemovePaymentRequestInput) {
    return this.dispatch(removePaymentRequest(input));
  }
}
