/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { WorkstreamProposalsOperations } from "../../gen/proposals/operations.js";

export const reducer: WorkstreamProposalsOperations = {
  editInitialProposalOperation(state, action, dispatch) {
    const input = action.input;
    
    // Create initial proposal if it doesn't exist
    if (!state.initialProposal) {
      state.initialProposal = {
        id: input.id,
        sow: "", // Will be updated if provided
        paymentTerms: "", // Will be updated if provided
        status: "DRAFT",
        author: {
          id: "", // Will be updated if provided
          name: null,
          icon: null,
        },
      };
    }
    
    // Update proposal ID
    state.initialProposal.id = input.id;
    
    // Update optional fields if provided
    if (input.sowId !== undefined) {
      state.initialProposal.sow = input.sowId || "";
    }
    if (input.paymentTermsId !== undefined) {
      state.initialProposal.paymentTerms = input.paymentTermsId || "";
    }
    if (input.status !== undefined) {
      state.initialProposal.status = input.status || "DRAFT";
    }
    if (input.proposalAuthor !== undefined) {
      if (input.proposalAuthor) {
        state.initialProposal.author = {
          id: input.proposalAuthor.id,
          name: input.proposalAuthor.name || null,
          icon: input.proposalAuthor.icon || null,
        };
      }
    }
  },

  addAlternativeProposalOperation(state, action, dispatch) {
    const input = action.input;
    
    // Check if proposal with this ID already exists
    const existingIndex = state.alternativeProposals.findIndex(
      (proposal) => proposal.id === input.id
    );
    
    if (existingIndex === -1) {
      // Create new alternative proposal
      const newProposal = {
        id: input.id,
        sow: input.sowId || "",
        paymentTerms: input.paymentTermsId || "",
        status: input.status || "DRAFT",
        author: input.proposalAuthor
          ? {
              id: input.proposalAuthor.id,
              name: input.proposalAuthor.name || null,
              icon: input.proposalAuthor.icon || null,
            }
          : {
              id: "",
              name: null,
              icon: null,
            },
      };
      
      state.alternativeProposals.push(newProposal);
    }
  },

  editAlternativeProposalOperation(state, action, dispatch) {
    const input = action.input;
    
    // Find the proposal to edit
    const proposalIndex = state.alternativeProposals.findIndex(
      (proposal) => proposal.id === input.id
    );
    
    if (proposalIndex > -1) {
      const proposal = state.alternativeProposals[proposalIndex];
      
      // Update optional fields if provided
      if (input.sowId !== undefined) {
        proposal.sow = input.sowId || "";
      }
      if (input.paymentTermsId !== undefined) {
        proposal.paymentTerms = input.paymentTermsId || "";
      }
      if (input.status !== undefined) {
        proposal.status = input.status || "DRAFT";
      }
      if (input.proposalAuthor !== undefined) {
        if (input.proposalAuthor) {
          proposal.author = {
            id: input.proposalAuthor.id,
            name: input.proposalAuthor.name || null,
            icon: input.proposalAuthor.icon || null,
          };
        }
      }
    }
  },

  removeAlternativeProposalOperation(state, action, dispatch) {
    const input = action.input;
    
    // Find and remove the proposal
    const proposalIndex = state.alternativeProposals.findIndex(
      (proposal) => proposal.id === input.id
    );
    
    if (proposalIndex > -1) {
      state.alternativeProposals.splice(proposalIndex, 1);
    }
  },
};
