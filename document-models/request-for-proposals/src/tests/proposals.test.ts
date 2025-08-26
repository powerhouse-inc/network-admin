/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
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

describe("Proposals Operations", () => {
  let document: RequestForProposalsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addProposal operation", () => {
    const input: AddProposalInput = generateMock(z.AddProposalInputSchema());

    const updatedDocument = reducer(document, creators.addProposal(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("ADD_PROPOSAL");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle changeProposalStatus operation", () => {
    const input: ChangeProposalStatusInput = generateMock(
      z.ChangeProposalStatusInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.changeProposalStatus(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "CHANGE_PROPOSAL_STATUS",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeProposal operation", () => {
    const input: RemoveProposalInput = generateMock(
      z.RemoveProposalInputSchema(),
    );

    const updatedDocument = reducer(document, creators.removeProposal(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("REMOVE_PROPOSAL");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
