/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isBuildersDocument,
  addBuilder,
  AddBuilderInputSchema,
  removeBuilder,
  RemoveBuilderInputSchema,
} from "@powerhousedao/network-admin/document-models/builders";

describe("Builders Operations", () => {
  it("should handle addBuilder operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddBuilderInputSchema());

    const updatedDocument = reducer(document, addBuilder(input));

    expect(isBuildersDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_BUILDER",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeBuilder operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveBuilderInputSchema());

    const updatedDocument = reducer(document, removeBuilder(input));

    expect(isBuildersDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_BUILDER",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
