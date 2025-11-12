// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { NetworkProfilePHState } from "./types.js";

import { networkProfileNetworkProfileManagementOperations } from "../src/reducers/network-profile-management.js";

import {
  SetIconInputSchema,
  SetLogoInputSchema,
  SetLogoBigInputSchema,
  SetWebsiteInputSchema,
  SetDescriptionInputSchema,
  SetCategoryInputSchema,
  SetXInputSchema,
  SetGithubInputSchema,
  SetDiscordInputSchema,
  SetYoutubeInputSchema,
  SetProfileNameInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<NetworkProfilePHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "SET_ICON":
      SetIconInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setIconOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_LOGO":
      SetLogoInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setLogoOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_LOGO_BIG":
      SetLogoBigInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setLogoBigOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_WEBSITE":
      SetWebsiteInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setWebsiteOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_DESCRIPTION":
      SetDescriptionInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setDescriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_CATEGORY":
      SetCategoryInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setCategoryOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_X":
      SetXInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setXOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_GITHUB":
      SetGithubInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setGithubOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_DISCORD":
      SetDiscordInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setDiscordOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_YOUTUBE":
      SetYoutubeInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setYoutubeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_PROFILE_NAME":
      SetProfileNameInputSchema().parse(action.input);
      networkProfileNetworkProfileManagementOperations.setProfileNameOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<NetworkProfilePHState>(stateReducer);
