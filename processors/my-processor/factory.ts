import { type ProcessorRecord } from "document-drive";
import { type IProcessorHostModule } from "document-drive";
import { type PHDocumentHeader } from "document-model";
import { MyProcessorProcessor } from "./index.js";

export const MyProcessorProcessorFactory =
  (module: IProcessorHostModule) =>
  (driveHeader: PHDocumentHeader): ProcessorRecord[] => {
    return [
      {
        processor: new MyProcessorProcessor(module.analyticsStore),
        filter: {
          branch: ["main"],
          documentId: ["*"],
          scope: ["*"],
          documentType: ["powerhouse/workstream"],
        },
      },
    ];
  };
