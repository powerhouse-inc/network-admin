import { BaseDocumentClass } from "document-model";
import { PaymentTermsPHState } from "../ph-factories.js";
import {
  type SetBasicTermsInput,
  type UpdateStatusInput,
  type SetCostAndMaterialsInput,
  type SetEscrowDetailsInput,
  type SetEvaluationTermsInput,
  type SetRetainerDetailsInput,
} from "../types.js";
import {
  setBasicTerms,
  updateStatus,
  setCostAndMaterials,
  setEscrowDetails,
  setEvaluationTerms,
  setRetainerDetails,
} from "./creators.js";
import { type PaymentTermsAction } from "../actions.js";

export default class PaymentTerms_Terms extends BaseDocumentClass<PaymentTermsPHState> {
  public setBasicTerms(input: SetBasicTermsInput) {
    return this.dispatch(setBasicTerms(input));
  }

  public updateStatus(input: UpdateStatusInput) {
    return this.dispatch(updateStatus(input));
  }

  public setCostAndMaterials(input: SetCostAndMaterialsInput) {
    return this.dispatch(setCostAndMaterials(input));
  }

  public setEscrowDetails(input: SetEscrowDetailsInput) {
    return this.dispatch(setEscrowDetails(input));
  }

  public setEvaluationTerms(input: SetEvaluationTermsInput) {
    return this.dispatch(setEvaluationTerms(input));
  }

  public setRetainerDetails(input: SetRetainerDetailsInput) {
    return this.dispatch(setRetainerDetails(input));
  }
}
