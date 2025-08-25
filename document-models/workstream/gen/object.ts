import {
  BaseDocumentClass,
  type BaseStateFromDocument,
  type PartialState,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import {
  type WorkstreamState,
  type WorkstreamLocalState,
  type WorkstreamDocument,
} from "./types.js";
import { type WorkstreamAction } from "./actions.js";
import { reducer } from "./reducer.js";
import utils from "./utils.js";
import Workstream_Workstream from "./workstream/object.js";
import Workstream_Proposals from "./proposals/object.js";

export * from "./workstream/object.js";
export * from "./proposals/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Workstream extends Workstream_Workstream, Workstream_Proposals {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Workstream extends BaseDocumentClass<
  WorkstreamState,
  WorkstreamLocalState,
  WorkstreamAction
> {
  static fileExtension = "";

  constructor(
    initialState?: Partial<BaseStateFromDocument<WorkstreamDocument>>,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, utils.createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, Workstream.fileExtension, name);
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

applyMixins(Workstream, [Workstream_Workstream, Workstream_Proposals]);

export { Workstream };
