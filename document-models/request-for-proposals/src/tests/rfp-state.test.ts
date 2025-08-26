/**
 * Comprehensive tests for RFP State reducers
 */

import { describe, it, expect, beforeEach } from "vitest";
import utils from "../../gen/utils.js";
import {
  z,
  type EditRfpInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/rfp-state/creators.js";
import type { RequestForProposalsDocument } from "../../gen/types.js";

describe("RFP State Reducers - State Changes", () => {
  let document: RequestForProposalsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("editRfp", () => {
    it("should update all RFP fields when provided", () => {
      const input: EditRfpInput = {
        title: "New RFP Title",
        description: "Updated description for the RFP",
        eligibilityCriteria: "Criteria 1",
        evaluationCriteria: "Evaluation 1",
        status: "OPEN_FOR_PROPOSALS",
        deadline: "2024-12-31T23:59:59Z",
        tags: ["technical", "urgent"],
        budgetRange: {
          min: 10000,
          max: 50000,
          currency: "USD",
        },
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.title).toBe("New RFP Title");
      expect(updatedDocument.state.global.description).toBe("Updated description for the RFP");
      expect(updatedDocument.state.global.eligibilityCriteria).toEqual(["Criteria 1", "Criteria 2"]);
      expect(updatedDocument.state.global.evaluationCriteria).toEqual(["Evaluation 1", "Evaluation 2"]);
      expect(updatedDocument.state.global.status).toBe("OPEN_FOR_PROPOSALS");
      expect(updatedDocument.state.global.deadline).toBe("2024-12-31T23:59:59Z");
      expect(updatedDocument.state.global.tags).toEqual(["technical", "urgent"]);
      expect(updatedDocument.state.global.budgetRange.min).toBe(10000);
      expect(updatedDocument.state.global.budgetRange.max).toBe(50000);
      expect(updatedDocument.state.global.budgetRange.currency).toBe("USD");
    });

    it("should update only provided fields, leaving others unchanged", () => {
      // First set some initial values
      const firstUpdate = reducer(
        document,
        creators.editRfp({
          title: "Initial Title",
          description: "Initial description",
          status: "DRAFT",
          eligibilityCriteria: "Initial criteria",
        })
      );

      // Then update only some fields
      const input: EditRfpInput = {
        title: "Updated Title",
        status: "OPEN_FOR_PROPOSALS",
        tags: ["new-tag"],
      };

      const finalDocument = reducer(firstUpdate, creators.editRfp(input));

      expect(finalDocument.state.global.title).toBe("Updated Title"); // Changed
      expect(finalDocument.state.global.status).toBe("OPEN_FOR_PROPOSALS"); // Changed
      expect(finalDocument.state.global.tags).toEqual(["new-tag"]); // Changed
      expect(finalDocument.state.global.description).toBe("Initial description"); // Unchanged
      expect(finalDocument.state.global.eligibilityCriteria).toEqual(["Initial criteria"]); // Unchanged
    });

    it("should handle null/undefined values correctly", () => {
      const input: EditRfpInput = {
        title: "Required Title", // Title is required by reducer
        description: undefined,
        status: "DRAFT",
        eligibilityCriteria: null,
        evaluationCriteria: undefined,
        tags: null,
        budgetRange: {
          min: null,
          max: undefined,
          currency: null,
        },
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.title).toBe("Required Title");
      expect(updatedDocument.state.global.description).toBe(""); // Default value
      expect(updatedDocument.state.global.status).toBe("DRAFT");
      expect(updatedDocument.state.global.eligibilityCriteria).toEqual([]); // Default value
      expect(updatedDocument.state.global.evaluationCriteria).toEqual([]); // Default value
      expect(updatedDocument.state.global.tags).toBe(null);
      expect(updatedDocument.state.global.budgetRange.min).toBe(null);
      expect(updatedDocument.state.global.budgetRange.max).toBe(null);
      expect(updatedDocument.state.global.budgetRange.currency).toBe(null);
    });

    it("should handle empty string values", () => {
      const input: EditRfpInput = {
        title: "",
        description: "",
        status: "DRAFT",
        eligibilityCriteria: "",
        evaluationCriteria: "",
        tags: [],
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.title).toBe("");
      expect(updatedDocument.state.global.description).toBe("");
      expect(updatedDocument.state.global.eligibilityCriteria).toEqual([]);
      expect(updatedDocument.state.global.evaluationCriteria).toEqual([]);
      expect(updatedDocument.state.global.tags).toEqual([]);
    });

    it("should handle all possible RFP statuses", () => {
      const statuses = [
        "DRAFT",
        "REQUEST_FOR_COMMMENTS",
        "CANCELED",
        "OPEN_FOR_PROPOSALS",
        "AWARDED",
        "NOT_AWARDED",
        "CLOSED",
      ];

      let currentDocument = document;

      statuses.forEach((status) => {
        currentDocument = reducer(
          currentDocument,
          creators.editRfp({
            title: "Test Title", // Required by reducer
            status: status as any,
          })
        );
      });

      expect(currentDocument.state.global.status).toBe("CLOSED"); // Final status
    });

    it("should handle budget range updates correctly", () => {
      const input: EditRfpInput = {
        title: "Test Title", // Required by reducer
        status: "DRAFT",
        budgetRange: {
          min: 15000,
          max: 75000,
          currency: "EUR",
        },
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.budgetRange.min).toBe(15000);
      expect(updatedDocument.state.global.budgetRange.max).toBe(75000);
      expect(updatedDocument.state.global.budgetRange.currency).toBe("EUR");
    });

    it("should handle partial budget range updates", () => {
      // First set a complete budget range
      let currentDocument = reducer(
        document,
        creators.editRfp({
          title: "Test Title", // Required by reducer
          status: "DRAFT",
          budgetRange: {
            min: 10000,
            max: 50000,
            currency: "USD",
          },
        })
      );

      // Then update only some budget range fields
      currentDocument = reducer(
        currentDocument,
        creators.editRfp({
          title: "Test Title", // Required by reducer
          status: "DRAFT",
          budgetRange: {
            min: 20000,
            currency: "EUR",
          },
        })
      );

      expect(currentDocument.state.global.budgetRange.min).toBe(20000);
      expect(currentDocument.state.global.budgetRange.max).toBe(null); // Undefined becomes null
      expect(currentDocument.state.global.budgetRange.currency).toBe("EUR");
    });

    it("should handle special characters in text fields", () => {
      const input: EditRfpInput = {
        title: "RFP with special chars: & < > \" '",
        description: "Description with emojis: 🚀 💡 📊 and symbols: © ® ™",
        status: "DRAFT",
        eligibilityCriteria: "Criteria with spaces & symbols!",
        evaluationCriteria: "Evaluation with numbers: 1, 2, 3",
        tags: ["tag-with-dashes", "tag_with_underscores", "tag with spaces"],
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.title).toBe("RFP with special chars: & < > \" '");
      expect(updatedDocument.state.global.description).toBe("Description with emojis: 🚀 💡 📊 and symbols: © ® ™");
      expect(updatedDocument.state.global.eligibilityCriteria).toEqual(["Criteria with spaces & symbols!"]);
      expect(updatedDocument.state.global.evaluationCriteria).toEqual(["Evaluation with numbers: 1, 2, 3"]);
      expect(updatedDocument.state.global.tags).toEqual(["tag-with-dashes", "tag_with_underscores", "tag with spaces"]);
    });

    it("should handle large arrays of criteria and tags", () => {
      const largeCriteria = Array.from({ length: 100 }, (_, i) => `Criteria ${i + 1}`);
      const largeTags = Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`);

      const input: EditRfpInput = {
        title: "Test Title", // Required by reducer
        status: "DRAFT",
        eligibilityCriteria: largeCriteria.join(", "),
        evaluationCriteria: largeCriteria.slice(0, 50).join(", "), // Different size
        tags: largeTags,
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.eligibilityCriteria).toHaveLength(100);
      expect(updatedDocument.state.global.evaluationCriteria).toHaveLength(50);
      expect(updatedDocument.state.global.tags).toHaveLength(50);
      expect(updatedDocument.state.global.eligibilityCriteria[0]).toBe("Criteria 1");
      expect(updatedDocument.state.global.eligibilityCriteria[99]).toBe("Criteria 100");
      expect(updatedDocument.state.global.tags![0]).toBe("tag-1");
      expect(updatedDocument.state.global.tags![49]).toBe("tag-50");
    });

    it("should handle ISO date strings correctly", () => {
      const input: EditRfpInput = {
        title: "Test Title", // Required by reducer
        status: "DRAFT",
        deadline: "2024-12-31T23:59:59.999Z",
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.deadline).toBe("2024-12-31T23:59:59.999Z");
    });

    it("should handle empty budget range", () => {
      const input: EditRfpInput = {
        title: "Test Title", // Required by reducer
        status: "DRAFT",
        budgetRange: {
          min: null,
          max: null,
          currency: null,
        },
      };

      const updatedDocument = reducer(
        document,
        creators.editRfp(input)
      );

      expect(updatedDocument.state.global.budgetRange.min).toBe(null);
      expect(updatedDocument.state.global.budgetRange.max).toBe(null);
      expect(updatedDocument.state.global.budgetRange.currency).toBe(null);
    });

    it("should preserve existing budget range when not provided", () => {
      // First set a budget range
      let currentDocument = reducer(
        document,
        creators.editRfp({
          title: "Test Title", // Required by reducer
          status: "DRAFT",
          budgetRange: {
            min: 10000,
            max: 50000,
            currency: "USD",
          },
        })
      );

      // Then update without budget range
      currentDocument = reducer(
        currentDocument,
        creators.editRfp({
          title: "Test Title", // Required by reducer
          status: "OPEN_FOR_PROPOSALS",
        })
      );

      // Budget range should remain unchanged
      expect(currentDocument.state.global.budgetRange.min).toBe(10000);
      expect(currentDocument.state.global.budgetRange.max).toBe(50000);
      expect(currentDocument.state.global.budgetRange.currency).toBe("USD");
      expect(currentDocument.state.global.status).toBe("OPEN_FOR_PROPOSALS"); // Only status changed
    });
  });
});
