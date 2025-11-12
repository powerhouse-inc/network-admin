import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the Todo List document type */
export const Workstream: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/workstream"],
  config: {
    id: "workstream-editor",
    name: "Workstream Editor",
  },
};
