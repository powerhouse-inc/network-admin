import {
  BaseDocumentClass,
  type BaseStateFromDocument,
  type PartialState,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import {
  type PaymentTermsState,
  type PaymentTermsLocalState,
  type PaymentTermsDocument,
} from "./types.js";
import { type PaymentTermsAction } from "./actions.js";
import { reducer } from "./reducer.js";
import utils from "./utils.js";
import PaymentTerms_Terms from "./terms/object.js";
import PaymentTerms_Milestones from "./milestones/object.js";
import PaymentTerms_Clauses from "./clauses/object.js";

export * from "./terms/object.js";
export * from "./milestones/object.js";
export * from "./clauses/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface PaymentTerms
  extends PaymentTerms_Terms,
    PaymentTerms_Milestones,
    PaymentTerms_Clauses {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class PaymentTerms extends BaseDocumentClass<
  PaymentTermsState,
  PaymentTermsLocalState,
  PaymentTermsAction
> {
  static fileExtension = "pterms";

  constructor(
    initialState?: Partial<BaseStateFromDocument<PaymentTermsDocument>>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, utils.createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, PaymentTerms.fileExtension, name);
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

applyMixins(PaymentTerms, [
  PaymentTerms_Terms,
  PaymentTerms_Milestones,
  PaymentTerms_Clauses,
]);

export { PaymentTerms };
