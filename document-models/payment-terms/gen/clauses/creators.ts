import { createAction } from "document-model/core";
import {
  AddBonusClauseInputSchema,
  UpdateBonusClauseInputSchema,
  DeleteBonusClauseInputSchema,
  AddPenaltyClauseInputSchema,
  UpdatePenaltyClauseInputSchema,
  DeletePenaltyClauseInputSchema,
} from "../schema/zod.js";
import type {
  AddBonusClauseInput,
  UpdateBonusClauseInput,
  DeleteBonusClauseInput,
  AddPenaltyClauseInput,
  UpdatePenaltyClauseInput,
  DeletePenaltyClauseInput,
} from "../types.js";
import type {
  AddBonusClauseAction,
  UpdateBonusClauseAction,
  DeleteBonusClauseAction,
  AddPenaltyClauseAction,
  UpdatePenaltyClauseAction,
  DeletePenaltyClauseAction,
} from "./actions.js";

export const addBonusClause = (input: AddBonusClauseInput) =>
  createAction<AddBonusClauseAction>(
    "ADD_BONUS_CLAUSE",
    { ...input },
    undefined,
    AddBonusClauseInputSchema,
    "global",
  );

export const updateBonusClause = (input: UpdateBonusClauseInput) =>
  createAction<UpdateBonusClauseAction>(
    "UPDATE_BONUS_CLAUSE",
    { ...input },
    undefined,
    UpdateBonusClauseInputSchema,
    "global",
  );

export const deleteBonusClause = (input: DeleteBonusClauseInput) =>
  createAction<DeleteBonusClauseAction>(
    "DELETE_BONUS_CLAUSE",
    { ...input },
    undefined,
    DeleteBonusClauseInputSchema,
    "global",
  );

export const addPenaltyClause = (input: AddPenaltyClauseInput) =>
  createAction<AddPenaltyClauseAction>(
    "ADD_PENALTY_CLAUSE",
    { ...input },
    undefined,
    AddPenaltyClauseInputSchema,
    "global",
  );

export const updatePenaltyClause = (input: UpdatePenaltyClauseInput) =>
  createAction<UpdatePenaltyClauseAction>(
    "UPDATE_PENALTY_CLAUSE",
    { ...input },
    undefined,
    UpdatePenaltyClauseInputSchema,
    "global",
  );

export const deletePenaltyClause = (input: DeletePenaltyClauseInput) =>
  createAction<DeletePenaltyClauseAction>(
    "DELETE_PENALTY_CLAUSE",
    { ...input },
    undefined,
    DeletePenaltyClauseInputSchema,
    "global",
  );
