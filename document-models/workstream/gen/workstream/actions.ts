import { type BaseAction } from "document-model";
import type {
  EditWorkstreamInput,
  EditClientInfoInput,
  SetRequestForProposalInput,
  AddPaymentRequestInput,
  RemovePaymentRequestInput,
} from "../types.js";

export type EditWorkstreamAction = BaseAction<
  "EDIT_WORKSTREAM",
  EditWorkstreamInput,
  "global"
>;
export type EditClientInfoAction = BaseAction<
  "EDIT_CLIENT_INFO",
  EditClientInfoInput,
  "global"
>;
export type SetRequestForProposalAction = BaseAction<
  "SET_REQUEST_FOR_PROPOSAL",
  SetRequestForProposalInput,
  "global"
>;
export type AddPaymentRequestAction = BaseAction<
  "ADD_PAYMENT_REQUEST",
  AddPaymentRequestInput,
  "global"
>;
export type RemovePaymentRequestAction = BaseAction<
  "REMOVE_PAYMENT_REQUEST",
  RemovePaymentRequestInput,
  "global"
>;

export type WorkstreamWorkstreamAction =
  | EditWorkstreamAction
  | EditClientInfoAction
  | SetRequestForProposalAction
  | AddPaymentRequestAction
  | RemovePaymentRequestAction;
