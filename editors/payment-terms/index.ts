import type { EditorModule } from "document-model";
import Editor from "./editor.js";
import type { PaymentTermsDocument } from "../../document-models/payment-terms/index.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["payment-terms"],
  config: {
    id: "payment-terms-editor",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
