import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  id: "powerhouse/rfp",
  name: "RequestForProposals",
  extension: "",
  description:
    "An RFP (Request for Proposal) is a formal invitation issued by a client to gather tailored proposals addressing specific needs. It outlines objectives, requirements, and deadlines, enabling external parties to submit competitive solutions. ",
  author: {
    name: "powerhouse ",
    website: "",
  },
  specifications: [
    {
      version: 1,
      changeLog: [],
      state: {
        global: {
          schema:
            "type RequestForProposalsState {\n  issuer: ID!\n  code: String\n  title: String!\n  summary: String! # udpated \n  briefing: String! # updated\n  rfpCommenter: [RfpCommenter!]!\n  eligibilityCriteria: String!\n  evaluationCriteria: String!\n  budgetRange: BudgetRange! \n  contextDocuments: [ContextDocument!]!\n  status: RFPStatus!\n  proposals: [RfpProposal!]!\n  deadline: DateTime\n  tags: [String!]\n}\n\n\ntype RfpCommenter {\n  id: ID!\n  rfpCommentatorType: RFPCommentatorType! \n  agentType: RfpAgentType!\n  name: String!\n  code: String!\n  imageUrl: String\n}\n\nenum RFPCommentatorType {\n INTERNAL # client team \n EXTERNAL  # outsourced (if RGH asks BAI team)\n}\n\n\nenum RfpAgentType {\n  HUMAN\n  GROUP\n  AI\n}\n\ntype BudgetRange {\n  min: Float\n  max: Float\n  currency: String\n}\n\n\ntype ContextDocument {\n  name: String!\n  url: URL!\n}\n\nenum RFPStatus {\n  DRAFT\n  REQUEST_FOR_COMMMENTS\n  CANCELED\n  OPEN_FOR_PROPOSALS\n  AWARDED\n  NOT_AWARDED\n  CLOSED\n}\n\ntype RfpProposal {\n  id: OID! \n  title: String! \n  summary: String! \n  proposalStatus: RfpProposalStatus! \n  submittedby: OID\n  budgetEstimate: String! # a rolled-up total from the payment terms \n  paymentTerms: RfpPaymentTerm! \n}\n\nenum RfpPaymentTerm {\n  MILESTONE_BASED_FIXED_PRICE\n  MILESTONE_BASED_ADVANCE_PAYMENT\n  RETAINER_BASED\n  VARIABLE_COST\n  ESCROW\n}\n\nenum RfpProposalStatus {\n  SUBMITTED # or received from an RFP issuer POV\n  OPENED\n  UNDER_REVIEW\n  NEEDS_REVISION\n  REVISED\n  APPROVED\n  CONDITIONALLY_APPROVED #\n  REJECTED\n  WITHDRAWN\n}\n",
          initialValue:
            '"{\\n  \\"issuer\\": \\"placeholder-id\\",\\n  \\"title\\": \\"\\",\\n  \\"description\\": \\"\\",\\n  \\"rfpCommenter\\": [],\\n  \\"eligibilityCriteria\\": [],\\n  \\"evaluationCriteria\\": [],\\n  \\"budgetRange\\": {\\n    \\"min\\": null,\\n    \\"max\\": null,\\n    \\"currency\\": null\\n  },\\n  \\"contextDocuments\\": [],\\n  \\"status\\": \\"DRAFT\\",\\n  \\"proposals\\": [],\\n  \\"deadline\\": null,\\n  \\"tags\\": null\\n}"',
          examples: [],
        },
        local: {
          schema: "",
          initialValue: '""',
          examples: [],
        },
      },
      modules: [
        {
          id: "b85e13af-fd90-48bd-bea4-54c10b68a304",
          name: "rfp_state",
          description: "",
          operations: [
            {
              id: "e2a1c68c-35d8-4801-941f-ddf2c22190df",
              name: "EDIT_RFP",
              description: "",
              schema:
                "input EditRfpInput {\n  title: String\n  code: String\n  summary: String\n  briefing: String\n  eligibilityCriteria: String\n  evaluationCriteria: String\n  budgetRange: BudgetRangeInput\n  status: RFPStatusInput\n  deadline: DateTime\n  tags: [String!]\n}\n\ninput BudgetRangeInput {\n  min: Float\n  max: Float\n  currency: String\n}\n\nenum RFPStatusInput {\n  DRAFT\n  REQUEST_FOR_COMMMENTS\n  CANCELED\n  OPEN_FOR_PROPOSALS\n  AWARDED\n  NOT_AWARDED\n  CLOSED\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
        {
          id: "58153b72-6b58-4a0e-ac49-2c42494a8ba1",
          name: "contex_document",
          description: "",
          operations: [
            {
              id: "268caa5a-8957-4095-beef-26ee255e3a6e",
              name: "ADD_CONTEXT_DOCUMENT",
              description: "",
              schema:
                "input AddContextDocumentInput {\n  rfpId: OID!\n  name: String!\n  url: URL!\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "8230c407-a167-416e-abc7-f4db00b9a3a8",
              name: "REMOVE_CONTEXT_DOCUMENT",
              description: "",
              schema:
                "input RemoveContextDocumentInput {\n  rfpId: OID!\n  name: String!\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
        {
          id: "0ddd0d1d-36a5-43a2-b0f9-a9250fb34baf",
          name: "proposals",
          description: "",
          operations: [
            {
              id: "14b1d474-d0af-4270-b54b-59773953a0d2",
              name: "ADD_PROPOSAL",
              description: "",
              schema:
                "input AddProposalInput {\n  rfpId: OID!\n  id: OID!\n  title: String!\n  summary: String!\n  proposalStatus: RfpProposalStatusInput! \n  submittedby: OID\n  budgetEstimate: String!\n  paymentTerms: RfpPaymentTermInput!\n}\n\nenum RfpPaymentTermInput {\n  MILESTONE_BASED_FIXED_PRICE\n  MILESTONE_BASED_ADVANCE_PAYMENT\n  RETAINER_BASED\n  VARIABLE_COST\n  ESCROW\n}\n\nenum RfpProposalStatusInput {\n  SUBMITTED # or received from an RFP issuer POV\n  OPENED\n  UNDER_REVIEW\n  NEEDS_REVISION\n  REVISED\n  APPROVED\n  CONDITIONALLY_APPROVED #\n  REJECTED\n  WITHDRAWN\n}\n\n",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "a563e5c8-cacf-4585-ac28-91d613efb9fb",
              name: "CHANGE_PROPOSAL_STATUS",
              description: "",
              schema:
                "input ChangeProposalStatusInput {\n  proposalId: OID!\n  status: RfpProposalStatusInput!\n}\n\n",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "a97014b8-081b-40e9-b2aa-954a53e48934",
              name: "REMOVE_PROPOSAL",
              description: "",
              schema:
                "input RemoveProposalInput {\n  rfpId: OID!\n  id: OID!\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
    },
  ],
};
