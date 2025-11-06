import { createAction } from "document-model/core";
import {
  z,
  type EditWorkstreamInput,
  type EditClientInfoInput,
  type SetRequestForProposalInput,
  type AddPaymentRequestInput,
  type RemovePaymentRequestInput,
} from "../types.js";
import {
  type EditWorkstreamAction,
  type EditClientInfoAction,
  type SetRequestForProposalAction,
  type AddPaymentRequestAction,
  type RemovePaymentRequestAction,
} from "./actions.js";

export const editWorkstream = (input: EditWorkstreamInput) =>
  createAction<EditWorkstreamAction>(
    "EDIT_WORKSTREAM",
    { ...input },
    undefined,
    z.EditWorkstreamInputSchema,
    "global",
  );

export const editClientInfo = (input: EditClientInfoInput) =>
  createAction<EditClientInfoAction>(
    "EDIT_CLIENT_INFO",
    { ...input },
    undefined,
    z.EditClientInfoInputSchema,
    "global",
  );

export const setRequestForProposal = (input: SetRequestForProposalInput) =>
  createAction<SetRequestForProposalAction>(
    "SET_REQUEST_FOR_PROPOSAL",
    { ...input },
    undefined,
    z.SetRequestForProposalInputSchema,
    "global",
  );

export const addPaymentRequest = (input: AddPaymentRequestInput) =>
  createAction<AddPaymentRequestAction>(
    "ADD_PAYMENT_REQUEST",
    { ...input },
    undefined,
    z.AddPaymentRequestInputSchema,
    "global",
  );

export const removePaymentRequest = (input: RemovePaymentRequestInput) =>
  createAction<RemovePaymentRequestAction>(
    "REMOVE_PAYMENT_REQUEST",
    { ...input },
    undefined,
    z.RemovePaymentRequestInputSchema,
    "global",
  );
