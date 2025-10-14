import type { EditorModule } from "document-model";
import Editor from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/builder-profile"],
  config: {
    id: "builder-profile-editor",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};
