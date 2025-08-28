import { createAction } from "document-model";
import {
  z,
  type AddBonusClauseInput,
  type UpdateBonusClauseInput,
  type DeleteBonusClauseInput,
  type AddPenaltyClauseInput,
  type UpdatePenaltyClauseInput,
  type DeletePenaltyClauseInput,
} from "../types.js";
import {
  type AddBonusClauseAction,
  type UpdateBonusClauseAction,
  type DeleteBonusClauseAction,
  type AddPenaltyClauseAction,
  type UpdatePenaltyClauseAction,
  type DeletePenaltyClauseAction,
} from "./actions.js";

export const addBonusClause = (input: AddBonusClauseInput) =>
  createAction<AddBonusClauseAction>(
    "ADD_BONUS_CLAUSE",
    { ...input },
    undefined,
    z.AddBonusClauseInputSchema,
    "global",
  );

export const updateBonusClause = (input: UpdateBonusClauseInput) =>
  createAction<UpdateBonusClauseAction>(
    "UPDATE_BONUS_CLAUSE",
    { ...input },
    undefined,
    z.UpdateBonusClauseInputSchema,
    "global",
  );

export const deleteBonusClause = (input: DeleteBonusClauseInput) =>
  createAction<DeleteBonusClauseAction>(
    "DELETE_BONUS_CLAUSE",
    { ...input },
    undefined,
    z.DeleteBonusClauseInputSchema,
    "global",
  );

export const addPenaltyClause = (input: AddPenaltyClauseInput) =>
  createAction<AddPenaltyClauseAction>(
    "ADD_PENALTY_CLAUSE",
    { ...input },
    undefined,
    z.AddPenaltyClauseInputSchema,
    "global",
  );

export const updatePenaltyClause = (input: UpdatePenaltyClauseInput) =>
  createAction<UpdatePenaltyClauseAction>(
    "UPDATE_PENALTY_CLAUSE",
    { ...input },
    undefined,
    z.UpdatePenaltyClauseInputSchema,
    "global",
  );

export const deletePenaltyClause = (input: DeletePenaltyClauseInput) =>
  createAction<DeletePenaltyClauseAction>(
    "DELETE_PENALTY_CLAUSE",
    { ...input },
    undefined,
    z.DeletePenaltyClauseInputSchema,
    "global",
  );
