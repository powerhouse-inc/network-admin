import {
  type ProcessorRecord,
  type IProcessorHostModule,
} from "document-drive";
import { type RelationalDbProcessorFilter } from "document-drive";
import { type PHDocumentHeader } from "document-model";
import { WorkstreamsProcessor } from "./index.js";

export const workstreamsProcessorFactory =
  (module: IProcessorHostModule) =>
  async (driveHeader: PHDocumentHeader): Promise<ProcessorRecord[]> => {
    // Create a namespace for the processor and the provided drive id
    const namespace = WorkstreamsProcessor.getNamespace(driveHeader.id);

    // Create a namespaced db for the processor
    const store =
      await module.relationalDb.createNamespace<WorkstreamsProcessor>(
        namespace,
      );

    // Create a filter for the processor
    const filter: RelationalDbProcessorFilter = {
      branch: ["main"],
      documentId: ["*"],
      documentType: ["powerhouse/workstream", "powerhouse/document-drive"],
      scope: ["global"],
    };

    // Create the processor
    const processor = new WorkstreamsProcessor(namespace, filter, store);
    return [
      {
        processor,
        filter,
      },
    ];
  };
