import { BaseDocumentClass } from "document-model";
import {
  type AddProposalInput,
  type ChangeProposalStatusInput,
  type RemoveProposalInput,
  type RequestForProposalsState,
  type RequestForProposalsLocalState,
} from "../types.js";
import {
  addProposal,
  changeProposalStatus,
  removeProposal,
} from "./creators.js";
import { type RequestForProposalsAction } from "../actions.js";

export default class RequestForProposals_Proposals extends BaseDocumentClass<
  RequestForProposalsState,
  RequestForProposalsLocalState,
  RequestForProposalsAction
> {
  public addProposal(input: AddProposalInput) {
    return this.dispatch(addProposal(input));
  }

  public changeProposalStatus(input: ChangeProposalStatusInput) {
    return this.dispatch(changeProposalStatus(input));
  }

  public removeProposal(input: RemoveProposalInput) {
    return this.dispatch(removeProposal(input));
  }
}
