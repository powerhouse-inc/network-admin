/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import utils from "../../gen/utils.js";
import {
  type SetIconInput,
  type SetLogoInput,
  type SetLogoBigInput,
  type SetWebsiteInput,
  type SetDescriptionInput,
  type SetCategoryInput,
  type SetXInput,
  type SetGithubInput,
  type SetDiscordInput,
  type SetYoutubeInput,
  type SetProfileNameInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/network-profile-management/creators.js";
import type { NetworkProfileDocument } from "../../gen/types.js";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe("NetworkProfileManagement Operations", () => {
  let document: NetworkProfileDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle setIcon operation", () => {
    const input: SetIconInput = { icon: "https://example.com/icon.png" };

    const updatedDocument = reducer(document, creators.setIcon(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_ICON");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.icon).toBe(input.icon);
  });
  it("should handle setLogo operation", () => {
    const input: SetLogoInput = { logo: "https://example.com/logo.png" };

    const updatedDocument = reducer(document, creators.setLogo(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_LOGO");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.logo).toBe(input.logo);
  });
  it("should handle setLogoBig operation", () => {
    const input: SetLogoBigInput = { logoBig: "https://example.com/logo-big.png" };

    const updatedDocument = reducer(document, creators.setLogoBig(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_LOGO_BIG");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.logoBig).toBe(input.logoBig);
  });
  it("should handle setWebsite operation", () => {
    const input: SetWebsiteInput = { website: "https://example.com" };

    const updatedDocument = reducer(document, creators.setWebsite(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_WEBSITE");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.website).toBe(input.website);
  });

  it("should handle setWebsite operation with null value", () => {
    const input: SetWebsiteInput = { website: null };

    const updatedDocument = reducer(document, creators.setWebsite(input));

    expect(updatedDocument.state.global.website).toBe(null);
  });
  it("should handle setDescription operation", () => {
    const input: SetDescriptionInput = { description: "A network for DeFi enthusiasts" };

    const updatedDocument = reducer(document, creators.setDescription(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_DESCRIPTION");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.description).toBe(input.description);
  });
  it("should handle setCategory operation", () => {
    const input: SetCategoryInput = { category: ["DEFI", "CRYPTO"] };

    const updatedDocument = reducer(document, creators.setCategory(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_CATEGORY");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.category).toEqual(input.category);
  });

  it("should handle setCategory operation with empty array", () => {
    const input: SetCategoryInput = { category: [] };

    const updatedDocument = reducer(document, creators.setCategory(input));

    expect(updatedDocument.state.global.category).toEqual([]);
  });
  it("should handle setX operation", () => {
    const input: SetXInput = { x: "@example_network" };

    const updatedDocument = reducer(document, creators.setX(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_X");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.x).toBe(input.x);
  });

  it("should handle setX operation with null value", () => {
    const input: SetXInput = { x: null };

    const updatedDocument = reducer(document, creators.setX(input));

    expect(updatedDocument.state.global.x).toBe(null);
  });
  it("should handle setGithub operation", () => {
    const input: SetGithubInput = { github: "example-network" };

    const updatedDocument = reducer(document, creators.setGithub(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_GITHUB");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.github).toBe(input.github);
  });

  it("should handle setGithub operation with null value", () => {
    const input: SetGithubInput = { github: null };

    const updatedDocument = reducer(document, creators.setGithub(input));

    expect(updatedDocument.state.global.github).toBe(null);
  });
  it("should handle setDiscord operation", () => {
    const input: SetDiscordInput = { discord: "https://discord.gg/example" };

    const updatedDocument = reducer(document, creators.setDiscord(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_DISCORD");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.discord).toBe(input.discord);
  });

  it("should handle setDiscord operation with null value", () => {
    const input: SetDiscordInput = { discord: null };

    const updatedDocument = reducer(document, creators.setDiscord(input));

    expect(updatedDocument.state.global.discord).toBe(null);
  });
  it("should handle setYoutube operation", () => {
    const input: SetYoutubeInput = { youtube: "https://youtube.com/@example" };

    const updatedDocument = reducer(document, creators.setYoutube(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_YOUTUBE");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.youtube).toBe(input.youtube);
  });

  it("should handle setYoutube operation with null value", () => {
    const input: SetYoutubeInput = { youtube: null };

    const updatedDocument = reducer(document, creators.setYoutube(input));

    expect(updatedDocument.state.global.youtube).toBe(null);
  });
  it("should handle setProfileName operation", () => {
    const input: SetProfileNameInput = { name: "Example Network" };

    const updatedDocument = reducer(document, creators.setProfileName(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect((updatedDocument.operations.global[0] as any).type).toBe("SET_PROFILE_NAME");
    expect((updatedDocument.operations.global[0] as any).input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
    expect(updatedDocument.state.global.name).toBe(input.name);
  });

  it("should handle multiple operations in sequence", () => {
    const nameInput: SetProfileNameInput = { name: "Test Network" };
    const descInput: SetDescriptionInput = { description: "A test network" };
    const categoryInput: SetCategoryInput = { category: ["DEFI"] };

    let updatedDocument = reducer(document, creators.setProfileName(nameInput));
    updatedDocument = reducer(updatedDocument, creators.setDescription(descInput));
    updatedDocument = reducer(updatedDocument, creators.setCategory(categoryInput));

    expect(updatedDocument.operations.global).toHaveLength(3);
    expect(updatedDocument.state.global.name).toBe(nameInput.name);
    expect(updatedDocument.state.global.description).toBe(descInput.description);
    expect(updatedDocument.state.global.category).toEqual(categoryInput.category);
  });

  it("should maintain immutability when updating state", () => {
    const input: SetProfileNameInput = { name: "New Name" };
    const originalState = { ...document.state.global };

    const updatedDocument = reducer(document, creators.setProfileName(input));

    expect(document.state.global).toEqual(originalState);
    expect(updatedDocument.state.global.name).toBe(input.name);
    expect(updatedDocument.state.global.name).not.toBe(document.state.global.name);
  });
});
