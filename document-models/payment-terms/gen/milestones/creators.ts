import { createAction } from "document-model/core";
import {
  z,
  type AddMilestoneInput,
  type UpdateMilestoneInput,
  type UpdateMilestoneStatusInput,
  type DeleteMilestoneInput,
  type ReorderMilestonesInput,
} from "../types.js";
import {
  type AddMilestoneAction,
  type UpdateMilestoneAction,
  type UpdateMilestoneStatusAction,
  type DeleteMilestoneAction,
  type ReorderMilestonesAction,
} from "./actions.js";

export const addMilestone = (input: AddMilestoneInput) =>
  createAction<AddMilestoneAction>(
    "ADD_MILESTONE",
    { ...input },
    undefined,
    z.AddMilestoneInputSchema,
    "global",
  );

export const updateMilestone = (input: UpdateMilestoneInput) =>
  createAction<UpdateMilestoneAction>(
    "UPDATE_MILESTONE",
    { ...input },
    undefined,
    z.UpdateMilestoneInputSchema,
    "global",
  );

export const updateMilestoneStatus = (input: UpdateMilestoneStatusInput) =>
  createAction<UpdateMilestoneStatusAction>(
    "UPDATE_MILESTONE_STATUS",
    { ...input },
    undefined,
    z.UpdateMilestoneStatusInputSchema,
    "global",
  );

export const deleteMilestone = (input: DeleteMilestoneInput) =>
  createAction<DeleteMilestoneAction>(
    "DELETE_MILESTONE",
    { ...input },
    undefined,
    z.DeleteMilestoneInputSchema,
    "global",
  );

export const reorderMilestones = (input: ReorderMilestonesInput) =>
  createAction<ReorderMilestonesAction>(
    "REORDER_MILESTONES",
    { ...input },
    undefined,
    z.ReorderMilestonesInputSchema,
    "global",
  );
