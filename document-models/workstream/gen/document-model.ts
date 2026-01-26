import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://powerhouse.inc/",
  },
  description: "Workstream document model ",
  extension: "",
  id: "powerhouse/workstream",
  name: "Workstream",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "",
          id: "170d41a8-9bb6-47d0-9036-ac7f567604f6",
          name: "workstream",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "56c63435-ff69-4c52-a2ab-190d68d8cf54",
              name: "EDIT_WORKSTREAM",
              reducer: "",
              schema:
                "input EditWorkstreamInput {\n  code: String\n  title: String\n  status: WorkstreamStatusInput\n  sowId: PHID\n  paymentTerms: PHID\n}\n\nenum WorkstreamStatusInput {\n  RFP_DRAFT\n  PREWORK_RFC # RFP status change to RFC\n  RFP_CANCELLED\n  OPEN_FOR_PROPOSALS\n  PROPOSAL_SUBMITTED\n  NOT_AWARDED\n  AWARDED \n  IN_PROGRESS\n  FINISHED\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "0f58088b-3552-4af2-863b-e19195e08f06",
              name: "EDIT_CLIENT_INFO",
              reducer: "",
              schema:
                "input EditClientInfoInput {\n  clientId: PHID!\n  name: String\n  icon: String\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "d322df22-d4d9-4c0a-a072-2ffbde2ed2a5",
              name: "SET_REQUEST_FOR_PROPOSAL",
              reducer: "",
              schema:
                "input SetRequestForProposalInput {\n  rfpId: PHID!\n  title: String!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "0717e3d3-4c3d-42ca-a71d-d3e8f62a9f6e",
              name: "ADD_PAYMENT_REQUEST",
              reducer: "",
              schema: "input AddPaymentRequestInput {\n  id: PHID!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "8f369930-67f3-46df-a715-758d8d2ef4c7",
              name: "REMOVE_PAYMENT_REQUEST",
              reducer: "",
              schema: "input RemovePaymentRequestInput {\n  id: PHID!\n}",
              scope: "global",
              template: "",
            },
          ],
        },
        {
          description: "",
          id: "757d1831-10d3-4b41-8c14-4068465ca493",
          name: "proposals",
          operations: [
            {
              id: "8a59df49-18e4-422f-babe-9b52f860cadc",
              name: "EDIT_INITIAL_PROPOSAL",
              description: "",
              schema:
                'input EditInitialProposalInput {\n  "Add your inputs here"\n  _placeholder: String\n}',
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
          initialValue:
            '{\n  "code": null,\n  "title": null,\n  "status": "RFP_DRAFT",\n  "client": null,\n  "rfp": null,\n  "initialProposal": null,\n  "alternativeProposals": [],\n  "sow": null,\n  "paymentTerms": null,\n  "paymentRequests": []\n}',
          schema:
            "type WorkstreamState {\n  code: String\n  title: String\n  status: WorkstreamStatus!\n  client: ClientInfo # eventually tie it to the AID?\n  rfp: RFP\n  initialProposal: Proposal\n  alternativeProposals: [Proposal!]!\n  sow: PHID\n  paymentTerms: PHID\n  paymentRequests: [PHID!]!\n \n}\n\nenum WorkstreamStatus {\n  RFP_DRAFT\n  PREWORK_RFC # RFP status change to RFC\n  RFP_CANCELLED\n  OPEN_FOR_PROPOSALS\n  PROPOSAL_SUBMITTED\n  NOT_AWARDED\n  AWARDED \n  IN_PROGRESS\n  FINISHED\n}\n\ntype Proposal {\n  id: ID!\n  sow: PHID! # a link with a fixed label (i.e, sow)\n  paymentTerms: PHID! # a link with a fixed label (i.e., payment terms)\n  status: ProposalStatus!\n  author: ProposalAuthor! # eventually an AID\n}\n\nenum ProposalStatus {\n  DRAFT\n  SUBMITTED\n  ACCEPTED\n  REJECTED\n}\n\ntype ClientInfo {\n id: PHID!\n name: String\n icon: URL\n}\n\ntype RFP {\n id: PHID!\n title: String!\n}\n\ntype ProposalAuthor {\n id: PHID!\n name: String\n icon: URL\n}\n  ",
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
