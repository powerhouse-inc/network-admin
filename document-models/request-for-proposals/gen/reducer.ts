import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { type RequestForProposalsDocument, z } from "./types.js";

import { reducer as RfpStateReducer } from "../src/reducers/rfp-state.js";
import { reducer as ContexDocumentReducer } from "../src/reducers/contex-document.js";
import { reducer as ProposalsReducer } from "../src/reducers/proposals.js";

const stateReducer: StateReducer<RequestForProposalsDocument> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "EDIT_RFP":
      z.EditRfpInputSchema().parse(action.input);
      RfpStateReducer.editRfpOperation(state[action.scope], action, dispatch);
      break;

    case "ADD_CONTEXT_DOCUMENT":
      z.AddContextDocumentInputSchema().parse(action.input);
      ContexDocumentReducer.addContextDocumentOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "REMOVE_CONTEXT_DOCUMENT":
      z.RemoveContextDocumentInputSchema().parse(action.input);
      ContexDocumentReducer.removeContextDocumentOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "ADD_PROPOSAL":
      z.AddProposalInputSchema().parse(action.input);
      ProposalsReducer.addProposalOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "CHANGE_PROPOSAL_STATUS":
      z.ChangeProposalStatusInputSchema().parse(action.input);
      ProposalsReducer.changeProposalStatusOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "REMOVE_PROPOSAL":
      z.RemoveProposalInputSchema().parse(action.input);
      ProposalsReducer.removeProposalOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<RequestForProposalsDocument>(stateReducer);
