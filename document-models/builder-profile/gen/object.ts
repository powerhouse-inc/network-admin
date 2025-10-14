import {
  BaseDocumentClass,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { BuilderProfilePHState } from "./ph-factories.js";
import { type BuilderProfileAction } from "./actions.js";
import { reducer } from "./reducer.js";
import { createDocument } from "./utils.js";
import BuilderProfile_Builder from "./builder/object.js";

export * from "./builder/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface BuilderProfile extends BuilderProfile_Builder {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class BuilderProfile extends BaseDocumentClass<BuilderProfilePHState> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<BuilderProfilePHState>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, BuilderProfile.fileExtension, name);
  }

  public loadFromFile(path: string) {
    return super.loadFromFile(path);
  }

  static async fromFile(path: string) {
    const document = new this();
    await document.loadFromFile(path);
    return document;
  }
}

applyMixins(BuilderProfile, [BuilderProfile_Builder]);

export { BuilderProfile };
