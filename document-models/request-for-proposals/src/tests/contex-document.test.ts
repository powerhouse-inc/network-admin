/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isRequestForProposalsDocument,
  addContextDocument,
  AddContextDocumentInputSchema,
  removeContextDocument,
  RemoveContextDocumentInputSchema,
} from "../../index.js";

describe("ContexDocument Operations", () => {
  it("should handle addContextDocument operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddContextDocumentInputSchema());

    const updatedDocument = reducer(document, addContextDocument(input));

    expect(isRequestForProposalsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_CONTEXT_DOCUMENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeContextDocument operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveContextDocumentInputSchema());

    const updatedDocument = reducer(document, removeContextDocument(input));

    expect(isRequestForProposalsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_CONTEXT_DOCUMENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
