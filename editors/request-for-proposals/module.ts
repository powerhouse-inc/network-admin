import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the Todo List document type */
export const RequestForProposalsEditor: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/rfp"],
  config: {
    id: "request-for-proposals-editor",
    name: "Request for Proposals Editor",
  },
};
