/**
 * Comprehensive tests for Context Document reducers
 */

import { describe, it, expect, beforeEach } from "vitest";
import utils from "../../gen/utils.js";
import {
  z,
  type AddContextDocumentInput,
  type RemoveContextDocumentInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/contex-document/creators.js";
import type { RequestForProposalsDocument } from "../../gen/types.js";

describe("Context Document Reducers - State Changes", () => {
  let document: RequestForProposalsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  describe("addContextDocument", () => {
    it("should add new context document", () => {
      const input: AddContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Technical Specification",
        url: "https://example.com/tech-spec.pdf",
      };

      const updatedDocument = reducer(
        document,
        creators.addContextDocument(input)
      );

      expect(updatedDocument.state.global.contextDocuments).toHaveLength(1);
      
      const contextDoc = updatedDocument.state.global.contextDocuments[0];
      expect(contextDoc.name).toBe("Technical Specification");
      expect(contextDoc.url).toBe("https://example.com/tech-spec.pdf");
    });

    it("should add multiple context documents", () => {
      let currentDocument = document;

      // Add first document
      currentDocument = reducer(
        currentDocument,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Technical Spec",
          url: "https://example.com/tech-spec.pdf",
        })
      );

      // Add second document
      currentDocument = reducer(
        currentDocument,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Requirements Doc",
          url: "https://example.com/requirements.pdf",
        })
      );

      expect(currentDocument.state.global.contextDocuments).toHaveLength(2);
      expect(currentDocument.state.global.contextDocuments[0].name).toBe("Technical Spec");
      expect(currentDocument.state.global.contextDocuments[1].name).toBe("Requirements Doc");
    });

    it("should handle documents with same name (allow duplicates)", () => {
      let currentDocument = document;

      // Add first document
      currentDocument = reducer(
        currentDocument,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Same Name",
          url: "https://example.com/doc1.pdf",
        })
      );

      // Add second document with same name
      currentDocument = reducer(
        currentDocument,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Same Name",
          url: "https://example.com/doc2.pdf",
        })
      );

      expect(currentDocument.state.global.contextDocuments).toHaveLength(2);
      expect(currentDocument.state.global.contextDocuments[0].url).toBe("https://example.com/doc1.pdf");
      expect(currentDocument.state.global.contextDocuments[1].url).toBe("https://example.com/doc2.pdf");
    });

    it("should handle empty string values", () => {
      const input: AddContextDocumentInput = {
        rfpId: "rfp-123",
        name: "",
        url: "https://example.com/empty.pdf",
      };

      const updatedDocument = reducer(
        document,
        creators.addContextDocument(input)
      );

      const doc = updatedDocument.state.global.contextDocuments[0];
      expect(doc.name).toBe("");
      expect(doc.url).toBe("https://example.com/empty.pdf");
    });

    it("should handle special characters in name and URL", () => {
      const input: AddContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Document with spaces & symbols!",
        url: "https://example.com/path with spaces/file.pdf?param=value#fragment",
      };

      const updatedDocument = reducer(
        document,
        creators.addContextDocument(input)
      );

      const doc = updatedDocument.state.global.contextDocuments[0];
      expect(doc.name).toBe("Document with spaces & symbols!");
      expect(doc.url).toBe("https://example.com/path with spaces/file.pdf?param=value#fragment");
    });
  });

  describe("removeContextDocument", () => {
    beforeEach(() => {
      // Add some documents to test removal
      document = reducer(
        document,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Document 1",
          url: "https://example.com/doc1.pdf",
        })
      );
      document = reducer(
        document,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Document 2",
          url: "https://example.com/doc2.pdf",
        })
      );
      document = reducer(
        document,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Document 3",
          url: "https://example.com/doc3.pdf",
        })
      );
    });

    it("should remove existing context document by name", () => {
      const input: RemoveContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Document 2",
      };

      const updatedDocument = reducer(
        document,
        creators.removeContextDocument(input)
      );

      expect(updatedDocument.state.global.contextDocuments).toHaveLength(2);
      
      const remainingNames = updatedDocument.state.global.contextDocuments.map(doc => doc.name);
      expect(remainingNames).toContain("Document 1");
      expect(remainingNames).toContain("Document 3");
      expect(remainingNames).not.toContain("Document 2");
    });

    it("should handle removal of non-existent document gracefully", () => {
      const input: RemoveContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Non-existent Document",
      };

      const updatedDocument = reducer(
        document,
        creators.removeContextDocument(input)
      );

      // All original documents should remain
      expect(updatedDocument.state.global.contextDocuments).toHaveLength(3);
      
      const remainingNames = updatedDocument.state.global.contextDocuments.map(doc => doc.name);
      expect(remainingNames).toContain("Document 1");
      expect(remainingNames).toContain("Document 2");
      expect(remainingNames).toContain("Document 3");
    });

    it("should handle removal from empty array gracefully", () => {
      const emptyDocument = utils.createDocument();
      
      const input: RemoveContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Any Document",
      };

      const updatedDocument = reducer(
        emptyDocument,
        creators.removeContextDocument(input)
      );

      expect(updatedDocument.state.global.contextDocuments).toHaveLength(0);
    });

    it("should remove first document correctly", () => {
      const input: RemoveContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Document 1",
      };

      const updatedDocument = reducer(
        document,
        creators.removeContextDocument(input)
      );

      expect(updatedDocument.state.global.contextDocuments).toHaveLength(2);
      expect(updatedDocument.state.global.contextDocuments[0].name).toBe("Document 2");
      expect(updatedDocument.state.global.contextDocuments[1].name).toBe("Document 3");
    });

    it("should remove last document correctly", () => {
      const input: RemoveContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Document 3",
      };

      const updatedDocument = reducer(
        document,
        creators.removeContextDocument(input)
      );

      expect(updatedDocument.state.global.contextDocuments).toHaveLength(2);
      expect(updatedDocument.state.global.contextDocuments[0].name).toBe("Document 1");
      expect(updatedDocument.state.global.contextDocuments[1].name).toBe("Document 2");
    });

    it("should handle case-sensitive name matching", () => {
      const input: RemoveContextDocumentInput = {
        rfpId: "rfp-123",
        name: "document 1", // Different case
      };

      const updatedDocument = reducer(
        document,
        creators.removeContextDocument(input)
      );

      // Document should not be removed due to case mismatch
      expect(updatedDocument.state.global.contextDocuments).toHaveLength(3);
    });

    it("should remove all documents with same name", () => {
      // Add another document with same name
      document = reducer(
        document,
        creators.addContextDocument({
          rfpId: "rfp-123",
          name: "Document 1",
          url: "https://example.com/doc1-duplicate.pdf",
        })
      );

      const input: RemoveContextDocumentInput = {
        rfpId: "rfp-123",
        name: "Document 1",
      };

      const updatedDocument = reducer(
        document,
        creators.removeContextDocument(input)
      );

      // Should remove all documents with same name
      expect(updatedDocument.state.global.contextDocuments).toHaveLength(2);
      
      const remainingDocs = updatedDocument.state.global.contextDocuments.filter(doc => doc.name === "Document 1");
      expect(remainingDocs).toHaveLength(0);
    });
  });
});
