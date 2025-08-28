import { type Action } from "document-model";
import type {
  AddMilestoneInput,
  UpdateMilestoneInput,
  UpdateMilestoneStatusInput,
  DeleteMilestoneInput,
  ReorderMilestonesInput,
} from "../types.js";

export type AddMilestoneAction = Action & {
  type: "ADD_MILESTONE";
  input: AddMilestoneInput;
};
export type UpdateMilestoneAction = Action & {
  type: "UPDATE_MILESTONE";
  input: UpdateMilestoneInput;
};
export type UpdateMilestoneStatusAction = Action & {
  type: "UPDATE_MILESTONE_STATUS";
  input: UpdateMilestoneStatusInput;
};
export type DeleteMilestoneAction = Action & {
  type: "DELETE_MILESTONE";
  input: DeleteMilestoneInput;
};
export type ReorderMilestonesAction = Action & {
  type: "REORDER_MILESTONES";
  input: ReorderMilestonesInput;
};

export type PaymentTermsMilestonesAction =
  | AddMilestoneAction
  | UpdateMilestoneAction
  | UpdateMilestoneStatusAction
  | DeleteMilestoneAction
  | ReorderMilestonesAction;
