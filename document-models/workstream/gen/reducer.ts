import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { type WorkstreamDocument, z } from "./types.js";

import { reducer as WorkstreamReducer } from "../src/reducers/workstream.js";
import { reducer as ProposalsReducer } from "../src/reducers/proposals.js";

const stateReducer: StateReducer<WorkstreamDocument> = (
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
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_CLIENT_INFO":
      z.EditClientInfoInputSchema().parse(action.input);
      WorkstreamReducer.editClientInfoOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "SET_REQUEST_FOR_PROPOSAL":
      z.SetRequestForProposalInputSchema().parse(action.input);
      WorkstreamReducer.setRequestForProposalOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "ADD_PAYMENT_REQUEST":
      z.AddPaymentRequestInputSchema().parse(action.input);
      WorkstreamReducer.addPaymentRequestOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "REMOVE_PAYMENT_REQUEST":
      z.RemovePaymentRequestInputSchema().parse(action.input);
      WorkstreamReducer.removePaymentRequestOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_INITIAL_PROPOSAL":
      z.EditInitialProposalInputSchema().parse(action.input);
      ProposalsReducer.editInitialProposalOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "ADD_ALTERNATIVE_PROPOSAL":
      z.AddAlternativeProposalInputSchema().parse(action.input);
      ProposalsReducer.addAlternativeProposalOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "EDIT_ALTERNATIVE_PROPOSAL":
      z.EditAlternativeProposalInputSchema().parse(action.input);
      ProposalsReducer.editAlternativeProposalOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "REMOVE_ALTERNATIVE_PROPOSAL":
      z.RemoveAlternativeProposalInputSchema().parse(action.input);
      ProposalsReducer.removeAlternativeProposalOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<WorkstreamDocument>(stateReducer);
