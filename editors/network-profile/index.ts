import type { EditorModule } from "document-model";
import Editor from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/network-profile"],
  config: {
    id: "network-profile-editor",
    name: "Network Profile Editor",
  },
};

export default module;
