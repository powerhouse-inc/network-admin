import type { EditorModule } from "document-model";
import Editor from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/workstream"],
  config: {
    id: "workstream-editor",
    name: "Workstream Editor",
  },
};

export default module;
