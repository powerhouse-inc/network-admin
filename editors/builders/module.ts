import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the Todo List document type */
export const Builders: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/builders"],
  config: {
    id: "builders-editor",
    name: "builders",
  },
};
