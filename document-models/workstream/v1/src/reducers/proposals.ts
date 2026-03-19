import type { WorkstreamProposalsOperations } from "@powerhousedao/network-admin/document-models/workstream/v1";

export const workstreamProposalsOperations: WorkstreamProposalsOperations = {
  editInitialProposalOperation(state, action) {
    const input = action.input;

    // Create initial proposal if it doesn't exist
    if (!state.initialProposal) {
      state.initialProposal = {
        id: input.id,
        sow: "",
        paymentTerms: "",
        status: "DRAFT",
        author: {
          id: "",
          name: null,
          icon: null,
        },
      };
    }

    state.initialProposal.id = input.id;

    if (input.sowId !== undefined) {
      state.initialProposal.sow = input.sowId || "";
      if (state.initialProposal.status === "ACCEPTED") {
        state.sow = input.sowId || null;
      }
    }
    if (input.paymentTermsId !== undefined) {
      state.initialProposal.paymentTerms = input.paymentTermsId || "";
      if (state.initialProposal.status === "ACCEPTED") {
        state.paymentTerms = input.paymentTermsId || null;
      }
    }
    if (input.status !== undefined) {
      state.initialProposal.status = input.status || "DRAFT";
      // If the initial proposal is accepted, reject all accepted alternative proposals.
      if (input.status === "ACCEPTED") {
        if (state.alternativeProposals.length > 0) {
          state.alternativeProposals.forEach((proposal) => {
            if (proposal.status === "ACCEPTED") {
              proposal.status = "REJECTED";
            }
          });
        }
        // set payment terms to main state if it exists
        const initialProposalPaymentTerms = state.initialProposal.paymentTerms;
        const intialProposalSow = state.initialProposal.sow;
        state.paymentTerms = initialProposalPaymentTerms || null;
        state.sow = intialProposalSow || null;
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

    const existingIndex = state.alternativeProposals.findIndex(
      (proposal) => proposal.id === input.id,
    );

    if (existingIndex === -1) {
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

    const proposalIndex = state.alternativeProposals.findIndex(
      (proposal) => proposal.id === input.id,
    );

    if (proposalIndex > -1) {
      const proposal = state.alternativeProposals[proposalIndex];

      if (input.sowId !== undefined) {
        proposal.sow = input.sowId || "";
        if (proposal.status === "ACCEPTED") {
          state.sow = proposal.sow || null;
        }
      }
      if (input.paymentTermsId !== undefined) {
        proposal.paymentTerms = input.paymentTermsId || "";
        if (proposal.status === "ACCEPTED") {
          state.paymentTerms = proposal.paymentTerms || null;
        }
      }
      if (input.status !== undefined) {
        const wasAccepted = proposal.status === "ACCEPTED";
        proposal.status = input.status || "DRAFT";
        // If the alternative proposal is accepted, reject the initial proposal.
        // There can only be one accepted proposal at a time.
        if (input.status === "ACCEPTED") {
          if (
            state.initialProposal &&
            state.initialProposal.status === "ACCEPTED"
          ) {
            state.initialProposal.status = "REJECTED";
          }
          // If the alternative proposal is accepted, reject all other accepted alternative proposals except this one.
          if (state.alternativeProposals.length > 0) {
            state.alternativeProposals.forEach((p) => {
              if (p.status === "ACCEPTED" && p.id !== input.id) {
                p.status = "REJECTED";
              }
            });
          }
          // set payment terms to main state if it exists
          if (proposal) {
            state.paymentTerms = proposal.paymentTerms || null;
            state.sow = proposal.sow || null;
          }
        } else if (wasAccepted) {
          // If this proposal was previously ACCEPTED and is now being changed to another status,
          // clear the top-level state unless there's another accepted proposal
          const hasAcceptedInitialProposal =
            state.initialProposal?.status === "ACCEPTED";
          const hasAcceptedAlternativeProposal =
            state.alternativeProposals.some(
              (p) => p.status === "ACCEPTED" && p.id !== input.id,
            );

          // Only clear if no other proposal is accepted
          if (!hasAcceptedInitialProposal && !hasAcceptedAlternativeProposal) {
            state.paymentTerms = null;
            state.sow = null;
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

    const proposalIndex = state.alternativeProposals.findIndex(
      (proposal) => proposal.id === input.id,
    );

    if (proposalIndex > -1) {
      const proposalToRemove = state.alternativeProposals[proposalIndex];
      const wasAccepted = proposalToRemove.status === "ACCEPTED";

      state.alternativeProposals.splice(proposalIndex, 1);

      // If the deleted proposal was ACCEPTED, clear top-level state unless there's another accepted proposal
      if (wasAccepted) {
        const hasAcceptedInitialProposal =
          state.initialProposal?.status === "ACCEPTED";
        const hasAcceptedAlternativeProposal = state.alternativeProposals.some(
          (p) => p.status === "ACCEPTED",
        );

        // Only clear if no other proposal is accepted
        if (!hasAcceptedInitialProposal && !hasAcceptedAlternativeProposal) {
          state.paymentTerms = null;
          state.sow = null;
        }
      }
    }
  },
};
