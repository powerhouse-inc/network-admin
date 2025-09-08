// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { NetworkProfilePHState } from "./ph-factories.js";
import { z } from "./types.js";

import { reducer as NetworkProfileManagementReducer } from "../src/reducers/network-profile-management.js";

export const stateReducer: StateReducer<NetworkProfilePHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "SET_ICON":
      z.SetIconInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setIconOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_LOGO":
      z.SetLogoInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setLogoOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_LOGO_BIG":
      z.SetLogoBigInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setLogoBigOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_WEBSITE":
      z.SetWebsiteInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setWebsiteOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_DESCRIPTION":
      z.SetDescriptionInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setDescriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_CATEGORY":
      z.SetCategoryInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setCategoryOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_X":
      z.SetXInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setXOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_GITHUB":
      z.SetGithubInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setGithubOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_DISCORD":
      z.SetDiscordInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setDiscordOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_YOUTUBE":
      z.SetYoutubeInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setYoutubeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_PROFILE_NAME":
      z.SetProfileNameInputSchema().parse(action.input);
      NetworkProfileManagementReducer.setProfileNameOperation(
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
