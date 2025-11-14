import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the Todo List document type */
export const PaymentTermsEditor: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["payment-terms"],
  config: {
    id: "payment-terms-editor",
    name: "Payment Terms Editor",
  },
};
