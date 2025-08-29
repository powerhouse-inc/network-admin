/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type SetBasicTermsInput,
  type UpdateStatusInput,
  type SetCostAndMaterialsInput,
  type SetRetainerDetailsInput,
  type SetEscrowDetailsInput,
  type SetEvaluationTermsInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/terms/creators.js";
import type { PaymentTermsDocument } from "../../gen/types.js";

describe("Terms Operations", () => {
  let document: PaymentTermsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle setBasicTerms operation", () => {
    const input: SetBasicTermsInput = generateMock(
      z.SetBasicTermsInputSchema(),
    );

    const updatedDocument = reducer(document, creators.setBasicTerms(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_BASIC_TERMS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateStatus operation", () => {
    const input: UpdateStatusInput = generateMock(z.UpdateStatusInputSchema());

    const updatedDocument = reducer(document, creators.updateStatus(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setCostAndMaterials operation", () => {
    const input: SetCostAndMaterialsInput = generateMock(
      z.SetCostAndMaterialsInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.setCostAndMaterials(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_COST_AND_MATERIALS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setRetainerDetails operation", () => {
    const input: SetRetainerDetailsInput = generateMock(
      z.SetRetainerDetailsInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.setRetainerDetails(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_RETAINER_DETAILS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setEscrowDetails operation", () => {
    const input: SetEscrowDetailsInput = generateMock(
      z.SetEscrowDetailsInputSchema(),
    );

    const updatedDocument = reducer(document, creators.setEscrowDetails(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_ESCROW_DETAILS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setEvaluationTerms operation", () => {
    const input: SetEvaluationTermsInput = generateMock(
      z.SetEvaluationTermsInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.setEvaluationTerms(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_EVALUATION_TERMS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
