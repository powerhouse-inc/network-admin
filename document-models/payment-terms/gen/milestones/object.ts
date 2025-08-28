import { BaseDocumentClass } from "document-model";
import {
  type AddMilestoneInput,
  type UpdateMilestoneInput,
  type UpdateMilestoneStatusInput,
  type DeleteMilestoneInput,
  type ReorderMilestonesInput,
  type PaymentTermsState,
  type PaymentTermsLocalState,
} from "../types.js";
import {
  addMilestone,
  updateMilestone,
  updateMilestoneStatus,
  deleteMilestone,
  reorderMilestones,
} from "./creators.js";
import { type PaymentTermsAction } from "../actions.js";

export default class PaymentTerms_Milestones extends BaseDocumentClass<
  PaymentTermsState,
  PaymentTermsLocalState,
  PaymentTermsAction
> {
  public addMilestone(input: AddMilestoneInput) {
    return this.dispatch(addMilestone(input));
  }

  public updateMilestone(input: UpdateMilestoneInput) {
    return this.dispatch(updateMilestone(input));
  }

  public updateMilestoneStatus(input: UpdateMilestoneStatusInput) {
    return this.dispatch(updateMilestoneStatus(input));
  }

  public deleteMilestone(input: DeleteMilestoneInput) {
    return this.dispatch(deleteMilestone(input));
  }

  public reorderMilestones(input: ReorderMilestonesInput) {
    return this.dispatch(reorderMilestones(input));
  }
}
