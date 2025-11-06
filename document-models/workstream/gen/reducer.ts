// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { WorkstreamPHState } from "./types.js";
import { z } from "./types.js";

import { reducer as WorkstreamReducer } from "../src/reducers/workstream.js";
import { reducer as ProposalsReducer } from "../src/reducers/proposals.js";

export const stateReducer: StateReducer<WorkstreamPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "EDIT_WORKSTREAM":
      z.EditWorkstreamInputSchema().parse(action.input);
      WorkstreamReducer.editWorkstreamOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_CLIENT_INFO":
      z.EditClientInfoInputSchema().parse(action.input);
      WorkstreamReducer.editClientInfoOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_REQUEST_FOR_PROPOSAL":
      z.SetRequestForProposalInputSchema().parse(action.input);
      WorkstreamReducer.setRequestForProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_PAYMENT_REQUEST":
      z.AddPaymentRequestInputSchema().parse(action.input);
      WorkstreamReducer.addPaymentRequestOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_PAYMENT_REQUEST":
      z.RemovePaymentRequestInputSchema().parse(action.input);
      WorkstreamReducer.removePaymentRequestOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_INITIAL_PROPOSAL":
      z.EditInitialProposalInputSchema().parse(action.input);
      ProposalsReducer.editInitialProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_ALTERNATIVE_PROPOSAL":
      z.AddAlternativeProposalInputSchema().parse(action.input);
      ProposalsReducer.addAlternativeProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "EDIT_ALTERNATIVE_PROPOSAL":
      z.EditAlternativeProposalInputSchema().parse(action.input);
      ProposalsReducer.editAlternativeProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_ALTERNATIVE_PROPOSAL":
      z.RemoveAlternativeProposalInputSchema().parse(action.input);
      ProposalsReducer.removeAlternativeProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<WorkstreamPHState>(stateReducer);
