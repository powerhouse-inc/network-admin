/**
 * Comprehensive tests for Proposals reducers
 */

import { describe, it, expect, beforeEach } from "vitest";
import utils from "../../gen/utils.js";
import {
  z,
  type AddProposalInput,
  type ChangeProposalStatusInput,
  type RemoveProposalInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/proposals/creators.js";
import type { RequestForProposalsDocument } from "../../gen/types.js";

describe("Proposals Reducers - State Changes", () => {
  let document: RequestForProposalsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("addProposal", () => {
    it("should add new proposal with all required fields", () => {
      const input: AddProposalInput = {
        rfpId: "rfp-123",
        id: "proposal-456",
        title: "Technical Solution Proposal",
        summary: "Comprehensive technical solution for the RFP requirements",
        proposalStatus: "SUBMITTED",
        budgetEstimate: "$50,000",
        paymentTerms: "MILESTONE_BASED_FIXED_PRICE",
        submittedby: "vendor-789",
      };

      const updatedDocument = reducer(
        document,
        creators.addProposal(input)
      );

      expect(updatedDocument.state.global.proposals).toHaveLength(1);
      
      const proposal = updatedDocument.state.global.proposals[0];
      expect(proposal.id).toBe("proposal-456");
      expect(proposal.title).toBe("Technical Solution Proposal");
      expect(proposal.summary).toBe("Comprehensive technical solution for the RFP requirements");
      expect(proposal.proposalStatus).toBe("SUBMITTED");
      expect(proposal.budgetEstimate).toBe("$50,000");
      expect(proposal.paymentTerms).toBe("MILESTONE_BASED_FIXED_PRICE");
      expect(proposal.submittedby).toBe("vendor-789");
    });

    it("should add proposal with optional submittedby field as null", () => {
      const input: AddProposalInput = {
        rfpId: "rfp-123",
        id: "proposal-456",
        title: "Anonymous Proposal",
        summary: "Proposal without submitter information",
        proposalStatus: "SUBMITTED",
        budgetEstimate: "$25,000",
        paymentTerms: "RETAINER_BASED",
        submittedby: null,
      };

      const updatedDocument = reducer(
        document,
        creators.addProposal(input)
      );

      const proposal = updatedDocument.state.global.proposals[0];
      expect(proposal.submittedby).toBe(null);
    });

    it("should add multiple proposals", () => {
      let currentDocument = document;

      // Add first proposal
      currentDocument = reducer(
        currentDocument,
        creators.addProposal({
          rfpId: "rfp-123",
          id: "proposal-1",
          title: "First Proposal",
          summary: "First vendor's solution",
          proposalStatus: "SUBMITTED",
          budgetEstimate: "$40,000",
          paymentTerms: "MILESTONE_BASED_FIXED_PRICE",
        })
      );

      // Add second proposal
      currentDocument = reducer(
        currentDocument,
        creators.addProposal({
          rfpId: "rfp-123",
          id: "proposal-2",
          title: "Second Proposal",
          summary: "Second vendor's solution",
          proposalStatus: "UNDER_REVIEW",
          budgetEstimate: "$45,000",
          paymentTerms: "ESCROW",
        })
      );

      expect(currentDocument.state.global.proposals).toHaveLength(2);
      expect(currentDocument.state.global.proposals[0].title).toBe("First Proposal");
      expect(currentDocument.state.global.proposals[1].title).toBe("Second Proposal");
    });

    it("should handle different payment terms", () => {
      const paymentTerms = [
        "MILESTONE_BASED_FIXED_PRICE",
        "MILESTONE_BASED_ADVANCE_PAYMENT",
        "RETAINER_BASED",
        "VARIABLE_COST",
        "ESCROW",
      ];

      let currentDocument = document;

      paymentTerms.forEach((term, index) => {
        currentDocument = reducer(
          currentDocument,
          creators.addProposal({
            rfpId: "rfp-123",
            id: `proposal-${index}`,
            title: `Proposal ${index + 1}`,
            summary: `Proposal with ${term}`,
            proposalStatus: "SUBMITTED",
            budgetEstimate: `$${(index + 1) * 10000}`,
            paymentTerms: term as any,
          })
        );
      });

      expect(currentDocument.state.global.proposals).toHaveLength(5);
      currentDocument.state.global.proposals.forEach((proposal, index) => {
        expect(proposal.paymentTerms).toBe(paymentTerms[index]);
      });
    });

    it("should handle different proposal statuses", () => {
      const statuses = [
        "SUBMITTED",
        "OPENED",
        "UNDER_REVIEW",
        "NEEDS_REVISION",
        "REVISED",
        "APPROVED",
        "CONDITIONALLY_APPROVED",
        "REJECTED",
        "WITHDRAWN",
      ];

      let currentDocument = document;

      statuses.forEach((status, index) => {
        currentDocument = reducer(
          currentDocument,
          creators.addProposal({
            rfpId: "rfp-123",
            id: `proposal-${index}`,
            title: `Proposal ${index + 1}`,
            summary: `Proposal with status ${status}`,
            proposalStatus: status as any,
            budgetEstimate: `$${(index + 1) * 10000}`,
            paymentTerms: "MILESTONE_BASED_FIXED_PRICE",
          })
        );
      });

      expect(currentDocument.state.global.proposals).toHaveLength(9);
      currentDocument.state.global.proposals.forEach((proposal, index) => {
        expect(proposal.proposalStatus).toBe(statuses[index]);
      });
    });

    it("should handle special characters in title and summary", () => {
      const input: AddProposalInput = {
        rfpId: "rfp-123",
        id: "proposal-456",
        title: "Proposal with special chars: & < > \" '",
        summary: "Summary with emojis: 🚀 💡 📊 and symbols: © ® ™",
        proposalStatus: "SUBMITTED",
        budgetEstimate: "$50,000",
        paymentTerms: "MILESTONE_BASED_FIXED_PRICE",
      };

      const updatedDocument = reducer(
        document,
        creators.addProposal(input)
      );

      const proposal = updatedDocument.state.global.proposals[0];
      expect(proposal.title).toBe("Proposal with special chars: & < > \" '");
      expect(proposal.summary).toBe("Summary with emojis: 🚀 💡 📊 and symbols: © ® ™");
    });
  });

  describe("changeProposalStatus", () => {
    beforeEach(() => {
      // Add some proposals to test status changes
      document = reducer(
        document,
        creators.addProposal({
          rfpId: "rfp-123",
          id: "proposal-1",
          title: "Proposal 1",
          summary: "First proposal",
          proposalStatus: "SUBMITTED",
          budgetEstimate: "$40,000",
          paymentTerms: "MILESTONE_BASED_FIXED_PRICE",
        })
      );
      document = reducer(
        document,
        creators.addProposal({
          rfpId: "rfp-123",
          id: "proposal-2",
          title: "Proposal 2",
          summary: "Second proposal",
          proposalStatus: "UNDER_REVIEW",
          budgetEstimate: "$45,000",
          paymentTerms: "ESCROW",
        })
      );
    });

    it("should change status of existing proposal", () => {
      const input: ChangeProposalStatusInput = {
        proposalId: "proposal-1",
        status: "APPROVED",
      };

      const updatedDocument = reducer(
        document,
        creators.changeProposalStatus(input)
      );

      const proposal = updatedDocument.state.global.proposals.find(p => p.id === "proposal-1");
      expect(proposal!.proposalStatus).toBe("APPROVED");
      
      // Other proposal should remain unchanged
      const otherProposal = updatedDocument.state.global.proposals.find(p => p.id === "proposal-2");
      expect(otherProposal!.proposalStatus).toBe("UNDER_REVIEW");
    });

    it("should handle status change to all possible statuses", () => {
      const statuses = [
        "SUBMITTED",
        "OPENED",
        "UNDER_REVIEW",
        "NEEDS_REVISION",
        "REVISED",
        "APPROVED",
        "CONDITIONALLY_APPROVED",
        "REJECTED",
        "WITHDRAWN",
      ];

      let currentDocument = document;

      statuses.forEach((status) => {
        currentDocument = reducer(
          currentDocument,
          creators.changeProposalStatus({
            proposalId: "proposal-1",
            status: status as any,
          })
        );
      });

      const proposal = currentDocument.state.global.proposals.find(p => p.id === "proposal-1");
      expect(proposal!.proposalStatus).toBe("WITHDRAWN"); // Final status
    });

    it("should handle non-existent proposal ID gracefully", () => {
      const input: ChangeProposalStatusInput = {
        proposalId: "non-existent-proposal",
        status: "APPROVED",
      };

      const updatedDocument = reducer(
        document,
        creators.changeProposalStatus(input)
      );

      // All proposals should remain unchanged
      const proposal1 = updatedDocument.state.global.proposals.find(p => p.id === "proposal-1");
      const proposal2 = updatedDocument.state.global.proposals.find(p => p.id === "proposal-2");
      expect(proposal1!.proposalStatus).toBe("SUBMITTED");
      expect(proposal2!.proposalStatus).toBe("UNDER_REVIEW");
    });

    it("should handle status change on empty proposals array gracefully", () => {
      const emptyDocument = utils.createDocument();
      
      const input: ChangeProposalStatusInput = {
        proposalId: "any-proposal",
        status: "APPROVED",
      };

      const updatedDocument = reducer(
        emptyDocument,
        creators.changeProposalStatus(input)
      );

      expect(updatedDocument.state.global.proposals).toHaveLength(0);
    });

    it("should preserve all other proposal fields when changing status", () => {
      const input: ChangeProposalStatusInput = {
        proposalId: "proposal-1",
        status: "APPROVED",
      };

      const updatedDocument = reducer(
        document,
        creators.changeProposalStatus(input)
      );

      const proposal = updatedDocument.state.global.proposals.find(p => p.id === "proposal-1");
      expect(proposal!.title).toBe("Proposal 1");
      expect(proposal!.summary).toBe("First proposal");
      expect(proposal!.budgetEstimate).toBe("$40,000");
      expect(proposal!.paymentTerms).toBe("MILESTONE_BASED_FIXED_PRICE");
      expect(proposal!.proposalStatus).toBe("APPROVED"); // Only this should change
    });
  });

  describe("removeProposal", () => {
    beforeEach(() => {
      // Add some proposals to test removal
      document = reducer(
        document,
        creators.addProposal({
          rfpId: "rfp-123",
          id: "proposal-1",
          title: "Proposal 1",
          summary: "First proposal",
          proposalStatus: "SUBMITTED",
          budgetEstimate: "$40,000",
          paymentTerms: "MILESTONE_BASED_FIXED_PRICE",
        })
      );
      document = reducer(
        document,
        creators.addProposal({
          rfpId: "rfp-123",
          id: "proposal-2",
          title: "Proposal 2",
          summary: "Second proposal",
          proposalStatus: "UNDER_REVIEW",
          budgetEstimate: "$45,000",
          paymentTerms: "ESCROW",
        })
      );
      document = reducer(
        document,
        creators.addProposal({
          rfpId: "rfp-123",
          id: "proposal-3",
          title: "Proposal 3",
          summary: "Third proposal",
          proposalStatus: "APPROVED",
          budgetEstimate: "$50,000",
          paymentTerms: "RETAINER_BASED",
        })
      );
    });

    it("should remove existing proposal by ID", () => {
      const input: RemoveProposalInput = {
        rfpId: "rfp-123",
        id: "proposal-2",
      };

      const updatedDocument = reducer(
        document,
        creators.removeProposal(input)
      );

      expect(updatedDocument.state.global.proposals).toHaveLength(2);
      
      const remainingIds = updatedDocument.state.global.proposals.map(p => p.id);
      expect(remainingIds).toContain("proposal-1");
      expect(remainingIds).toContain("proposal-3");
      expect(remainingIds).not.toContain("proposal-2");
    });

    it("should handle removal of non-existent proposal gracefully", () => {
      const input: RemoveProposalInput = {
        rfpId: "rfp-123",
        id: "non-existent-proposal",
      };

      const updatedDocument = reducer(
        document,
        creators.removeProposal(input)
      );

      // All original proposals should remain
      expect(updatedDocument.state.global.proposals).toHaveLength(3);
      
      const remainingIds = updatedDocument.state.global.proposals.map(p => p.id);
      expect(remainingIds).toContain("proposal-1");
      expect(remainingIds).toContain("proposal-2");
      expect(remainingIds).toContain("proposal-3");
    });

    it("should handle removal from empty array gracefully", () => {
      const emptyDocument = utils.createDocument();
      
      const input: RemoveProposalInput = {
        rfpId: "rfp-123",
        id: "any-proposal",
      };

      const updatedDocument = reducer(
        emptyDocument,
        creators.removeProposal(input)
      );

      expect(updatedDocument.state.global.proposals).toHaveLength(0);
    });

    it("should remove first proposal correctly", () => {
      const input: RemoveProposalInput = {
        rfpId: "rfp-123",
        id: "proposal-1",
      };

      const updatedDocument = reducer(
        document,
        creators.removeProposal(input)
      );

      expect(updatedDocument.state.global.proposals).toHaveLength(2);
      expect(updatedDocument.state.global.proposals[0].id).toBe("proposal-2");
      expect(updatedDocument.state.global.proposals[1].id).toBe("proposal-3");
    });

    it("should remove last proposal correctly", () => {
      const input: RemoveProposalInput = {
        rfpId: "rfp-123",
        id: "proposal-3",
      };

      const updatedDocument = reducer(
        document,
        creators.removeProposal(input)
      );

      expect(updatedDocument.state.global.proposals).toHaveLength(2);
      expect(updatedDocument.state.global.proposals[0].id).toBe("proposal-1");
      expect(updatedDocument.state.global.proposals[1].id).toBe("proposal-2");
    });

    it("should remove all proposals when removing each one", () => {
      let currentDocument = document;

      // Remove all proposals one by one
      currentDocument = reducer(
        currentDocument,
        creators.removeProposal({ rfpId: "rfp-123", id: "proposal-1" })
      );
      currentDocument = reducer(
        currentDocument,
        creators.removeProposal({ rfpId: "rfp-123", id: "proposal-2" })
      );
      currentDocument = reducer(
        currentDocument,
        creators.removeProposal({ rfpId: "rfp-123", id: "proposal-3" })
      );

      expect(currentDocument.state.global.proposals).toHaveLength(0);
    });
  });
});
