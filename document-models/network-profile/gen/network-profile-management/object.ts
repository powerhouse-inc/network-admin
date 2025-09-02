import { BaseDocumentClass } from "document-model";
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
  type NetworkProfileState,
  type NetworkProfileLocalState,
} from "../types.js";
import {
  setIcon,
  setLogo,
  setLogoBig,
  setWebsite,
  setDescription,
  setCategory,
  setX,
  setGithub,
  setDiscord,
  setYoutube,
  setProfileName,
} from "./creators.js";
import { type NetworkProfileAction } from "../actions.js";

export default class NetworkProfile_NetworkProfileManagement extends BaseDocumentClass<
  NetworkProfileState,
  NetworkProfileLocalState,
  NetworkProfileAction
> {
  public setIcon(input: SetIconInput) {
    return this.dispatch(setIcon(input));
  }

  public setLogo(input: SetLogoInput) {
    return this.dispatch(setLogo(input));
  }

  public setLogoBig(input: SetLogoBigInput) {
    return this.dispatch(setLogoBig(input));
  }

  public setWebsite(input: SetWebsiteInput) {
    return this.dispatch(setWebsite(input));
  }

  public setDescription(input: SetDescriptionInput) {
    return this.dispatch(setDescription(input));
  }

  public setCategory(input: SetCategoryInput) {
    return this.dispatch(setCategory(input));
  }

  public setX(input: SetXInput) {
    return this.dispatch(setX(input));
  }

  public setGithub(input: SetGithubInput) {
    return this.dispatch(setGithub(input));
  }

  public setDiscord(input: SetDiscordInput) {
    return this.dispatch(setDiscord(input));
  }

  public setYoutube(input: SetYoutubeInput) {
    return this.dispatch(setYoutube(input));
  }

  public setProfileName(input: SetProfileNameInput) {
    return this.dispatch(setProfileName(input));
  }
}
