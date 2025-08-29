import type { DocumentModelState } from "document-model";

export const documentModel: DocumentModelState = {
  author: {
    name: "Powerhouse",
    website: "https://www.powerhouse.inc/",
  },
  description:
    "Document model for managing payment terms, milestones, and contract clauses",
  extension: "pterms",
  id: "payment-terms",
  name: "Payment Terms",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "Core payment terms operations",
          id: "terms-module",
          name: "terms",
          operations: [
            {
              description: "Set the basic payment terms information",
              errors: [],
              examples: [],
              id: "set-basic-terms-op",
              name: "SET_BASIC_TERMS",
              reducer:
                "state.proposer = action.input.proposer;\nstate.payer = action.input.payer;\nstate.currency = action.input.currency;\nstate.paymentModel = action.input.paymentModel;\nstate.totalAmount = action.input.totalAmount || null;",
              schema:
                "input SetBasicTermsInput {\n  proposer: String!\n  payer: String!\n  currency: PaymentCurrency!\n  paymentModel: PaymentModel!\n  totalAmount: Amount\n}",
              scope: "global",
              template: "Set the basic payment terms information",
            },
            {
              description: "Update the payment terms status",
              errors: [],
              examples: [],
              id: "update-status-op",
              name: "UPDATE_STATUS",
              reducer: "state.status = action.input.status;",
              schema:
                "input UpdateStatusInput {\n  status: PaymentTermsStatus!\n}",
              scope: "global",
              template: "Update the payment terms status",
            },
            {
              description: "Configure cost and materials payment terms",
              errors: [],
              examples: [],
              id: "set-time-materials-op",
              name: "SET_COST_AND_MATERIALS",
              reducer:
                "state.costAndMaterials = {\n  hourlyRate: action.input.hourlyRate || null,\n  variableCap: action.input.variableCap || null,\n  billingFrequency: action.input.billingFrequency,\n  timesheetRequired: action.input.timesheetRequired\n};",
              schema:
                "input SetCostAndMaterialsInput {\n  hourlyRate: Amount\n  variableCap: Amount\n  billingFrequency: BillingFrequency!\n  timesheetRequired: Boolean!\n}",
              scope: "global",
              template: "Configure time and materials payment terms",
            },
            {
              description: "Configure escrow payment details",
              errors: [],
              examples: [],
              id: "set-escrow-op",
              name: "SET_ESCROW_DETAILS",
              reducer:
                "state.escrowDetails = {\n  amountHeld: action.input.amountHeld,\n  proofOfFundsDocumentId: action.input.proofOfFundsDocumentId || null,\n  releaseConditions: action.input.releaseConditions,\n  escrowProvider: action.input.escrowProvider || null\n};",
              schema:
                "input SetEscrowDetailsInput {\n  amountHeld: Amount!\n  proofOfFundsDocumentId: String\n  releaseConditions: String!\n  escrowProvider: String\n}",
              scope: "global",
              template: "Configure escrow payment details",
            },
            {
              description: "Set evaluation terms for the payment",
              errors: [],
              examples: [],
              id: "set-evaluation-op",
              name: "SET_EVALUATION_TERMS",
              reducer:
                "state.evaluation = {\n  evaluationFrequency: action.input.evaluationFrequency,\n  evaluatorTeam: action.input.evaluatorTeam,\n  criteria: action.input.criteria,\n  impactsPayout: action.input.impactsPayout,\n  impactsReputation: action.input.impactsReputation,\n  commentsVisibleToClient: action.input.commentsVisibleToClient\n};",
              schema:
                "input SetEvaluationTermsInput {\n  evaluationFrequency: EvaluationFrequency!\n  evaluatorTeam: String!\n  criteria: [String!]!\n  impactsPayout: Boolean!\n  impactsReputation: Boolean!\n  commentsVisibleToClient: Boolean!\n}",
              scope: "global",
              template: "Set evaluation terms for the payment",
            },
            {
              description: "Configure retainer payment terms",
              errors: [],
              examples: [],
              id: "set-retainer-op",
              name: "SET_RETAINER_DETAILS",
              reducer:
                "state.retainerDetails = {\n  retainerAmount: action.input.retainerAmount,\n  billingFrequency: action.input.billingFrequency,\n  startDate: action.input.startDate,\n  endDate: action.input.endDate || null,\n  autoRenew: action.input.autoRenew,\n  servicesIncluded: action.input.servicesIncluded\n};",
              schema:
                "input SetRetainerDetailsInput {\n  retainerAmount: Amount!\n  billingFrequency: BillingFrequency!\n  startDate: Date!\n  endDate: Date\n  autoRenew: Boolean!\n  servicesIncluded: String!\n}",
              scope: "global",
              template: "Configure retainer payment terms",
            },
          ],
        },
        {
          description: "Milestone management operations",
          id: "milestones-module",
          name: "milestones",
          operations: [
            {
              description: "Add a new milestone to the payment schedule",
              errors: [
                {
                  code: "DUPLICATE_MILESTONE_ID",
                  description: "A milestone with this ID already exists",
                  id: "duplicate-milestone-id",
                  name: "DuplicateMilestoneIdError",
                  template: "",
                },
              ],
              examples: [],
              id: "add-milestone-op",
              name: "ADD_MILESTONE",
              reducer:
                'const existingIndex = state.milestoneSchedule.findIndex(m => m.id === action.input.id);\nif (existingIndex !== -1) {\n  throw new DuplicateMilestoneIdError(`Milestone with ID ${action.input.id} already exists`);\n}\n\nconst newMilestone = {\n  id: action.input.id,\n  name: action.input.name,\n  amount: action.input.amount,\n  expectedCompletionDate: action.input.expectedCompletionDate || null,\n  requiresApproval: action.input.requiresApproval,\n  payoutStatus: "PENDING" as "PENDING"\n};\n\nstate.milestoneSchedule.push(newMilestone);',
              schema:
                "input AddMilestoneInput {\n  id: OID!\n  name: String!\n  amount: Amount!\n  expectedCompletionDate: Date\n  requiresApproval: Boolean!\n}",
              scope: "global",
              template: "Add a new milestone to the payment schedule",
            },
            {
              description: "Update milestone details",
              errors: [
                {
                  code: "MILESTONE_NOT_FOUND",
                  description: "Milestone with the specified ID was not found",
                  id: "milestone-not-found-update",
                  name: "MilestoneNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "update-milestone-op",
              name: "UPDATE_MILESTONE",
              reducer:
                "const milestoneIndex = state.milestoneSchedule.findIndex(m => m.id === action.input.id);\nif (milestoneIndex === -1) {\n  throw new MilestoneNotFoundError(`Milestone with ID ${action.input.id} not found`);\n}\n\nconst milestone = state.milestoneSchedule[milestoneIndex];\nif (action.input.name) milestone.name = action.input.name;\nif (action.input.amount) milestone.amount = action.input.amount;\nif (action.input.expectedCompletionDate !== undefined) milestone.expectedCompletionDate = action.input.expectedCompletionDate || null;\nif (action.input.requiresApproval !== undefined && action.input.requiresApproval !== null) milestone.requiresApproval = action.input.requiresApproval;",
              schema:
                "input UpdateMilestoneInput {\n  id: OID!\n  name: String\n  amount: Amount\n  expectedCompletionDate: Date\n  requiresApproval: Boolean\n}",
              scope: "global",
              template: "Update milestone details",
            },
            {
              description: "Update milestone payout status",
              errors: [
                {
                  code: "MILESTONE_NOT_FOUND",
                  description: "Milestone with the specified ID was not found",
                  id: "milestone-not-found-status",
                  name: "MilestoneNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "update-milestone-status-op",
              name: "UPDATE_MILESTONE_STATUS",
              reducer:
                "const milestoneIndex = state.milestoneSchedule.findIndex(m => m.id === action.input.id);\nif (milestoneIndex === -1) {\n  throw new MilestoneNotFoundError(`Milestone with ID ${action.input.id} not found`);\n}\n\nstate.milestoneSchedule[milestoneIndex].payoutStatus = action.input.payoutStatus;",
              schema:
                "input UpdateMilestoneStatusInput {\n  id: OID!\n  payoutStatus: MilestonePayoutStatus!\n}",
              scope: "global",
              template: "Update milestone payout status",
            },
            {
              description: "Remove a milestone from the schedule",
              errors: [
                {
                  code: "MILESTONE_NOT_FOUND",
                  description: "Milestone with the specified ID was not found",
                  id: "milestone-not-found-delete",
                  name: "MilestoneNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "delete-milestone-op",
              name: "DELETE_MILESTONE",
              reducer:
                "const milestoneIndex = state.milestoneSchedule.findIndex(m => m.id === action.input.id);\nif (milestoneIndex === -1) {\n  throw new MilestoneNotFoundError(`Milestone with ID ${action.input.id} not found`);\n}\n\nstate.milestoneSchedule.splice(milestoneIndex, 1);",
              schema: "input DeleteMilestoneInput {\n  id: OID!\n}",
              scope: "global",
              template: "Remove a milestone from the schedule",
            },
            {
              description: "Reorder milestones in the schedule",
              errors: [],
              examples: [],
              id: "reorder-milestones-op",
              name: "REORDER_MILESTONES",
              reducer:
                "const reorderedMilestones = [];\nfor (const id of action.input.order) {\n  const milestone = state.milestoneSchedule.find(m => m.id === id);\n  if (milestone) {\n    reorderedMilestones.push(milestone);\n  }\n}\nstate.milestoneSchedule = reorderedMilestones;",
              schema: "input ReorderMilestonesInput {\n  order: [OID!]!\n}",
              scope: "global",
              template: "Reorder milestones in the schedule",
            },
          ],
        },
        {
          description: "Bonus and penalty clause operations",
          id: "clauses-module",
          name: "clauses",
          operations: [
            {
              description: "Add a new bonus clause",
              errors: [
                {
                  code: "DUPLICATE_BONUS_CLAUSE_ID",
                  description: "A bonus clause with this ID already exists",
                  id: "duplicate-bonus-clause-id",
                  name: "DuplicateBonusClauseIdError",
                  template: "",
                },
              ],
              examples: [],
              id: "add-bonus-clause-op",
              name: "ADD_BONUS_CLAUSE",
              reducer:
                "const existingIndex = state.bonusClauses.findIndex(c => c.id === action.input.id);\nif (existingIndex !== -1) {\n  throw new DuplicateBonusClauseIdError(`Bonus clause with ID ${action.input.id} already exists`);\n}\n\nconst newClause = {\n  id: action.input.id,\n  condition: action.input.condition,\n  bonusAmount: action.input.bonusAmount,\n  comment: action.input.comment || null\n};\n\nstate.bonusClauses.push(newClause);",
              schema:
                "input AddBonusClauseInput {\n  id: OID!\n  condition: String!\n  bonusAmount: Amount!\n  comment: String\n}",
              scope: "global",
              template: "Add a new bonus clause",
            },
            {
              description: "Update bonus clause details",
              errors: [
                {
                  code: "BONUS_CLAUSE_NOT_FOUND",
                  description:
                    "Bonus clause with the specified ID was not found",
                  id: "bonus-clause-not-found",
                  name: "BonusClauseNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "update-bonus-clause-op",
              name: "UPDATE_BONUS_CLAUSE",
              reducer:
                "const clauseIndex = state.bonusClauses.findIndex(c => c.id === action.input.id);\nif (clauseIndex === -1) {\n  throw new BonusClauseNotFoundError(`Bonus clause with ID ${action.input.id} not found`);\n}\n\nconst clause = state.bonusClauses[clauseIndex];\nif (action.input.condition) clause.condition = action.input.condition;\nif (action.input.bonusAmount) clause.bonusAmount = action.input.bonusAmount;\nif (action.input.comment !== undefined) clause.comment = action.input.comment || null;",
              schema:
                "input UpdateBonusClauseInput {\n  id: OID!\n  condition: String\n  bonusAmount: Amount\n  comment: String\n}",
              scope: "global",
              template: "Update bonus clause details",
            },
            {
              description: "Remove a bonus clause",
              errors: [
                {
                  code: "BONUS_CLAUSE_NOT_FOUND",
                  description:
                    "Bonus clause with the specified ID was not found",
                  id: "bonus-clause-not-found-delete",
                  name: "BonusClauseNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "delete-bonus-clause-op",
              name: "DELETE_BONUS_CLAUSE",
              reducer:
                "const clauseIndex = state.bonusClauses.findIndex(c => c.id === action.input.id);\nif (clauseIndex === -1) {\n  throw new BonusClauseNotFoundError(`Bonus clause with ID ${action.input.id} not found`);\n}\n\nstate.bonusClauses.splice(clauseIndex, 1);",
              schema: "input DeleteBonusClauseInput {\n  id: OID!\n}",
              scope: "global",
              template: "Remove a bonus clause",
            },
            {
              description: "Add a new penalty clause",
              errors: [
                {
                  code: "DUPLICATE_PENALTY_CLAUSE_ID",
                  description: "A penalty clause with this ID already exists",
                  id: "duplicate-penalty-clause-id",
                  name: "DuplicatePenaltyClauseIdError",
                  template: "",
                },
              ],
              examples: [],
              id: "add-penalty-clause-op",
              name: "ADD_PENALTY_CLAUSE",
              reducer:
                "const existingIndex = state.penaltyClauses.findIndex(c => c.id === action.input.id);\nif (existingIndex !== -1) {\n  throw new DuplicatePenaltyClauseIdError(`Penalty clause with ID ${action.input.id} already exists`);\n}\n\nconst newClause = {\n  id: action.input.id,\n  condition: action.input.condition,\n  deductionAmount: action.input.deductionAmount,\n  comment: action.input.comment || null\n};\n\nstate.penaltyClauses.push(newClause);",
              schema:
                "input AddPenaltyClauseInput {\n  id: OID!\n  condition: String!\n  deductionAmount: Amount!\n  comment: String\n}",
              scope: "global",
              template: "Add a new penalty clause",
            },
            {
              description: "Update penalty clause details",
              errors: [
                {
                  code: "PENALTY_CLAUSE_NOT_FOUND",
                  description:
                    "Penalty clause with the specified ID was not found",
                  id: "penalty-clause-not-found",
                  name: "PenaltyClauseNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "update-penalty-clause-op",
              name: "UPDATE_PENALTY_CLAUSE",
              reducer:
                "const clauseIndex = state.penaltyClauses.findIndex(c => c.id === action.input.id);\nif (clauseIndex === -1) {\n  throw new PenaltyClauseNotFoundError(`Penalty clause with ID ${action.input.id} not found`);\n}\n\nconst clause = state.penaltyClauses[clauseIndex];\nif (action.input.condition) clause.condition = action.input.condition;\nif (action.input.deductionAmount) clause.deductionAmount = action.input.deductionAmount;\nif (action.input.comment !== undefined) clause.comment = action.input.comment || null;",
              schema:
                "input UpdatePenaltyClauseInput {\n  id: OID!\n  condition: String\n  deductionAmount: Amount\n  comment: String\n}",
              scope: "global",
              template: "Update penalty clause details",
            },
            {
              description: "Remove a penalty clause",
              errors: [
                {
                  code: "PENALTY_CLAUSE_NOT_FOUND",
                  description:
                    "Penalty clause with the specified ID was not found",
                  id: "penalty-clause-not-found-delete",
                  name: "PenaltyClauseNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "delete-penalty-clause-op",
              name: "DELETE_PENALTY_CLAUSE",
              reducer:
                "const clauseIndex = state.penaltyClauses.findIndex(c => c.id === action.input.id);\nif (clauseIndex === -1) {\n  throw new PenaltyClauseNotFoundError(`Penalty clause with ID ${action.input.id} not found`);\n}\n\nstate.penaltyClauses.splice(clauseIndex, 1);",
              schema: "input DeletePenaltyClauseInput {\n  id: OID!\n}",
              scope: "global",
              template: "Remove a penalty clause",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '"{\\n  \\"status\\": \\"DRAFT\\",\\n  \\"proposer\\": \\"\\",\\n  \\"payer\\": \\"\\",\\n  \\"currency\\": \\"USD\\",\\n  \\"paymentModel\\": \\"MILESTONE\\",\\n  \\"totalAmount\\": null,\\n  \\"milestoneSchedule\\": [],\\n  \\"costAndMaterials\\": null,\\n  \\"retainerDetails\\": null,\\n  \\"escrowDetails\\": null,\\n  \\"evaluation\\": null,\\n  \\"bonusClauses\\": [],\\n  \\"penaltyClauses\\": []\\n}"',
          schema:
            "enum PaymentTermsStatus {\n  DRAFT\n  SUBMITTED\n  ACCEPTED\n  CANCELLED\n}\n\nenum PaymentCurrency {\n  USD\n  EUR\n  GBP\n}\n\nenum PaymentModel {\n  MILESTONE\n  COST_AND_MATERIALS\n  RETAINER\n}\n\nenum MilestonePayoutStatus {\n  PENDING\n  READY_FOR_REVIEW\n  APPROVED\n  PAID\n  REJECTED\n}\n\nenum BillingFrequency {\n  WEEKLY\n  BIWEEKLY\n  MONTHLY\n}\n\nenum EvaluationFrequency {\n  WEEKLY\n  MONTHLY\n  PER_MILESTONE\n}\n\ntype Milestone {\n  id: OID!\n  name: String!\n  amount: Amount!\n  expectedCompletionDate: Date\n  requiresApproval: Boolean!\n  payoutStatus: MilestonePayoutStatus!\n}\n\ntype CostAndMaterials {\n  hourlyRate: Amount\n  variableCap: Amount\n  billingFrequency: BillingFrequency!\n  timesheetRequired: Boolean!\n}\n\ntype Retainer {\n  retainerAmount: Amount!\n  billingFrequency: BillingFrequency!\n  startDate: Date!\n  endDate: Date\n  autoRenew: Boolean!\n  servicesIncluded: String!\n}\n\ntype Escrow {\n  amountHeld: Amount!\n  proofOfFundsDocumentId: String\n  releaseConditions: String!\n  escrowProvider: String\n}\n\ntype EvaluationTerms {\n  evaluationFrequency: EvaluationFrequency!\n  evaluatorTeam: String!\n  criteria: [String!]!\n  impactsPayout: Boolean!\n  impactsReputation: Boolean!\n  commentsVisibleToClient: Boolean!\n}\n\ntype BonusClause {\n  id: OID!\n  condition: String!\n  bonusAmount: Amount!\n  comment: String\n}\n\ntype PenaltyClause {\n  id: OID!\n  condition: String!\n  deductionAmount: Amount!\n  comment: String\n}\n\ntype PaymentTermsState {\n  status: PaymentTermsStatus!\n  proposer: String!\n  payer: String!\n  currency: PaymentCurrency!\n  paymentModel: PaymentModel!\n  totalAmount: Amount\n  milestoneSchedule: [Milestone!]!\n  costAndMaterials: CostAndMaterials\n  retainerDetails: Retainer\n  escrowDetails: Escrow\n  evaluation: EvaluationTerms\n  bonusClauses: [BonusClause!]!\n  penaltyClauses: [PenaltyClause!]!\n}",
        },
        local: {
          examples: [],
          initialValue: '"{}"',
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
