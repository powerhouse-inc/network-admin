import type { NetworkProfileNetworkProfileManagementOperations } from "@powerhousedao/network-admin/document-models/network-profile/v1";

export const networkProfileNetworkProfileManagementOperations: NetworkProfileNetworkProfileManagementOperations =
  {
    setIconOperation(state, action) {
      state.icon = action.input.icon || "";
    },
    setLogoOperation(state, action) {
      state.logo = action.input.logo || "";
    },
    setLogoBigOperation(state, action) {
      state.logoBig = action.input.logoBig || "";
    },
    setWebsiteOperation(state, action) {
      state.website = action.input.website || "";
    },
    setDescriptionOperation(state, action) {
      state.description = action.input.description || "";
    },
    setCategoryOperation(state, action) {
      state.category = action.input.category;
    },
    setXOperation(state, action) {
      state.x = action.input.x || null;
    },
    setGithubOperation(state, action) {
      state.github = action.input.github || null;
    },
    setDiscordOperation(state, action) {
      state.discord = action.input.discord || null;
    },
    setYoutubeOperation(state, action) {
      state.youtube = action.input.youtube || null;
    },
    setProfileNameOperation(state, action) {
      state.name = action.input.name || "";
    },
  };
