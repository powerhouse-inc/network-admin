import { BaseDocumentClass } from "document-model";
import {
  type SetBasicTermsInput,
  type UpdateStatusInput,
  type SetTimeAndMaterialsInput,
  type SetEscrowDetailsInput,
  type SetEvaluationTermsInput,
  type PaymentTermsState,
  type PaymentTermsLocalState,
} from "../types.js";
import {
  setBasicTerms,
  updateStatus,
  setTimeAndMaterials,
  setEscrowDetails,
  setEvaluationTerms,
} from "./creators.js";
import { type PaymentTermsAction } from "../actions.js";

export default class PaymentTerms_Terms extends BaseDocumentClass<
  PaymentTermsState,
  PaymentTermsLocalState,
  PaymentTermsAction
> {
  public setBasicTerms(input: SetBasicTermsInput) {
    return this.dispatch(setBasicTerms(input));
  }

  public updateStatus(input: UpdateStatusInput) {
    return this.dispatch(updateStatus(input));
  }

  public setTimeAndMaterials(input: SetTimeAndMaterialsInput) {
    return this.dispatch(setTimeAndMaterials(input));
  }

  public setEscrowDetails(input: SetEscrowDetailsInput) {
    return this.dispatch(setEscrowDetails(input));
  }

  public setEvaluationTerms(input: SetEvaluationTermsInput) {
    return this.dispatch(setEvaluationTerms(input));
  }
}
