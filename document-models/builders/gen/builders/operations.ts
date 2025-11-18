import { type SignalDispatch } from "document-model";
import { type AddBuilderAction, type RemoveBuilderAction } from "./actions.js";
import { type BuildersState } from "../types.js";

export interface BuildersBuildersOperations {
  addBuilderOperation: (
    state: BuildersState,
    action: AddBuilderAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeBuilderOperation: (
    state: BuildersState,
    action: RemoveBuilderAction,
    dispatch?: SignalDispatch,
  ) => void;
}
