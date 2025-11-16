/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { RequestForProposalsProposalsOperations } from "../../gen/proposals/operations.js";

export const reducer: RequestForProposalsProposalsOperations = {
  addProposalOperation(state, action, dispatch) {
    // TODO: Implement "addProposalOperation" reducer
    if (action.input.title === undefined || action.input.title === null) {
      throw new Error('Proposal title is required');
    }
    if (action.input.summary === undefined || action.input.summary === null) {
      throw new Error('Proposal summary is required');
    }
    if (action.input.budgetEstimate === undefined || action.input.budgetEstimate === null) {
      throw new Error('Proposal budget estimate is required');
    }
    if (action.input.paymentTerms === undefined || action.input.paymentTerms === null) {
      throw new Error('Proposal payment terms are required');
    }
    if (action.input.proposalStatus === undefined || action.input.proposalStatus === null) {
      throw new Error('Proposal status is required');
    }
    state.proposals.push({
      title: action.input.title,
      summary: action.input.summary,
      budgetEstimate: action.input.budgetEstimate,
      paymentTerms: action.input.paymentTerms,
      proposalStatus: action.input.proposalStatus,
      submittedby: action.input.submittedby || null,
      id: action.input.id,
    });
  },
  changeProposalStatusOperation(state, action, dispatch) {
    // TODO: Implement "changeProposalStatusOperation" reducer
    if (action.input.proposalId === undefined || action.input.proposalId === null) {
      throw new Error('Proposal ID is required');
    }
    if (action.input.status === undefined || action.input.status === null) {
      throw new Error('Proposal status is required');
    }
    state.proposals = state.proposals.map((proposal) => {
      if (proposal.id === action.input.proposalId) {
        return { ...proposal, proposalStatus: action.input.status };
      }
      return proposal;
    });
  },
  removeProposalOperation(state, action, dispatch) {
    // TODO: Implement "removeProposalOperation" reducer
    if (action.input.id === undefined || action.input.id === null) {
      throw new Error('Proposal ID is required');
    }
    state.proposals = state.proposals.filter((proposal) => proposal.id !== action.input.id);
  },
};
