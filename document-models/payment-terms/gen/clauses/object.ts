import { BaseDocumentClass } from "document-model";
import {
  type AddBonusClauseInput,
  type UpdateBonusClauseInput,
  type DeleteBonusClauseInput,
  type AddPenaltyClauseInput,
  type UpdatePenaltyClauseInput,
  type DeletePenaltyClauseInput,
  type PaymentTermsState,
  type PaymentTermsLocalState,
} from "../types.js";
import {
  addBonusClause,
  updateBonusClause,
  deleteBonusClause,
  addPenaltyClause,
  updatePenaltyClause,
  deletePenaltyClause,
} from "./creators.js";
import { type PaymentTermsAction } from "../actions.js";

export default class PaymentTerms_Clauses extends BaseDocumentClass<
  PaymentTermsState,
  PaymentTermsLocalState,
  PaymentTermsAction
> {
  public addBonusClause(input: AddBonusClauseInput) {
    return this.dispatch(addBonusClause(input));
  }

  public updateBonusClause(input: UpdateBonusClauseInput) {
    return this.dispatch(updateBonusClause(input));
  }

  public deleteBonusClause(input: DeleteBonusClauseInput) {
    return this.dispatch(deleteBonusClause(input));
  }

  public addPenaltyClause(input: AddPenaltyClauseInput) {
    return this.dispatch(addPenaltyClause(input));
  }

  public updatePenaltyClause(input: UpdatePenaltyClauseInput) {
    return this.dispatch(updatePenaltyClause(input));
  }

  public deletePenaltyClause(input: DeletePenaltyClauseInput) {
    return this.dispatch(deletePenaltyClause(input));
  }
}
