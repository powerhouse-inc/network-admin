import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isPaymentTermsDocument,
  setBasicTerms,
  updateStatus,
  setTimeAndMaterials,
  setEscrowDetails,
  setEvaluationTerms,
  SetBasicTermsInputSchema,
  UpdateStatusInputSchema,
  SetTimeAndMaterialsInputSchema,
  SetEscrowDetailsInputSchema,
  SetEvaluationTermsInputSchema,
} from "@powerhousedao/network-admin/document-models/payment-terms";

describe("TermsOperations", () => {
  it("should handle setBasicTerms operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetBasicTermsInputSchema());

    const updatedDocument = reducer(document, setBasicTerms(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
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
    const document = utils.createDocument();
    const input = generateMock(UpdateStatusInputSchema());

    const updatedDocument = reducer(document, updateStatus(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle setTimeAndMaterials operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetTimeAndMaterialsInputSchema());

    const updatedDocument = reducer(document, setTimeAndMaterials(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_TIME_AND_MATERIALS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle setEscrowDetails operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetEscrowDetailsInputSchema());

    const updatedDocument = reducer(document, setEscrowDetails(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
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
    const document = utils.createDocument();
    const input = generateMock(SetEvaluationTermsInputSchema());

    const updatedDocument = reducer(document, setEvaluationTerms(input));

    expect(isPaymentTermsDocument(updatedDocument)).toBe(true);
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
