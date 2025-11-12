import type { PHDriveEditorConfig } from "@powerhousedao/reactor-browser";

/** Editor config for the NetworkAdmin */
export const editorConfig: PHDriveEditorConfig = {
  isDragAndDropEnabled: true,
  allowedDocumentTypes: [
    // List all document types that can be dropped
    "powerhouse/network-profile",
    "powerhouse/workstream",
    "powerhouse/scopeofwork",
    "payment-terms",
    "powerhouse/rfp",
  ],
};
