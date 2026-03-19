import { generateMock } from "@powerhousedao/common/utils";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isPaymentTermsDocument,
  addBonusClause,
  updateBonusClause,
  deleteBonusClause,
  addPenaltyClause,
  updatePenaltyClause,
  deletePenaltyClause,
  AddBonusClauseInputSchema,
  UpdateBonusClauseInputSchema,
  DeleteBonusClauseInputSchema,
  AddPenaltyClauseInputSchema,
  UpdatePenaltyClauseInputSchema,
  DeletePenaltyClauseInputSchema,
} from "@powerhousedao/network-admin/document-models/payment-terms/v1";

describe("ClausesOperations", () => {
  it("should handle addBonusClause operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddBonusClauseInputSchema());

    const updatedDocument = reducer(document, addBonusClause(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_BONUS_CLAUSE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateBonusClause operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateBonusClauseInputSchema());

    const updatedDocument = reducer(document, updateBonusClause(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_BONUS_CLAUSE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle deleteBonusClause operation", () => {
    const document = utils.createDocument();
    const input = generateMock(DeleteBonusClauseInputSchema());

    const updatedDocument = reducer(document, deleteBonusClause(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_BONUS_CLAUSE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle addPenaltyClause operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddPenaltyClauseInputSchema());

    const updatedDocument = reducer(document, addPenaltyClause(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_PENALTY_CLAUSE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updatePenaltyClause operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdatePenaltyClauseInputSchema());

    const updatedDocument = reducer(document, updatePenaltyClause(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_PENALTY_CLAUSE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle deletePenaltyClause operation", () => {
    const document = utils.createDocument();
    const input = generateMock(DeletePenaltyClauseInputSchema());

    const updatedDocument = reducer(document, deletePenaltyClause(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_PENALTY_CLAUSE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
