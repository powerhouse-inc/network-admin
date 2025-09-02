import { type SignalDispatch } from "document-model";
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
import { type NetworkProfileState } from "../types.js";

export interface NetworkProfileNetworkProfileManagementOperations {
  setIconOperation: (
    state: NetworkProfileState,
    action: SetIconAction,
    dispatch?: SignalDispatch,
  ) => void;
  setLogoOperation: (
    state: NetworkProfileState,
    action: SetLogoAction,
    dispatch?: SignalDispatch,
  ) => void;
  setLogoBigOperation: (
    state: NetworkProfileState,
    action: SetLogoBigAction,
    dispatch?: SignalDispatch,
  ) => void;
  setWebsiteOperation: (
    state: NetworkProfileState,
    action: SetWebsiteAction,
    dispatch?: SignalDispatch,
  ) => void;
  setDescriptionOperation: (
    state: NetworkProfileState,
    action: SetDescriptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  setCategoryOperation: (
    state: NetworkProfileState,
    action: SetCategoryAction,
    dispatch?: SignalDispatch,
  ) => void;
  setXOperation: (
    state: NetworkProfileState,
    action: SetXAction,
    dispatch?: SignalDispatch,
  ) => void;
  setGithubOperation: (
    state: NetworkProfileState,
    action: SetGithubAction,
    dispatch?: SignalDispatch,
  ) => void;
  setDiscordOperation: (
    state: NetworkProfileState,
    action: SetDiscordAction,
    dispatch?: SignalDispatch,
  ) => void;
  setYoutubeOperation: (
    state: NetworkProfileState,
    action: SetYoutubeAction,
    dispatch?: SignalDispatch,
  ) => void;
  setProfileNameOperation: (
    state: NetworkProfileState,
    action: SetProfileNameAction,
    dispatch?: SignalDispatch,
  ) => void;
}
