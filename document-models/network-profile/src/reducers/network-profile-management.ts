/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { NetworkProfileNetworkProfileManagementOperations } from "../../gen/network-profile-management/operations.js";

export const reducer: NetworkProfileNetworkProfileManagementOperations = {
    setIconOperation(state, action, dispatch) {
        state.icon = action.input.icon || "";
    },
    setLogoOperation(state, action, dispatch) {
        state.logo = action.input.logo || "";
    },
    setLogoBigOperation(state, action, dispatch) {
        state.logoBig = action.input.logoBig || "";
    },
    setWebsiteOperation(state, action, dispatch) {
        state.website = action.input.website || "";
    },
    setDescriptionOperation(state, action, dispatch) {
        state.description = action.input.description || "";
    },
    setCategoryOperation(state, action, dispatch) {
        state.category = action.input.category || [];
    },
    setXOperation(state, action, dispatch) {
        state.x = action.input.x || "";
    },
    setGithubOperation(state, action, dispatch) {
        state.github = action.input.github || "";
    },
    setDiscordOperation(state, action, dispatch) {
        state.discord = action.input.discord || "";
    },
    setYoutubeOperation(state, action, dispatch) {
        state.youtube = action.input.youtube || "";
    },
    setProfileNameOperation(state, action, dispatch) {
        state.name = action.input.name || "";
    },
};
