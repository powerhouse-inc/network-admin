import { createAction } from "document-model";
import {
  z,
  type SetBasicTermsInput,
  type UpdateStatusInput,
  type SetTimeAndMaterialsInput,
  type SetEscrowDetailsInput,
  type SetEvaluationTermsInput,
} from "../types.js";
import {
  type SetBasicTermsAction,
  type UpdateStatusAction,
  type SetTimeAndMaterialsAction,
  type SetEscrowDetailsAction,
  type SetEvaluationTermsAction,
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

export const setTimeAndMaterials = (input: SetTimeAndMaterialsInput) =>
  createAction<SetTimeAndMaterialsAction>(
    "SET_TIME_AND_MATERIALS",
    { ...input },
    undefined,
    z.SetTimeAndMaterialsInputSchema,
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
