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
  editRfp,
  EditRfpInputSchema,
} from "../../index.js";

describe("RfpState Operations", () => {
  it("should handle editRfp operation", () => {
    const document = utils.createDocument();
    const input = generateMock(EditRfpInputSchema());

    const updatedDocument = reducer(document, editRfp(input));

    expect(isRequestForProposalsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("EDIT_RFP");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
