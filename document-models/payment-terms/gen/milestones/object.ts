import { BaseDocumentClass } from "document-model";
import { PaymentTermsPHState } from "../ph-factories.js";
import {
  type AddMilestoneInput,
  type UpdateMilestoneInput,
  type UpdateMilestoneStatusInput,
  type DeleteMilestoneInput,
  type ReorderMilestonesInput,
} from "../types.js";
import {
  addMilestone,
  updateMilestone,
  updateMilestoneStatus,
  deleteMilestone,
  reorderMilestones,
} from "./creators.js";
import { type PaymentTermsAction } from "../actions.js";

export default class PaymentTerms_Milestones extends BaseDocumentClass<PaymentTermsPHState> {
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
