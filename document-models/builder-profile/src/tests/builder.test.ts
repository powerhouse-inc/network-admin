import { describe, it, expect, beforeEach } from "vitest";
import utils from "../../gen/utils.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/builder/creators.js";
import type { BuilderProfileDocument } from "../../gen/types.js";
import { z, type UpdateProfileInput } from "../../gen/schema/index.js";

/**
 * BuilderProfile Document Model: Comprehensive Tests
 * Focus: PHID and URL field validation, update, and expected behaviors
 */

const VALID_PHID = "phd:baefc2a4-f9a0-4950-8161-fd8d8cc7dea7";
const VALID_URL = "https://powerhouse.inc/icon.png";
const INVALID_PHID = "invalid:format:phid";
const INVALID_URL = "not-a-url";

describe("BuilderProfile Document Model", () => {
  let document: BuilderProfileDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should accept a valid PHID and URL in updateProfile", () => {
    const input: UpdateProfileInput = {
      id: VALID_PHID,
      slug: "builder-slug",
      name: "Builder Name",
      icon: VALID_URL,
      description: "A valid builder description"
    };

    // Should not throw during reducer/update
    const updatedDocument = reducer(document, creators.updateProfile(input));
    // Check operation appended with strict equality
    expect(updatedDocument.operations.global).toHaveLength(1);
    const op = updatedDocument.operations.global[0];
    expect(op.action.type).toBe("UPDATE_PROFILE");
    expect(op.action.input).toStrictEqual(input);

    // Ensure the PHID and URL fields persisted in state
    expect(updatedDocument.state.global.id).toBe(VALID_PHID);
    expect(updatedDocument.state.global.icon).toBe(VALID_URL);
  });

  it("should reject an invalid PHID using Zod validation", () => {
    const input: UpdateProfileInput = {
      id: INVALID_PHID,
      slug: "builder-slug",
      name: "Builder Name",
      icon: VALID_URL,
      description: "should fail phid"
    };
    // Zod parsing should throw
    expect(() => z.UpdateProfileInputSchema().parse(input)).toThrow();
  });

  it("should reject an invalid URL using Zod validation", () => {
    const input: UpdateProfileInput = {
      id: VALID_PHID,
      slug: "builder-slug",
      name: "Builder Name",
      icon: INVALID_URL,
      description: "should fail url"
    };
    // Zod parsing should throw
    expect(() => z.UpdateProfileInputSchema().parse(input)).toThrow();
  });

  it("should update only the URL and PHID fields if only they are provided", () => {
    // The rest of the state is initialized to undefined by utils.createDocument()
    // Set initial values
    const initialInput: UpdateProfileInput = {
      id: VALID_PHID,
      slug: "slug-main",
      name: "Initial Name",
      icon: VALID_URL,
      description: "Initial desc"
    };
    let currDoc = reducer(document, creators.updateProfile(initialInput));
    // Now, update only id and icon
    const updateInput: UpdateProfileInput = {
      id: "phd:12345678-1111-2222-3333-abcdefabcdef:main:public",
      icon: "https://updated-url.com/icon.svg"
    };
    currDoc = reducer(currDoc, creators.updateProfile(updateInput));
    // id & icon changed, others remain
    expect(currDoc.state.global.id).toBe(updateInput.id);
    expect(currDoc.state.global.icon).toBe(updateInput.icon);
    expect(currDoc.state.global.slug).toBe(initialInput.slug);
    expect(currDoc.state.global.name).toBe(initialInput.name);
    expect(currDoc.state.global.description).toBe(initialInput.description);
  });

  it("should allow updateProfile with partial inputs, always keeping PHID format valid", () => {
    // Start with valid state
    const initialState: UpdateProfileInput = {
      id: VALID_PHID,
      slug: "val-slug",
      name: "val-name",
      icon: VALID_URL,
      description: "val desc"
    };
    let doc = reducer(document, creators.updateProfile(initialState));
    // Now update only slug
    const partialInput: UpdateProfileInput = {
      slug: "new-slug"
    };
    doc = reducer(doc, creators.updateProfile(partialInput));
    // id is preserved and still valid PHID
    expect(doc.state.global.id).toBe(VALID_PHID);
    // slug should update
    expect(doc.state.global.slug).toBe("new-slug");
  });

  it("should throw if after a partial update the PHID is not valid", () => {
    // Start with bad PHID in state
    document.state.global.id = INVALID_PHID as any;
    const input: UpdateProfileInput = {
      slug: "doesnt-matter"
    };
    // Can't validate via reducer, so check with zod directly
    expect(() =>
      z.BuilderProfileStateSchema().parse({
        ...document.state,
        ...input
      })
    ).toThrow();
  });
});
