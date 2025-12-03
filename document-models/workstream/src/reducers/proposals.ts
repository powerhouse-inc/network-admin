import type { WorkstreamProposalsOperations } from "@powerhousedao/network-admin/document-models/workstream";

export const workstreamProposalsOperations: WorkstreamProposalsOperations = {
  editInitialProposalOperation(state, action) {
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
      if( state.initialProposal.status === "ACCEPTED") {
        state.sow = input.sowId || null; // Normalize empty string to null
      }
    }
    if (input.paymentTermsId !== undefined) {
      state.initialProposal.paymentTerms = input.paymentTermsId || "";
      if( state.initialProposal.status === "ACCEPTED") {
        state.paymentTerms = input.paymentTermsId || null; // Normalize empty string to null
      }
    }
    if (input.status !== undefined) {
      state.initialProposal.status = input.status || "DRAFT";
      // If the initial proposal is accepted, reject all accepted alternative proposals. 
      if (input.status === "ACCEPTED") {
        if (state.alternativeProposals.length > 0) {
          state.alternativeProposals.forEach(proposal => {
            if (proposal.status === "ACCEPTED") {
              proposal.status = "REJECTED"
            }
          });
        }
        // set payment terms to main state if it exists
        const initialProposalPaymentTerms = state.initialProposal.paymentTerms;
        const intialProposalSow = state.initialProposal.sow;
        state.paymentTerms = initialProposalPaymentTerms || null; // Normalize empty string to null
        state.sow = intialProposalSow || null; // Normalize empty string to null
      } else {
        // set payments terms and sow to null
        state.paymentTerms = null;
        state.sow = null;
      }
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

  addAlternativeProposalOperation(state, action) {
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

  editAlternativeProposalOperation(state, action) {
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
        if( proposal.status === "ACCEPTED") {
          state.sow = proposal.sow || null; // Normalize empty string to null
        }
      }
      if (input.paymentTermsId !== undefined) {
        proposal.paymentTerms = input.paymentTermsId || "";
        if( proposal.status === "ACCEPTED") {
          state.paymentTerms = proposal.paymentTerms || null; // Normalize empty string to null
        }
      }
      if (input.status !== undefined) {
        proposal.status = input.status || "DRAFT";
        // If the alternative proposal is accepted, reject the initial proposal. 
        // There can only be one accepted proposal at a time.
        if (input.status === "ACCEPTED") {
          if (state.initialProposal && state.initialProposal.status === "ACCEPTED") {
            state.initialProposal.status = "REJECTED"
          }
          // If the alternative proposal is accepted, reject all other accepted alternative proposals except this one.
          if (state.alternativeProposals.length > 0) {
            state.alternativeProposals.forEach(proposal => {
              if (proposal.status === "ACCEPTED" && proposal.id !== input.id) {
                proposal.status = "REJECTED"
              }
            });
          }
          // set payment terms to main state if it exists
          if (proposal) {
            state.paymentTerms = proposal.paymentTerms || null; // Normalize empty string to null
            state.sow = proposal.sow || null; // Normalize empty string to null
          }
        }
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

  removeAlternativeProposalOperation(state, action) {
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
