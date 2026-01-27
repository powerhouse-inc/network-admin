import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc",
  },
  description: "A list of builders that a SNO can have",
  extension: "",
  id: "powerhouse/builders",
  name: "Builders",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          id: "6a2edfaa-812d-486f-86ee-9f9282e9a26c",
          name: "builders",
          description: "",
          operations: [
            {
              id: "804e9500-fe85-489d-aae3-2a0e8a6c1cb8",
              name: "ADD_BUILDER",
              description: "",
              schema: "input AddBuilderInput {\n  builderPhid: PHID!\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "42c43f0c-c3b1-484f-8a9e-1946e73f70ad",
              name: "REMOVE_BUILDER",
              description: "",
              schema: "input RemoveBuilderInput {\n  builderPhid: PHID!\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue: '{\n  "builders": []\n}',
          schema: "type BuildersState {\n  builders: [PHID!]!\n}",
        },
        local: {
          examples: [],
          initialValue: "",
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
