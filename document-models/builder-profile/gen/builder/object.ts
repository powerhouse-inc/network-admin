import { BaseDocumentClass } from "document-model";
import { BuilderProfilePHState } from "../ph-factories.js";
import { type UpdateProfileInput } from "../types.js";
import { updateProfile } from "./creators.js";
import { type BuilderProfileAction } from "../actions.js";

export default class BuilderProfile_Builder extends BaseDocumentClass<BuilderProfilePHState> {
  public updateProfile(input: UpdateProfileInput) {
    return this.dispatch(updateProfile(input));
  }
}
