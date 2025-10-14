import { type SignalDispatch } from "document-model";
import { type UpdateProfileAction } from "./actions.js";
import { type BuilderProfileState } from "../types.js";

export interface BuilderProfileBuilderOperations {
  updateProfileOperation: (
    state: BuilderProfileState,
    action: UpdateProfileAction,
    dispatch?: SignalDispatch,
  ) => void;
}
