import type { RequestForProposalsProposalsOperations } from "@powerhousedao/network-admin/document-models/request-for-proposals/v1";

export const requestForProposalsProposalsOperations: RequestForProposalsProposalsOperations =
  {
    addProposalOperation(state, action) {
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
    changeProposalStatusOperation(state, action) {
      state.proposals = state.proposals.map((proposal) => {
        if (proposal.id === action.input.proposalId) {
          return { ...proposal, proposalStatus: action.input.status };
        }
        return proposal;
      });
    },
    removeProposalOperation(state, action) {
      state.proposals = state.proposals.filter(
        (proposal) => proposal.id !== action.input.id,
      );
    },
  };
