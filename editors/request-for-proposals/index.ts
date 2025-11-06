import type { EditorModule } from "document-model";
import Editor from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/rfp"],
  config: {
    id: "request-for-proposals-editor",
    name: "Request for Proposals Editor",
  },
};

export default module;
