/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type AddContextDocumentInput,
  type RemoveContextDocumentInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/contex-document/creators.js";
import type { RequestForProposalsDocument } from "../../gen/types.js";

describe("ContexDocument Operations", () => {
  let document: RequestForProposalsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addContextDocument operation", () => {
    const input: AddContextDocumentInput = generateMock(
      z.AddContextDocumentInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.addContextDocument(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "ADD_CONTEXT_DOCUMENT",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeContextDocument operation", () => {
    const input: RemoveContextDocumentInput = generateMock(
      z.RemoveContextDocumentInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.removeContextDocument(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "REMOVE_CONTEXT_DOCUMENT",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
