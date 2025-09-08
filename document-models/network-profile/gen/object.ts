import {
  BaseDocumentClass,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { NetworkProfilePHState } from "./ph-factories.js";
import { type NetworkProfileAction } from "./actions.js";
import { reducer } from "./reducer.js";
import { createDocument } from "./utils.js";
import NetworkProfile_NetworkProfileManagement from "./network-profile-management/object.js";

export * from "./network-profile-management/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface NetworkProfile extends NetworkProfile_NetworkProfileManagement {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class NetworkProfile extends BaseDocumentClass<NetworkProfilePHState> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<NetworkProfilePHState>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, NetworkProfile.fileExtension, name);
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

applyMixins(NetworkProfile, [NetworkProfile_NetworkProfileManagement]);

export { NetworkProfile };
