import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://www.powerhouse.inc/",
  },
  description:
    "Document model for managing payment terms, milestones, and contract clauses",
  extension: "",
  id: "payment-terms",
  name: "PaymentTerms",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "",
          id: "fb44dffb-4070-4942-961b-e53bc5b7bc26",
          name: "terms",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "4cc5dda2-76d1-42c7-85ac-9bbe9a3fc76b",
              name: "SET_BASIC_TERMS",
              reducer: "",
              schema:
                "input SetBasicTermsInput {\n  proposer: String!\n  payer: String!\n  currency: PaymentCurrency!\n  paymentModel: PaymentModel!\n  totalAmount: Amount\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "586040d3-8134-49c3-8e76-f72643ae2039",
              name: "UPDATE_STATUS",
              reducer: "",
              schema:
                "input UpdateStatusInput {\n  status: PaymentTermsStatus!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "8ff785c1-9c56-4c77-9061-39fa8dc2e195",
              name: "SET_TIME_AND_MATERIALS",
              reducer: "",
              schema:
                "input SetTimeAndMaterialsInput {\n  retainerAmount: Amount\n  hourlyRate: Amount\n  variableCap: Amount\n  billingFrequency: BillingFrequency!\n  timesheetRequired: Boolean!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "5e0d4393-c915-4118-b7de-01031c0e0162",
              name: "SET_ESCROW_DETAILS",
              reducer: "",
              schema:
                "input SetEscrowDetailsInput {\n  amountHeld: Amount!\n  proofOfFundsDocumentId: String\n  releaseConditions: String!\n  escrowProvider: String\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "f0fa82ec-403f-4826-b1ac-4112d2a5bbb5",
              name: "SET_EVALUATION_TERMS",
              reducer: "",
              schema:
                "input SetEvaluationTermsInput {\n  evaluationFrequency: EvaluationFrequency!\n  evaluatorTeam: String!\n  criteria: [String!]!\n  impactsPayout: Boolean!\n  impactsReputation: Boolean!\n  commentsVisibleToClient: Boolean!\n}",
              scope: "global",
              template: "",
            },
          ],
        },
        {
          description: "",
          id: "ca5173fd-fbd1-4bad-8239-3462a0372919",
          name: "milestones",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "b13b2f0e-c280-4e6a-8688-30773e03d6ef",
              name: "ADD_MILESTONE",
              reducer: "",
              schema:
                "input AddMilestoneInput {\n  id: OID!\n  name: String!\n  amount: Amount!\n  expectedCompletionDate: Date\n  requiresApproval: Boolean!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "5117e76d-3e7d-416c-a4e1-0d68756102d1",
              name: "UPDATE_MILESTONE",
              reducer: "",
              schema:
                "input UpdateMilestoneInput {\n  id: OID!\n  name: String\n  amount: Amount\n  expectedCompletionDate: Date\n  requiresApproval: Boolean\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "332e3d52-4346-45dc-b483-952fe80a0743",
              name: "UPDATE_MILESTONE_STATUS",
              reducer: "",
              schema:
                "input UpdateMilestoneStatusInput {\n  id: OID!\n  payoutStatus: MilestonePayoutStatus!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "9e2d2d2d-4bee-4d1c-8342-1145f7e14151",
              name: "DELETE_MILESTONE",
              reducer: "",
              schema: "input DeleteMilestoneInput {\n  id: OID!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "ebc7354f-8161-45f7-9fe2-0618f1def099",
              name: "REORDER_MILESTONES",
              reducer: "",
              schema: "input ReorderMilestonesInput {\n  order: [OID!]!\n}",
              scope: "global",
              template: "",
            },
          ],
        },
        {
          description: "",
          id: "ea920162-b245-42a3-92d6-f5bd6e0cad0b",
          name: "clauses",
          operations: [
            {
              description: "",
              errors: [],
              examples: [],
              id: "c56eecc6-018f-4ca2-8813-9ec368295c0f",
              name: "ADD_BONUS_CLAUSE",
              reducer: "",
              schema:
                "input AddBonusClauseInput {\n  id: OID!\n  condition: String!\n  bonusAmount: Amount!\n  comment: String\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "1c1ebfd9-3da5-45ed-9f8a-10ec5c297730",
              name: "UPDATE_BONUS_CLAUSE",
              reducer: "",
              schema:
                "input UpdateBonusClauseInput {\n  id: OID!\n  condition: String\n  bonusAmount: Amount\n  comment: String\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "b9d8c798-902d-49e8-a15b-f3e1f554b7a5",
              name: "DELETE_BONUS_CLAUSE",
              reducer: "",
              schema: "input DeleteBonusClauseInput {\n  id: OID!\n}",
              scope: "global",
              template: "",
            },
            {
              description: "",
              errors: [],
              examples: [],
              id: "19987691-0257-4f3a-b7f3-0a328a449159",
              name: "ADD_PENALTY_CLAUSE",
              reducer: "",
              schema:
                "input AddPenaltyClauseInput {\n  id: OID!\n  condition: String!\n  deductionAmount: Amount!\n  comment: String\n}",
              scope: "global",
              template: "",
            },
            {
              id: "5d913b40-c532-4299-a8de-510e3042f20b",
              name: "UPDATE_PENALTY_CLAUSE",
              description: "",
              schema:
                "input UpdatePenaltyClauseInput {\n  id: OID!\n  condition: String\n  deductionAmount: Amount\n  comment: String\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "878a78ab-1b00-479a-ba56-6de431a102d1",
              name: "DELETE_PENALTY_CLAUSE",
              description: "",
              schema: "input DeletePenaltyClauseInput {\n  id: OID!\n}",
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
            '{\n  "status": "DRAFT",\n  "proposer": "",\n  "payer": "",\n  "currency": "USD",\n  "paymentModel": "MILESTONE",\n  "totalAmount": null,\n  "milestoneSchedule": [],\n  "timeAndMaterials": null,\n  "escrowDetails": null,\n  "evaluation": null,\n  "bonusClauses": [],\n  "penaltyClauses": []\n}',
          schema:
            "type PaymentTermsState {\n  status: PaymentTermsStatus!\n  proposer: String!\n  payer: String!\n  currency: PaymentCurrency!\n  paymentModel: PaymentModel!\n  totalAmount: Amount\n  milestoneSchedule: [Milestone!]!\n  timeAndMaterials: TimeAndMaterials\n  escrowDetails: Escrow\n  evaluation: EvaluationTerms\n  bonusClauses: [BonusClause!]!\n  penaltyClauses: [PenaltyClause!]!\n}\n\nenum PaymentTermsStatus {\n  DRAFT\n  SUBMITTED\n  ACCEPTED\n  CANCELLED\n}\n\nenum PaymentCurrency {\n  USD\n  EUR\n  GBP\n}\n\nenum PaymentModel {\n  MILESTONE\n  TIME_AND_MATERIALS\n}\n\nenum MilestonePayoutStatus {\n  PENDING\n  READY_FOR_REVIEW\n  APPROVED\n  PAID\n  REJECTED\n}\n\nenum BillingFrequency {\n  WEEKLY\n  BIWEEKLY\n  MONTHLY\n}\n\nenum EvaluationFrequency {\n  WEEKLY\n  MONTHLY\n  PER_MILESTONE\n}\n\ntype Milestone {\n  id: OID!\n  name: String!\n  amount: Amount!\n  expectedCompletionDate: Date\n  requiresApproval: Boolean!\n  payoutStatus: MilestonePayoutStatus!\n}\n\ntype TimeAndMaterials {\n  retainerAmount: Amount\n  hourlyRate: Amount\n  variableCap: Amount\n  billingFrequency: BillingFrequency!\n  timesheetRequired: Boolean!\n}\n\ntype Escrow {\n  amountHeld: Amount!\n  proofOfFundsDocumentId: String\n  releaseConditions: String!\n  escrowProvider: String\n}\n\ntype EvaluationTerms {\n  evaluationFrequency: EvaluationFrequency!\n  evaluatorTeam: String!\n  criteria: [String!]!\n  impactsPayout: Boolean!\n  impactsReputation: Boolean!\n  commentsVisibleToClient: Boolean!\n}\n\ntype BonusClause {\n  id: OID!\n  condition: String!\n  bonusAmount: Amount!\n  comment: String\n}\n\ntype PenaltyClause {\n  id: OID!\n  condition: String!\n  deductionAmount: Amount!\n  comment: String\n}",
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
