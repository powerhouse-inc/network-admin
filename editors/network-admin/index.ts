import { type DriveEditorModule } from "@powerhousedao/reactor-browser";
import Editor from "./editor.js";

export const module: DriveEditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/document-drive"],
  config: {
    id: "network-admin",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
    documentTypes: [
      // List all document types that can be dropped
      "powerhouse/network-profile",
      "powerhouse/workstream",
      "powerhouse/scopeofwork",
      "powerhouse/rfp",
      "payment-terms",
    ],
    dragAndDrop: {
      enabled: true, // Enable drag-and-drop functionality
    },
  },
};

export default module;
