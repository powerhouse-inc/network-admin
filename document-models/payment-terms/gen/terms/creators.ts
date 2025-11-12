import { createAction } from "document-model/core";
import {
  SetBasicTermsInputSchema,
  UpdateStatusInputSchema,
  SetTimeAndMaterialsInputSchema,
  SetEscrowDetailsInputSchema,
  SetEvaluationTermsInputSchema,
} from "../schema/zod.js";
import type {
  SetBasicTermsInput,
  UpdateStatusInput,
  SetTimeAndMaterialsInput,
  SetEscrowDetailsInput,
  SetEvaluationTermsInput,
} from "../types.js";
import type {
  SetBasicTermsAction,
  UpdateStatusAction,
  SetTimeAndMaterialsAction,
  SetEscrowDetailsAction,
  SetEvaluationTermsAction,
} from "./actions.js";

export const setBasicTerms = (input: SetBasicTermsInput) =>
  createAction<SetBasicTermsAction>(
    "SET_BASIC_TERMS",
    { ...input },
    undefined,
    SetBasicTermsInputSchema,
    "global",
  );

export const updateStatus = (input: UpdateStatusInput) =>
  createAction<UpdateStatusAction>(
    "UPDATE_STATUS",
    { ...input },
    undefined,
    UpdateStatusInputSchema,
    "global",
  );

export const setTimeAndMaterials = (input: SetTimeAndMaterialsInput) =>
  createAction<SetTimeAndMaterialsAction>(
    "SET_TIME_AND_MATERIALS",
    { ...input },
    undefined,
    SetTimeAndMaterialsInputSchema,
    "global",
  );

export const setEscrowDetails = (input: SetEscrowDetailsInput) =>
  createAction<SetEscrowDetailsAction>(
    "SET_ESCROW_DETAILS",
    { ...input },
    undefined,
    SetEscrowDetailsInputSchema,
    "global",
  );

export const setEvaluationTerms = (input: SetEvaluationTermsInput) =>
  createAction<SetEvaluationTermsAction>(
    "SET_EVALUATION_TERMS",
    { ...input },
    undefined,
    SetEvaluationTermsInputSchema,
    "global",
  );
