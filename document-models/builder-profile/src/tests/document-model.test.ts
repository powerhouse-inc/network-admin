/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import utils, {
  initialGlobalState,
  initialLocalState,
} from "../../gen/utils.js";

describe("Builder Profile Document Model", () => {
  it("should create a new Builder Profile document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe("powerhouse/builder-profile");
  });

  it("should create a new Builder Profile document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
  });
});
