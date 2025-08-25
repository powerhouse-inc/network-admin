/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type EditInitialProposalInput,
  type AddAlternativeProposalInput,
  type EditAlternativeProposalInput,
  type RemoveAlternativeProposalInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/proposals/creators.js";
import type { WorkstreamDocument } from "../../gen/types.js";

describe("Proposals Operations", () => {
  let document: WorkstreamDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle editInitialProposal operation", () => {
    const input: EditInitialProposalInput = generateMock(
      z.EditInitialProposalInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.editInitialProposal(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "EDIT_INITIAL_PROPOSAL",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle addAlternativeProposal operation", () => {
    const input: AddAlternativeProposalInput = generateMock(
      z.AddAlternativeProposalInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.addAlternativeProposal(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "ADD_ALTERNATIVE_PROPOSAL",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editAlternativeProposal operation", () => {
    const input: EditAlternativeProposalInput = generateMock(
      z.EditAlternativeProposalInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.editAlternativeProposal(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "EDIT_ALTERNATIVE_PROPOSAL",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeAlternativeProposal operation", () => {
    const input: RemoveAlternativeProposalInput = generateMock(
      z.RemoveAlternativeProposalInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.removeAlternativeProposal(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "REMOVE_ALTERNATIVE_PROPOSAL",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
