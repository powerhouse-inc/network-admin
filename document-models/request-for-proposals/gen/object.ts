import {
  BaseDocumentClass,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { RequestForProposalsPHState } from "./ph-factories.js";
import { type RequestForProposalsAction } from "./actions.js";
import { reducer } from "./reducer.js";
import { createDocument } from "./utils.js";
import RequestForProposals_RfpState from "./rfp-state/object.js";
import RequestForProposals_ContexDocument from "./contex-document/object.js";
import RequestForProposals_Proposals from "./proposals/object.js";

export * from "./rfp-state/object.js";
export * from "./contex-document/object.js";
export * from "./proposals/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface RequestForProposals
  extends RequestForProposals_RfpState,
    RequestForProposals_ContexDocument,
    RequestForProposals_Proposals {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class RequestForProposals extends BaseDocumentClass<RequestForProposalsPHState> {
  static fileExtension = "";

  constructor(
    initialState?: Partial<RequestForProposalsPHState>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, RequestForProposals.fileExtension, name);
  }

  public loadFromFile(path: string) {
    return super.loadFromFile(path);
  }

  static async fromFile(path: string) {
    const document = new this();
    await document.loadFromFile(path);
    return document;
  }
}

applyMixins(RequestForProposals, [
  RequestForProposals_RfpState,
  RequestForProposals_ContexDocument,
  RequestForProposals_Proposals,
]);

export { RequestForProposals };
