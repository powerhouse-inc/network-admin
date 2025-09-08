import { BaseDocumentClass } from "document-model";
import { WorkstreamPHState } from "../ph-factories.js";
import {
  type EditInitialProposalInput,
  type AddAlternativeProposalInput,
  type EditAlternativeProposalInput,
  type RemoveAlternativeProposalInput,
} from "../types.js";
import {
  editInitialProposal,
  addAlternativeProposal,
  editAlternativeProposal,
  removeAlternativeProposal,
} from "./creators.js";
import { type WorkstreamAction } from "../actions.js";

export default class Workstream_Proposals extends BaseDocumentClass<WorkstreamPHState> {
  public editInitialProposal(input: EditInitialProposalInput) {
    return this.dispatch(editInitialProposal(input));
  }

  public addAlternativeProposal(input: AddAlternativeProposalInput) {
    return this.dispatch(addAlternativeProposal(input));
  }

  public editAlternativeProposal(input: EditAlternativeProposalInput) {
    return this.dispatch(editAlternativeProposal(input));
  }

  public removeAlternativeProposal(input: RemoveAlternativeProposalInput) {
    return this.dispatch(removeAlternativeProposal(input));
  }
}
