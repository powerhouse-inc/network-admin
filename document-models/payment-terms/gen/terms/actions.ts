import { type Action } from "document-model";
import type {
  SetBasicTermsInput,
  UpdateStatusInput,
  SetTimeAndMaterialsInput,
  SetEscrowDetailsInput,
  SetEvaluationTermsInput,
} from "../types.js";

export type SetBasicTermsAction = Action & {
  type: "SET_BASIC_TERMS";
  input: SetBasicTermsInput;
};
export type UpdateStatusAction = Action & {
  type: "UPDATE_STATUS";
  input: UpdateStatusInput;
};
export type SetTimeAndMaterialsAction = Action & {
  type: "SET_TIME_AND_MATERIALS";
  input: SetTimeAndMaterialsInput;
};
export type SetEscrowDetailsAction = Action & {
  type: "SET_ESCROW_DETAILS";
  input: SetEscrowDetailsInput;
};
export type SetEvaluationTermsAction = Action & {
  type: "SET_EVALUATION_TERMS";
  input: SetEvaluationTermsInput;
};

export type PaymentTermsTermsAction =
  | SetBasicTermsAction
  | UpdateStatusAction
  | SetTimeAndMaterialsAction
  | SetEscrowDetailsAction
  | SetEvaluationTermsAction;
