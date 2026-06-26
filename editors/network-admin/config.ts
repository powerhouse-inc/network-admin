import type { PHAppConfig } from "@powerhousedao/reactor-browser";

/** Editor config for the <%= pascalCaseDriveEditorName %> */
export const editorConfig: PHAppConfig = {
  isDragAndDropEnabled: true,
  allowedDocumentTypes: [
    "powerhouse/network-profile",
    "powerhouse/workstream",
    "powerhouse/scopeofwork",
    "payment-terms",
    "powerhouse/rfp",
  ],
};
