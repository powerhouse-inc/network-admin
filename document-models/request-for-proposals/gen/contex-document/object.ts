import { BaseDocumentClass } from "document-model";
import { RequestForProposalsPHState } from "../ph-factories.js";
import {
  type AddContextDocumentInput,
  type RemoveContextDocumentInput,
} from "../types.js";
import { addContextDocument, removeContextDocument } from "./creators.js";
import { type RequestForProposalsAction } from "../actions.js";

export default class RequestForProposals_ContexDocument extends BaseDocumentClass<RequestForProposalsPHState> {
  public addContextDocument(input: AddContextDocumentInput) {
    return this.dispatch(addContextDocument(input));
  }

  public removeContextDocument(input: RemoveContextDocumentInput) {
    return this.dispatch(removeContextDocument(input));
  }
}
