import { type Action } from "document-model";
import type { UpdateProfileInput } from "../types.js";

export type UpdateProfileAction = Action & {
  type: "UPDATE_PROFILE";
  input: UpdateProfileInput;
};

export type BuilderProfileBuilderAction = UpdateProfileAction;
