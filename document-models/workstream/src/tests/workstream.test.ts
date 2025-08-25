/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type EditWorkstreamInput,
  type EditClientInfoInput,
  type SetRequestForProposalInput,
  type AddPaymentRequestInput,
  type RemovePaymentRequestInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/workstream/creators.js";
import type { WorkstreamDocument } from "../../gen/types.js";

describe("Workstream Operations", () => {
  let document: WorkstreamDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle editWorkstream operation", () => {
    const input: EditWorkstreamInput = generateMock(
      z.EditWorkstreamInputSchema(),
    );

    const updatedDocument = reducer(document, creators.editWorkstream(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_WORKSTREAM");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect((updatedDocument.operations.global[0] as any).index).toEqual(0);
  });
  it("should handle editClientInfo operation", () => {
    const input: EditClientInfoInput = generateMock(
      z.EditClientInfoInputSchema(),
    );

    const updatedDocument = reducer(document, creators.editClientInfo(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("EDIT_CLIENT_INFO");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect((updatedDocument.operations.global[0] as any).index).toEqual(0);
  });
  it("should handle setRequestForProposal operation", () => {
    const input: SetRequestForProposalInput = generateMock(
      z.SetRequestForProposalInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.setRequestForProposal(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe(
      "SET_REQUEST_FOR_PROPOSAL",
    );
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect((updatedDocument.operations.global[0] as any).index).toEqual(0);
  });
  it("should handle addPaymentRequest operation", () => {
    const input: AddPaymentRequestInput = generateMock(
      z.AddPaymentRequestInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.addPaymentRequest(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe(
      "ADD_PAYMENT_REQUEST",
    );
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect((updatedDocument.operations.global[0] as any).index).toEqual(0);
  });
  it("should handle removePaymentRequest operation", () => {
    const input: RemovePaymentRequestInput = generateMock(
      z.RemovePaymentRequestInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.removePaymentRequest(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe(
      "REMOVE_PAYMENT_REQUEST",
    );
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect((updatedDocument.operations.global[0] as any).index).toEqual(0);
  });
});
