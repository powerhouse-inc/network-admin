import type { BuilderProfileBuilderOperations } from "../../gen/builder/operations.js";

export const reducer: BuilderProfileBuilderOperations = {
    updateProfileOperation(state, action, dispatch) {
        state.id = action.input.id ?? state.id;
        state.slug = action.input.slug ?? state.slug;
        state.name = action.input.name ?? state.name;
        state.icon = action.input.icon ?? state.icon;
        state.description = action.input.description ?? state.description;
    }
};
