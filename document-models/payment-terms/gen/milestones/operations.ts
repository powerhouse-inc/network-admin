import { type SignalDispatch } from "document-model";
import {
  type AddMilestoneAction,
  type UpdateMilestoneAction,
  type UpdateMilestoneStatusAction,
  type DeleteMilestoneAction,
  type ReorderMilestonesAction,
} from "./actions.js";
import { type PaymentTermsState } from "../types.js";

export interface PaymentTermsMilestonesOperations {
  addMilestoneOperation: (
    state: PaymentTermsState,
    action: AddMilestoneAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateMilestoneOperation: (
    state: PaymentTermsState,
    action: UpdateMilestoneAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateMilestoneStatusOperation: (
    state: PaymentTermsState,
    action: UpdateMilestoneStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteMilestoneOperation: (
    state: PaymentTermsState,
    action: DeleteMilestoneAction,
    dispatch?: SignalDispatch,
  ) => void;
  reorderMilestonesOperation: (
    state: PaymentTermsState,
    action: ReorderMilestonesAction,
    dispatch?: SignalDispatch,
  ) => void;
}
