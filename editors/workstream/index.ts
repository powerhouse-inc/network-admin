import type { EditorModule } from "document-model";
import Editor from "./editor.js";
import type { WorkstreamDocument } from "../../document-models/workstream/index.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/workstream"],
  config: {
    id: "editor-id",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
