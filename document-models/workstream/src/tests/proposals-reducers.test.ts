/**
 * Comprehensive tests for Proposals reducers
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type EditInitialProposalInput,
  type AddAlternativeProposalInput,
  type EditAlternativeProposalInput,
  type RemoveAlternativeProposalInput,
  type ProposalAuthorInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/proposals/creators.js";
import type { WorkstreamDocument, Proposal } from "../../gen/types.js";

describe("Proposals Reducers - State Changes", () => {
  let document: WorkstreamDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("editInitialProposal", () => {
    it("should create initial proposal when it doesn't exist", () => {
      const author: ProposalAuthorInput = {
        id: "author-123",
        name: "John Doe",
        icon: "https://example.com/avatar.jpg",
      };

      const input: EditInitialProposalInput = {
        id: "proposal-123",
        sowId: "sow-456",
        paymentTermsId: "terms-789",
        status: "SUBMITTED",
        proposalAuthor: author,
      };

      const updatedDocument = reducer(
        document,
        creators.editInitialProposal(input)
      );

      const proposal = updatedDocument.state.global.initialProposal;
      expect(proposal).toBeDefined();
      expect(proposal!.id).toBe("proposal-123");
      expect(proposal!.sow).toBe("sow-456");
      expect(proposal!.paymentTerms).toBe("terms-789");
      expect(proposal!.status).toBe("SUBMITTED");
      expect(proposal!.author.id).toBe("author-123");
      expect(proposal!.author.name).toBe("John Doe");
      expect(proposal!.author.icon).toBe("https://example.com/avatar.jpg");
    });

    it("should update existing initial proposal", () => {
      // First create initial proposal
      const firstUpdate = reducer(
        document,
        creators.editInitialProposal({
          id: "proposal-123",
          status: "DRAFT",
        })
      );

      // Then update it
      const input: EditInitialProposalInput = {
        id: "proposal-456",
        sowId: "sow-789",
        status: "SUBMITTED",
        proposalAuthor: {
          id: "author-999",
          name: "Jane Smith",
        },
      };

      const finalDocument = reducer(
        firstUpdate,
        creators.editInitialProposal(input)
      );

      const proposal = finalDocument.state.global.initialProposal;
      expect(proposal!.id).toBe("proposal-456");
      expect(proposal!.sow).toBe("sow-789");
      expect(proposal!.status).toBe("SUBMITTED");
      expect(proposal!.author.id).toBe("author-999");
      expect(proposal!.author.name).toBe("Jane Smith");
    });

    it("should handle optional fields correctly", () => {
      const input: EditInitialProposalInput = {
        id: "proposal-123",
        sowId: undefined,
        paymentTermsId: null,
        status: undefined,
        proposalAuthor: undefined,
      };

      const updatedDocument = reducer(
        document,
        creators.editInitialProposal(input)
      );

      const proposal = updatedDocument.state.global.initialProposal;
      expect(proposal!.id).toBe("proposal-123");
      expect(proposal!.sow).toBe(""); // Empty when undefined
      expect(proposal!.paymentTerms).toBe(""); // Empty when null
      expect(proposal!.status).toBe("DRAFT"); // Default when undefined
    });

    it("should handle empty string values", () => {
      const input: EditInitialProposalInput = {
        id: "proposal-123",
        sowId: "",
        paymentTermsId: "",
      };

      const updatedDocument = reducer(
        document,
        creators.editInitialProposal(input)
      );

      const proposal = updatedDocument.state.global.initialProposal;
      expect(proposal!.sow).toBe("");
      expect(proposal!.paymentTerms).toBe("");
    });

    it("should handle author with null/undefined optional fields", () => {
      const input: EditInitialProposalInput = {
        id: "proposal-123",
        proposalAuthor: {
          id: "author-123",
          name: null,
          icon: undefined,
        },
      };

      const updatedDocument = reducer(
        document,
        creators.editInitialProposal(input)
      );

      const proposal = updatedDocument.state.global.initialProposal;
      expect(proposal!.author.id).toBe("author-123");
      expect(proposal!.author.name).toBe(null);
      expect(proposal!.author.icon).toBe(null);
    });
  });

  describe("addAlternativeProposal", () => {
    it("should add new alternative proposal", () => {
      const author: ProposalAuthorInput = {
        id: "author-123",
        name: "Alternative Author",
        icon: "https://example.com/alt-avatar.jpg",
      };

      const input: AddAlternativeProposalInput = {
        id: "alt-proposal-123",
        sowId: "sow-456",
        paymentTermsId: "terms-789",
        status: "DRAFT",
        proposalAuthor: author,
      };

      const updatedDocument = reducer(
        document,
        creators.addAlternativeProposal(input)
      );

      expect(updatedDocument.state.global.alternativeProposals).toHaveLength(1);
      
      const proposal = updatedDocument.state.global.alternativeProposals[0];
      expect(proposal.id).toBe("alt-proposal-123");
      expect(proposal.sow).toBe("sow-456");
      expect(proposal.paymentTerms).toBe("terms-789");
      expect(proposal.status).toBe("DRAFT");
      expect(proposal.author.id).toBe("author-123");
      expect(proposal.author.name).toBe("Alternative Author");
      expect(proposal.author.icon).toBe("https://example.com/alt-avatar.jpg");
    });

    it("should add multiple alternative proposals", () => {
      let currentDocument = document;

      // Add first proposal
      currentDocument = reducer(
        currentDocument,
        creators.addAlternativeProposal({
          id: "alt-proposal-1",
          status: "DRAFT",
        })
      );

      // Add second proposal
      currentDocument = reducer(
        currentDocument,
        creators.addAlternativeProposal({
          id: "alt-proposal-2",
          status: "SUBMITTED",
        })
      );

      expect(currentDocument.state.global.alternativeProposals).toHaveLength(2);
      expect(currentDocument.state.global.alternativeProposals[0].id).toBe("alt-proposal-1");
      expect(currentDocument.state.global.alternativeProposals[1].id).toBe("alt-proposal-2");
    });

    it("should not add proposal if ID already exists", () => {
      let currentDocument = document;

      // Add proposal
      currentDocument = reducer(
        currentDocument,
        creators.addAlternativeProposal({
          id: "alt-proposal-1",
          status: "DRAFT",
        })
      );

      // Try to add proposal with same ID
      currentDocument = reducer(
        currentDocument,
        creators.addAlternativeProposal({
          id: "alt-proposal-1",
          status: "SUBMITTED",
        })
      );

      expect(currentDocument.state.global.alternativeProposals).toHaveLength(1);
      expect(currentDocument.state.global.alternativeProposals[0].status).toBe("DRAFT"); // Unchanged
    });

    it("should handle optional fields with defaults", () => {
      const input: AddAlternativeProposalInput = {
        id: "alt-proposal-123",
        sowId: undefined,
        paymentTermsId: null,
        status: undefined,
        proposalAuthor: undefined,
      };

      const updatedDocument = reducer(
        document,
        creators.addAlternativeProposal(input)
      );

      const proposal = updatedDocument.state.global.alternativeProposals[0];
      expect(proposal.sow).toBe("");
      expect(proposal.paymentTerms).toBe("");
      expect(proposal.status).toBe("DRAFT");
      expect(proposal.author.id).toBe("");
      expect(proposal.author.name).toBe(null);
      expect(proposal.author.icon).toBe(null);
    });
  });

  describe("editAlternativeProposal", () => {
    beforeEach(() => {
      // Add a proposal to edit
      document = reducer(
        document,
        creators.addAlternativeProposal({
          id: "alt-proposal-123",
          sowId: "initial-sow",
          status: "DRAFT",
          proposalAuthor: {
            id: "initial-author",
            name: "Initial Author",
          },
        })
      );
    });

    it("should edit existing alternative proposal", () => {
      const input: EditAlternativeProposalInput = {
        id: "alt-proposal-123",
        sowId: "updated-sow",
        paymentTermsId: "updated-terms",
        status: "SUBMITTED",
        proposalAuthor: {
          id: "updated-author",
          name: "Updated Author",
          icon: "https://example.com/updated-avatar.jpg",
        },
      };

      const updatedDocument = reducer(
        document,
        creators.editAlternativeProposal(input)
      );

      const proposal = updatedDocument.state.global.alternativeProposals[0];
      expect(proposal.sow).toBe("updated-sow");
      expect(proposal.paymentTerms).toBe("updated-terms");
      expect(proposal.status).toBe("SUBMITTED");
      expect(proposal.author.id).toBe("updated-author");
      expect(proposal.author.name).toBe("Updated Author");
      expect(proposal.author.icon).toBe("https://example.com/updated-avatar.jpg");
    });

    it("should update only provided fields", () => {
      const input: EditAlternativeProposalInput = {
        id: "alt-proposal-123",
        status: "ACCEPTED",
      };

      const updatedDocument = reducer(
        document,
        creators.editAlternativeProposal(input)
      );

      const proposal = updatedDocument.state.global.alternativeProposals[0];
      expect(proposal.sow).toBe("initial-sow"); // Unchanged
      expect(proposal.status).toBe("ACCEPTED"); // Changed
      expect(proposal.author.name).toBe("Initial Author"); // Unchanged
    });

    it("should handle non-existent proposal ID gracefully", () => {
      const input: EditAlternativeProposalInput = {
        id: "non-existent-proposal",
        status: "SUBMITTED",
      };

      const updatedDocument = reducer(
        document,
        creators.editAlternativeProposal(input)
      );

      // Original proposal should remain unchanged
      const proposal = updatedDocument.state.global.alternativeProposals[0];
      expect(proposal.id).toBe("alt-proposal-123");
      expect(proposal.status).toBe("DRAFT"); // Unchanged
    });

    it("should handle optional field updates", () => {
      const input: EditAlternativeProposalInput = {
        id: "alt-proposal-123",
        sowId: "",
        paymentTermsId: null,
        status: undefined,
        proposalAuthor: undefined,
      };

      const updatedDocument = reducer(
        document,
        creators.editAlternativeProposal(input)
      );

      const proposal = updatedDocument.state.global.alternativeProposals[0];
      expect(proposal.sow).toBe("");
      expect(proposal.paymentTerms).toBe("");
      expect(proposal.status).toBe("DRAFT"); // Default when undefined
    });
  });

  describe("removeAlternativeProposal", () => {
    beforeEach(() => {
      // Add multiple proposals to test removal
      document = reducer(
        document,
        creators.addAlternativeProposal({
          id: "alt-proposal-1",
          status: "DRAFT",
        })
      );
      document = reducer(
        document,
        creators.addAlternativeProposal({
          id: "alt-proposal-2",
          status: "SUBMITTED",
        })
      );
      document = reducer(
        document,
        creators.addAlternativeProposal({
          id: "alt-proposal-3",
          status: "ACCEPTED",
        })
      );
    });

    it("should remove existing alternative proposal", () => {
      const input: RemoveAlternativeProposalInput = {
        id: "alt-proposal-2",
      };

      const updatedDocument = reducer(
        document,
        creators.removeAlternativeProposal(input)
      );

      expect(updatedDocument.state.global.alternativeProposals).toHaveLength(2);
      
      const remainingIds = updatedDocument.state.global.alternativeProposals.map(p => p.id);
      expect(remainingIds).toContain("alt-proposal-1");
      expect(remainingIds).toContain("alt-proposal-3");
      expect(remainingIds).not.toContain("alt-proposal-2");
    });

    it("should handle removal of non-existent proposal gracefully", () => {
      const input: RemoveAlternativeProposalInput = {
        id: "non-existent-proposal",
      };

      const updatedDocument = reducer(
        document,
        creators.removeAlternativeProposal(input)
      );

      // All original proposals should remain
      expect(updatedDocument.state.global.alternativeProposals).toHaveLength(3);
      
      const remainingIds = updatedDocument.state.global.alternativeProposals.map(p => p.id);
      expect(remainingIds).toContain("alt-proposal-1");
      expect(remainingIds).toContain("alt-proposal-2");
      expect(remainingIds).toContain("alt-proposal-3");
    });

    it("should handle removal from empty array gracefully", () => {
      // Start with empty document
      const emptyDocument = utils.createDocument();
      
      const input: RemoveAlternativeProposalInput = {
        id: "any-proposal",
      };

      const updatedDocument = reducer(
        emptyDocument,
        creators.removeAlternativeProposal(input)
      );

      expect(updatedDocument.state.global.alternativeProposals).toHaveLength(0);
    });

    it("should remove first proposal correctly", () => {
      const input: RemoveAlternativeProposalInput = {
        id: "alt-proposal-1",
      };

      const updatedDocument = reducer(
        document,
        creators.removeAlternativeProposal(input)
      );

      expect(updatedDocument.state.global.alternativeProposals).toHaveLength(2);
      expect(updatedDocument.state.global.alternativeProposals[0].id).toBe("alt-proposal-2");
      expect(updatedDocument.state.global.alternativeProposals[1].id).toBe("alt-proposal-3");
    });

    it("should remove last proposal correctly", () => {
      const input: RemoveAlternativeProposalInput = {
        id: "alt-proposal-3",
      };

      const updatedDocument = reducer(
        document,
        creators.removeAlternativeProposal(input)
      );

      expect(updatedDocument.state.global.alternativeProposals).toHaveLength(2);
      expect(updatedDocument.state.global.alternativeProposals[0].id).toBe("alt-proposal-1");
      expect(updatedDocument.state.global.alternativeProposals[1].id).toBe("alt-proposal-2");
    });
  });
});