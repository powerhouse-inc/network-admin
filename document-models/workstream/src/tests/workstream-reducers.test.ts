/**
 * Comprehensive tests for Workstream reducers
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type EditWorkstreamInput,
  type EditClientInfoInput,
  type SetRequestForProposalInput,
  type AddPaymentRequestInput,
  type RemovePaymentRequestInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/workstream/creators.js";
import type { WorkstreamDocument, WorkstreamState } from "../../gen/types.js";

describe("Workstream Reducers - State Changes", () => {
  let document: WorkstreamDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("editWorkstream", () => {
    it("should update all workstream fields when provided", () => {
      const input: EditWorkstreamInput = {
        code: "WS-001",
        title: "Test Workstream",
        status: "IN_PROGRESS",
        sowId: "sow-123",
        paymentTerms: "terms-456",
      };

      const updatedDocument = reducer(document, creators.editWorkstream(input));

      expect(updatedDocument.state.global.code).toBe("WS-001");
      expect(updatedDocument.state.global.title).toBe("Test Workstream");
      expect(updatedDocument.state.global.status).toBe("IN_PROGRESS");
      expect(updatedDocument.state.global.sow).toBe("sow-123");
      expect(updatedDocument.state.global.paymentTerms).toBe("terms-456");
    });

    it("should update only provided fields, leaving others unchanged", () => {
      // First set some initial values
      const firstUpdate = reducer(
        document,
        creators.editWorkstream({
          code: "WS-001",
          title: "Initial Title",
          status: "RFP_DRAFT",
        })
      );

      // Then update only some fields
      const input: EditWorkstreamInput = {
        title: "Updated Title",
        status: "OPEN_FOR_PROPOSALS",
      };

      const finalDocument = reducer(firstUpdate, creators.editWorkstream(input));

      expect(finalDocument.state.global.code).toBe("WS-001"); // Unchanged
      expect(finalDocument.state.global.title).toBe("Updated Title"); // Changed
      expect(finalDocument.state.global.status).toBe("OPEN_FOR_PROPOSALS"); // Changed
    });

    it("should handle null/undefined values correctly", () => {
      const input: EditWorkstreamInput = {
        code: undefined,
        title: null,
        status: "RFP_DRAFT",
      };

      const updatedDocument = reducer(document, creators.editWorkstream(input));

      expect(updatedDocument.state.global.code).toBe(null); // Initial value
      expect(updatedDocument.state.global.title).toBe(null);
      expect(updatedDocument.state.global.status).toBe("RFP_DRAFT");
    });

    it("should handle empty string values by converting to null", () => {
      const input: EditWorkstreamInput = {
        code: "",
        title: "",
      };

      const updatedDocument = reducer(document, creators.editWorkstream(input));

      expect(updatedDocument.state.global.code).toBe(null);
      expect(updatedDocument.state.global.title).toBe(null);
    });
  });

  describe("editClientInfo", () => {
    it("should create client info when it doesn't exist", () => {
      const input: EditClientInfoInput = {
        clientId: "client-123",
        name: "Test Client",
        icon: "client-icon",
      };

      const updatedDocument = reducer(document, creators.editClientInfo(input));

      expect(updatedDocument.state.global.client).toBeDefined();
      expect(updatedDocument.state.global.client!.id).toBe("client-123");
      expect(updatedDocument.state.global.client!.name).toBe("Test Client");
      expect(updatedDocument.state.global.client!.icon).toBe("client-icon");
    });

    it("should update existing client info", () => {
      // First create client
      const firstUpdate = reducer(
        document,
        creators.editClientInfo({
          clientId: "client-123",
          name: "Initial Name",
        })
      );

      // Then update client
      const input: EditClientInfoInput = {
        clientId: "client-456",
        name: "Updated Name",
        icon: "new-icon",
      };

      const finalDocument = reducer(firstUpdate, creators.editClientInfo(input));

      expect(finalDocument.state.global.client!.id).toBe("client-456");
      expect(finalDocument.state.global.client!.name).toBe("Updated Name");
      expect(finalDocument.state.global.client!.icon).toBe("new-icon");
    });

    it("should handle optional fields correctly", () => {
      const input: EditClientInfoInput = {
        clientId: "client-123",
        name: undefined,
        icon: null,
      };

      const updatedDocument = reducer(document, creators.editClientInfo(input));

      expect(updatedDocument.state.global.client!.id).toBe("client-123");
      expect(updatedDocument.state.global.client!.name).toBe(null);
      expect(updatedDocument.state.global.client!.icon).toBe(null);
    });

    it("should convert empty strings to null", () => {
      const input: EditClientInfoInput = {
        clientId: "client-123",
        name: "",
        icon: "",
      };

      const updatedDocument = reducer(document, creators.editClientInfo(input));

      expect(updatedDocument.state.global.client!.name).toBe(null);
      expect(updatedDocument.state.global.client!.icon).toBe(null);
    });
  });

  describe("setRequestForProposal", () => {
    it("should create RFP with provided values", () => {
      const input: SetRequestForProposalInput = {
        rfpId: "rfp-123",
        title: "Test RFP Title",
      };

      const updatedDocument = reducer(
        document,
        creators.setRequestForProposal(input)
      );

      expect(updatedDocument.state.global.rfp).toBeDefined();
      expect(updatedDocument.state.global.rfp!.id).toBe("rfp-123");
      expect(updatedDocument.state.global.rfp!.title).toBe("Test RFP Title");
    });

    it("should replace existing RFP", () => {
      // First create RFP
      const firstUpdate = reducer(
        document,
        creators.setRequestForProposal({
          rfpId: "rfp-123",
          title: "Initial Title",
        })
      );

      // Then replace with new RFP
      const input: SetRequestForProposalInput = {
        rfpId: "rfp-456",
        title: "New Title",
      };

      const finalDocument = reducer(
        firstUpdate,
        creators.setRequestForProposal(input)
      );

      expect(finalDocument.state.global.rfp!.id).toBe("rfp-456");
      expect(finalDocument.state.global.rfp!.title).toBe("New Title");
    });
  });

  describe("addPaymentRequest", () => {
    it("should add payment request ID to empty array", () => {
      const input: AddPaymentRequestInput = {
        id: "payment-123",
      };

      const updatedDocument = reducer(
        document,
        creators.addPaymentRequest(input)
      );

      expect(updatedDocument.state.global.paymentRequests).toContain("payment-123");
      expect(updatedDocument.state.global.paymentRequests).toHaveLength(1);
    });

    it("should add multiple payment request IDs", () => {
      let currentDocument = document;

      // Add first payment request
      currentDocument = reducer(
        currentDocument,
        creators.addPaymentRequest({ id: "payment-123" })
      );

      // Add second payment request
      currentDocument = reducer(
        currentDocument,
        creators.addPaymentRequest({ id: "payment-456" })
      );

      expect(currentDocument.state.global.paymentRequests).toContain("payment-123");
      expect(currentDocument.state.global.paymentRequests).toContain("payment-456");
      expect(currentDocument.state.global.paymentRequests).toHaveLength(2);
    });

    it("should not add duplicate payment request IDs", () => {
      let currentDocument = document;

      // Add payment request
      currentDocument = reducer(
        currentDocument,
        creators.addPaymentRequest({ id: "payment-123" })
      );

      // Try to add same payment request again
      currentDocument = reducer(
        currentDocument,
        creators.addPaymentRequest({ id: "payment-123" })
      );

      expect(currentDocument.state.global.paymentRequests).toHaveLength(1);
      expect(currentDocument.state.global.paymentRequests[0]).toBe("payment-123");
    });
  });

  describe("removePaymentRequest", () => {
    it("should remove existing payment request ID", () => {
      // First add some payment requests
      let currentDocument = reducer(
        document,
        creators.addPaymentRequest({ id: "payment-123" })
      );
      currentDocument = reducer(
        currentDocument,
        creators.addPaymentRequest({ id: "payment-456" })
      );

      // Remove one payment request
      const input: RemovePaymentRequestInput = {
        id: "payment-123",
      };

      const finalDocument = reducer(
        currentDocument,
        creators.removePaymentRequest(input)
      );

      expect(finalDocument.state.global.paymentRequests).not.toContain("payment-123");
      expect(finalDocument.state.global.paymentRequests).toContain("payment-456");
      expect(finalDocument.state.global.paymentRequests).toHaveLength(1);
    });

    it("should handle removal of non-existent payment request ID gracefully", () => {
      // Add one payment request
      const currentDocument = reducer(
        document,
        creators.addPaymentRequest({ id: "payment-123" })
      );

      // Try to remove non-existent payment request
      const input: RemovePaymentRequestInput = {
        id: "payment-999",
      };

      const finalDocument = reducer(
        currentDocument,
        creators.removePaymentRequest(input)
      );

      expect(finalDocument.state.global.paymentRequests).toContain("payment-123");
      expect(finalDocument.state.global.paymentRequests).toHaveLength(1);
    });

    it("should handle removal from empty array gracefully", () => {
      const input: RemovePaymentRequestInput = {
        id: "payment-123",
      };

      const updatedDocument = reducer(
        document,
        creators.removePaymentRequest(input)
      );

      expect(updatedDocument.state.global.paymentRequests).toHaveLength(0);
    });
  });
});