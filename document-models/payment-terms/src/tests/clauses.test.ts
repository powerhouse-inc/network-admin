/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type AddBonusClauseInput,
  type UpdateBonusClauseInput,
  type DeleteBonusClauseInput,
  type AddPenaltyClauseInput,
  type UpdatePenaltyClauseInput,
  type DeletePenaltyClauseInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/clauses/creators.js";
import type { PaymentTermsDocument } from "../../gen/types.js";

describe("Clauses Operations", () => {
  let document: PaymentTermsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addBonusClause operation", () => {
    const input: AddBonusClauseInput = generateMock(
      z.AddBonusClauseInputSchema(),
    );

    const updatedDocument = reducer(document, creators.addBonusClause(input));

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
    const input: UpdateBonusClauseInput = generateMock(
      z.UpdateBonusClauseInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updateBonusClause(input),
    );

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
    const input: DeleteBonusClauseInput = generateMock(
      z.DeleteBonusClauseInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.deleteBonusClause(input),
    );

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
    const input: AddPenaltyClauseInput = generateMock(
      z.AddPenaltyClauseInputSchema(),
    );

    const updatedDocument = reducer(document, creators.addPenaltyClause(input));

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
    const input: UpdatePenaltyClauseInput = generateMock(
      z.UpdatePenaltyClauseInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updatePenaltyClause(input),
    );

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
    const input: DeletePenaltyClauseInput = generateMock(
      z.DeletePenaltyClauseInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.deletePenaltyClause(input),
    );

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
