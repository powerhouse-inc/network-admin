import { createAction } from "document-model";
import {
  z,
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
} from "../types.js";
import {
  type SetIconAction,
  type SetLogoAction,
  type SetLogoBigAction,
  type SetWebsiteAction,
  type SetDescriptionAction,
  type SetCategoryAction,
  type SetXAction,
  type SetGithubAction,
  type SetDiscordAction,
  type SetYoutubeAction,
  type SetProfileNameAction,
} from "./actions.js";

export const setIcon = (input: SetIconInput) =>
  createAction<SetIconAction>(
    "SET_ICON",
    { ...input },
    undefined,
    z.SetIconInputSchema,
    "global",
  );

export const setLogo = (input: SetLogoInput) =>
  createAction<SetLogoAction>(
    "SET_LOGO",
    { ...input },
    undefined,
    z.SetLogoInputSchema,
    "global",
  );

export const setLogoBig = (input: SetLogoBigInput) =>
  createAction<SetLogoBigAction>(
    "SET_LOGO_BIG",
    { ...input },
    undefined,
    z.SetLogoBigInputSchema,
    "global",
  );

export const setWebsite = (input: SetWebsiteInput) =>
  createAction<SetWebsiteAction>(
    "SET_WEBSITE",
    { ...input },
    undefined,
    z.SetWebsiteInputSchema,
    "global",
  );

export const setDescription = (input: SetDescriptionInput) =>
  createAction<SetDescriptionAction>(
    "SET_DESCRIPTION",
    { ...input },
    undefined,
    z.SetDescriptionInputSchema,
    "global",
  );

export const setCategory = (input: SetCategoryInput) =>
  createAction<SetCategoryAction>(
    "SET_CATEGORY",
    { ...input },
    undefined,
    z.SetCategoryInputSchema,
    "global",
  );

export const setX = (input: SetXInput) =>
  createAction<SetXAction>(
    "SET_X",
    { ...input },
    undefined,
    z.SetXInputSchema,
    "global",
  );

export const setGithub = (input: SetGithubInput) =>
  createAction<SetGithubAction>(
    "SET_GITHUB",
    { ...input },
    undefined,
    z.SetGithubInputSchema,
    "global",
  );

export const setDiscord = (input: SetDiscordInput) =>
  createAction<SetDiscordAction>(
    "SET_DISCORD",
    { ...input },
    undefined,
    z.SetDiscordInputSchema,
    "global",
  );

export const setYoutube = (input: SetYoutubeInput) =>
  createAction<SetYoutubeAction>(
    "SET_YOUTUBE",
    { ...input },
    undefined,
    z.SetYoutubeInputSchema,
    "global",
  );

export const setProfileName = (input: SetProfileNameInput) =>
  createAction<SetProfileNameAction>(
    "SET_PROFILE_NAME",
    { ...input },
    undefined,
    z.SetProfileNameInputSchema,
    "global",
  );
