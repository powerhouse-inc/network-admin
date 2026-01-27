import type { PHDriveEditorConfig } from "@powerhousedao/reactor-browser";

/** Editor config for the <%= pascalCaseDriveEditorName %> */
export const editorConfig: PHDriveEditorConfig = {
  isDragAndDropEnabled: true,
  allowedDocumentTypes: [
    "powerhouse/network-profile",
    "powerhouse/workstream",
    "powerhouse/scopeofwork",
    "payment-terms",
    "powerhouse/rfp",
  ],
};
