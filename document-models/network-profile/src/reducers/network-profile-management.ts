import type { SetIconAction } from "../../gen/network-profile-management/actions.js";
import type { NetworkProfileNetworkProfileManagementOperations } from "../../gen/network-profile-management/operations.js";
import type { NetworkProfileState, } from "../../gen/types.js";

export const networkProfileNetworkProfileManagementOperations: NetworkProfileNetworkProfileManagementOperations = {
    setIconOperation(state: NetworkProfileState, action: SetIconAction) {
        state.icon = action.input.icon
    },
    setLogoOperation(state, action) {
        state.logo = action.input.logo;
    },
    setLogoBigOperation(state, action) {
        state.logoBig = action.input.logoBig;
    },
    setWebsiteOperation(state, action) {
        state.website = action.input.website || null;
    },
    setDescriptionOperation(state, action) {
        state.description = action.input.description;
    },
    setCategoryOperation(state, action) {
        state.category = action.input.category || null;
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
        state.name = action.input.name;
    }
};
