// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { RequestForProposalsPHState } from "@powerhousedao/network-admin/document-models/request-for-proposals";

import { requestForProposalsRfpStateOperations } from "../src/reducers/rfp-state.js";
import { requestForProposalsContexDocumentOperations } from "../src/reducers/contex-document.js";
import { requestForProposalsProposalsOperations } from "../src/reducers/proposals.js";

import {
  EditRfpInputSchema,
  AddContextDocumentInputSchema,
  RemoveContextDocumentInputSchema,
  AddProposalInputSchema,
  ChangeProposalStatusInputSchema,
  RemoveProposalInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<RequestForProposalsPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "EDIT_RFP":
      EditRfpInputSchema().parse(action.input);
      requestForProposalsRfpStateOperations.editRfpOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_CONTEXT_DOCUMENT":
      AddContextDocumentInputSchema().parse(action.input);
      requestForProposalsContexDocumentOperations.addContextDocumentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_CONTEXT_DOCUMENT":
      RemoveContextDocumentInputSchema().parse(action.input);
      requestForProposalsContexDocumentOperations.removeContextDocumentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_PROPOSAL":
      AddProposalInputSchema().parse(action.input);
      requestForProposalsProposalsOperations.addProposalOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "CHANGE_PROPOSAL_STATUS":
      ChangeProposalStatusInputSchema().parse(action.input);
      requestForProposalsProposalsOperations.changeProposalStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_PROPOSAL":
      RemoveProposalInputSchema().parse(action.input);
      requestForProposalsProposalsOperations.removeProposalOperation(
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
