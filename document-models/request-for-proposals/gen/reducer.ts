// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { RequestForProposalsPHState } from "./ph-factories.js";
import { z } from "./types.js";

import { reducer as RfpStateReducer } from "../src/reducers/rfp-state.js";
import { reducer as ContexDocumentReducer } from "../src/reducers/contex-document.js";
import { reducer as ProposalsReducer } from "../src/reducers/proposals.js";

export const stateReducer: StateReducer<RequestForProposalsPHState> = (
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
      RfpStateReducer.editRfpOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_CONTEXT_DOCUMENT":
      z.AddContextDocumentInputSchema().parse(action.input);
      ContexDocumentReducer.addContextDocumentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_CONTEXT_DOCUMENT":
      z.RemoveContextDocumentInputSchema().parse(action.input);
      ContexDocumentReducer.removeContextDocumentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_PROPOSAL":
      z.AddProposalInputSchema().parse(action.input);
      ProposalsReducer.addProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "CHANGE_PROPOSAL_STATUS":
      z.ChangeProposalStatusInputSchema().parse(action.input);
      ProposalsReducer.changeProposalStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_PROPOSAL":
      z.RemoveProposalInputSchema().parse(action.input);
      ProposalsReducer.removeProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<RequestForProposalsPHState>(stateReducer);
