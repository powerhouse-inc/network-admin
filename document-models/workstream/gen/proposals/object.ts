import { BaseDocumentClass } from "document-model";
import {
  type EditInitialProposalInput,
  type AddAlternativeProposalInput,
  type EditAlternativeProposalInput,
  type RemoveAlternativeProposalInput,
  type WorkstreamState,
  type WorkstreamLocalState,
} from "../types.js";
import {
  editInitialProposal,
  addAlternativeProposal,
  editAlternativeProposal,
  removeAlternativeProposal,
} from "./creators.js";
import { type WorkstreamAction } from "../actions.js";

export default class Workstream_Proposals extends BaseDocumentClass<
  WorkstreamState,
  WorkstreamLocalState,
  WorkstreamAction
> {
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
