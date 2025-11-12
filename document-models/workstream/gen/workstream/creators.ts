import { createAction } from "document-model/core";
import {
  EditWorkstreamInputSchema,
  EditClientInfoInputSchema,
  SetRequestForProposalInputSchema,
  AddPaymentRequestInputSchema,
  RemovePaymentRequestInputSchema,
} from "../schema/zod.js";
import type {
  EditWorkstreamInput,
  EditClientInfoInput,
  SetRequestForProposalInput,
  AddPaymentRequestInput,
  RemovePaymentRequestInput,
} from "../types.js";
import type {
  EditWorkstreamAction,
  EditClientInfoAction,
  SetRequestForProposalAction,
  AddPaymentRequestAction,
  RemovePaymentRequestAction,
} from "./actions.js";

export const editWorkstream = (input: EditWorkstreamInput) =>
  createAction<EditWorkstreamAction>(
    "EDIT_WORKSTREAM",
    { ...input },
    undefined,
    EditWorkstreamInputSchema,
    "global",
  );

export const editClientInfo = (input: EditClientInfoInput) =>
  createAction<EditClientInfoAction>(
    "EDIT_CLIENT_INFO",
    { ...input },
    undefined,
    EditClientInfoInputSchema,
    "global",
  );

export const setRequestForProposal = (input: SetRequestForProposalInput) =>
  createAction<SetRequestForProposalAction>(
    "SET_REQUEST_FOR_PROPOSAL",
    { ...input },
    undefined,
    SetRequestForProposalInputSchema,
    "global",
  );

export const addPaymentRequest = (input: AddPaymentRequestInput) =>
  createAction<AddPaymentRequestAction>(
    "ADD_PAYMENT_REQUEST",
    { ...input },
    undefined,
    AddPaymentRequestInputSchema,
    "global",
  );

export const removePaymentRequest = (input: RemovePaymentRequestInput) =>
  createAction<RemovePaymentRequestAction>(
    "REMOVE_PAYMENT_REQUEST",
    { ...input },
    undefined,
    RemovePaymentRequestInputSchema,
    "global",
  );
