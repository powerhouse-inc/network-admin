import { type Action } from "document-model";
import type {
  EditWorkstreamInput,
  EditClientInfoInput,
  SetRequestForProposalInput,
  AddPaymentRequestInput,
  RemovePaymentRequestInput,
} from "../types.js";

export type EditWorkstreamAction = Action & {
  type: "EDIT_WORKSTREAM";
  input: EditWorkstreamInput;
};
export type EditClientInfoAction = Action & {
  type: "EDIT_CLIENT_INFO";
  input: EditClientInfoInput;
};
export type SetRequestForProposalAction = Action & {
  type: "SET_REQUEST_FOR_PROPOSAL";
  input: SetRequestForProposalInput;
};
export type AddPaymentRequestAction = Action & {
  type: "ADD_PAYMENT_REQUEST";
  input: AddPaymentRequestInput;
};
export type RemovePaymentRequestAction = Action & {
  type: "REMOVE_PAYMENT_REQUEST";
  input: RemovePaymentRequestInput;
};

export type WorkstreamWorkstreamAction =
  | EditWorkstreamAction
  | EditClientInfoAction
  | SetRequestForProposalAction
  | AddPaymentRequestAction
  | RemovePaymentRequestAction;
