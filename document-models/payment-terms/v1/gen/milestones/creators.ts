import { createAction } from "document-model/core";
import {
  AddMilestoneInputSchema,
  UpdateMilestoneInputSchema,
  UpdateMilestoneStatusInputSchema,
  DeleteMilestoneInputSchema,
  ReorderMilestonesInputSchema,
} from "../schema/zod.js";
import type {
  AddMilestoneInput,
  UpdateMilestoneInput,
  UpdateMilestoneStatusInput,
  DeleteMilestoneInput,
  ReorderMilestonesInput,
} from "../types.js";
import type {
  AddMilestoneAction,
  UpdateMilestoneAction,
  UpdateMilestoneStatusAction,
  DeleteMilestoneAction,
  ReorderMilestonesAction,
} from "./actions.js";

export const addMilestone = (input: AddMilestoneInput) =>
  createAction<AddMilestoneAction>(
    "ADD_MILESTONE",
    { ...input },
    undefined,
    AddMilestoneInputSchema,
    "global",
  );

export const updateMilestone = (input: UpdateMilestoneInput) =>
  createAction<UpdateMilestoneAction>(
    "UPDATE_MILESTONE",
    { ...input },
    undefined,
    UpdateMilestoneInputSchema,
    "global",
  );

export const updateMilestoneStatus = (input: UpdateMilestoneStatusInput) =>
  createAction<UpdateMilestoneStatusAction>(
    "UPDATE_MILESTONE_STATUS",
    { ...input },
    undefined,
    UpdateMilestoneStatusInputSchema,
    "global",
  );

export const deleteMilestone = (input: DeleteMilestoneInput) =>
  createAction<DeleteMilestoneAction>(
    "DELETE_MILESTONE",
    { ...input },
    undefined,
    DeleteMilestoneInputSchema,
    "global",
  );

export const reorderMilestones = (input: ReorderMilestonesInput) =>
  createAction<ReorderMilestonesAction>(
    "REORDER_MILESTONES",
    { ...input },
    undefined,
    ReorderMilestonesInputSchema,
    "global",
  );
