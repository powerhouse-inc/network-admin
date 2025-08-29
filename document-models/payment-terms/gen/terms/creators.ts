import { createAction } from "document-model";
import {
  z,
  type SetBasicTermsInput,
  type UpdateStatusInput,
  type SetCostAndMaterialsInput,
  type SetEscrowDetailsInput,
  type SetEvaluationTermsInput,
  type SetRetainerDetailsInput,
} from "../types.js";
import {
  type SetBasicTermsAction,
  type UpdateStatusAction,
  type SetCostAndMaterialsAction,
  type SetEscrowDetailsAction,
  type SetEvaluationTermsAction,
  type SetRetainerDetailsAction,
} from "./actions.js";

export const setBasicTerms = (input: SetBasicTermsInput) =>
  createAction<SetBasicTermsAction>(
    "SET_BASIC_TERMS",
    { ...input },
    undefined,
    z.SetBasicTermsInputSchema,
    "global",
  );

export const updateStatus = (input: UpdateStatusInput) =>
  createAction<UpdateStatusAction>(
    "UPDATE_STATUS",
    { ...input },
    undefined,
    z.UpdateStatusInputSchema,
    "global",
  );

export const setCostAndMaterials = (input: SetCostAndMaterialsInput) =>
  createAction<SetCostAndMaterialsAction>(
    "SET_COST_AND_MATERIALS",
    { ...input },
    undefined,
    z.SetCostAndMaterialsInputSchema,
    "global",
  );

export const setEscrowDetails = (input: SetEscrowDetailsInput) =>
  createAction<SetEscrowDetailsAction>(
    "SET_ESCROW_DETAILS",
    { ...input },
    undefined,
    z.SetEscrowDetailsInputSchema,
    "global",
  );

export const setEvaluationTerms = (input: SetEvaluationTermsInput) =>
  createAction<SetEvaluationTermsAction>(
    "SET_EVALUATION_TERMS",
    { ...input },
    undefined,
    z.SetEvaluationTermsInputSchema,
    "global",
  );

export const setRetainerDetails = (input: SetRetainerDetailsInput) =>
  createAction<SetRetainerDetailsAction>(
    "SET_RETAINER_DETAILS",
    { ...input },
    undefined,
    z.SetRetainerDetailsInputSchema,
    "global",
  );
