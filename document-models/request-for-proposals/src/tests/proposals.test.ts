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
  addProposal,
  AddProposalInputSchema,
  changeProposalStatus,
  ChangeProposalStatusInputSchema,
  removeProposal,
  RemoveProposalInputSchema,
} from "@powerhousedao/network-admin/document-models/request-for-proposals";

describe("Proposals Operations", () => {
  it("should handle addProposal operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddProposalInputSchema());

    const updatedDocument = reducer(document, addProposal(input));

    expect(isRequestForProposalsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_PROPOSAL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle changeProposalStatus operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ChangeProposalStatusInputSchema());

    const updatedDocument = reducer(document, changeProposalStatus(input));

    expect(isRequestForProposalsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CHANGE_PROPOSAL_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeProposal operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveProposalInputSchema());

    const updatedDocument = reducer(document, removeProposal(input));

    expect(isRequestForProposalsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_PROPOSAL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
