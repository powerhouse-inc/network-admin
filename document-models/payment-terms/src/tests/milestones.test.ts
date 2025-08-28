/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type AddMilestoneInput,
  type UpdateMilestoneInput,
  type UpdateMilestoneStatusInput,
  type DeleteMilestoneInput,
  type ReorderMilestonesInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/milestones/creators.js";
import type { PaymentTermsDocument } from "../../gen/types.js";

describe("Milestones Operations", () => {
  let document: PaymentTermsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addMilestone operation", () => {
    const input: AddMilestoneInput = generateMock(z.AddMilestoneInputSchema());

    const updatedDocument = reducer(document, creators.addMilestone(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_MILESTONE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateMilestone operation", () => {
    const input: UpdateMilestoneInput = generateMock(
      z.UpdateMilestoneInputSchema(),
    );

    const updatedDocument = reducer(document, creators.updateMilestone(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_MILESTONE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateMilestoneStatus operation", () => {
    const input: UpdateMilestoneStatusInput = generateMock(
      z.UpdateMilestoneStatusInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updateMilestoneStatus(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_MILESTONE_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteMilestone operation", () => {
    const input: DeleteMilestoneInput = generateMock(
      z.DeleteMilestoneInputSchema(),
    );

    const updatedDocument = reducer(document, creators.deleteMilestone(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_MILESTONE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reorderMilestones operation", () => {
    const input: ReorderMilestonesInput = generateMock(
      z.ReorderMilestonesInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.reorderMilestones(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REORDER_MILESTONES",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
