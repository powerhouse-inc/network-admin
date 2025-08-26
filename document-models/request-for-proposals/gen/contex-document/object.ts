import { BaseDocumentClass } from "document-model";
import {
  type AddContextDocumentInput,
  type RemoveContextDocumentInput,
  type RequestForProposalsState,
  type RequestForProposalsLocalState,
} from "../types.js";
import { addContextDocument, removeContextDocument } from "./creators.js";
import { type RequestForProposalsAction } from "../actions.js";

export default class RequestForProposals_ContexDocument extends BaseDocumentClass<
  RequestForProposalsState,
  RequestForProposalsLocalState,
  RequestForProposalsAction
> {
  public addContextDocument(input: AddContextDocumentInput) {
    return this.dispatch(addContextDocument(input));
  }

  public removeContextDocument(input: RemoveContextDocumentInput) {
    return this.dispatch(removeContextDocument(input));
  }
}
