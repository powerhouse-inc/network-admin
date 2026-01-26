import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isRequestForProposalsDocument,
  editRfp,
  EditRfpInputSchema,
} from "@powerhousedao/network-admin/document-models/request-for-proposals";

describe("RfpStateOperations", () => {
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
