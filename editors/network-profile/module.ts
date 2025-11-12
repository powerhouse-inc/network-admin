import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the Todo List document type */
export const NetworkProfile: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["powerhouse/network-profile"],
  config: {
    id: "network-profile-editor",
    name: "Network Profile Editor",
  },
};
