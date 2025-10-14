import { createAction } from "document-model";
import { z, type UpdateProfileInput } from "../types.js";
import { type UpdateProfileAction } from "./actions.js";

export const updateProfile = (input: UpdateProfileInput) =>
  createAction<UpdateProfileAction>(
    "UPDATE_PROFILE",
    { ...input },
    undefined,
    z.UpdateProfileInputSchema,
    "global",
  );
