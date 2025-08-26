/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import { z, type EditRfpInput } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/rfp-state/creators.js";
import type { RequestForProposalsDocument } from "../../gen/types.js";

describe("RfpState Operations", () => {
  let document: RequestForProposalsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle editRfp operation", () => {
    const input: EditRfpInput = generateMock(z.EditRfpInputSchema());

    const updatedDocument = reducer(document, creators.editRfp(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("EDIT_RFP");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
