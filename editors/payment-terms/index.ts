import type { EditorModule } from "document-model";
import Editor from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["payment-terms"],
  config: {
    id: "payment-terms-editor",
    name: "Payment Terms Editor",
  },
};

export default module;
