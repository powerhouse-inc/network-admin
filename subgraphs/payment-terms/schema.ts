import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for PaymentTerms (payment-terms)
  """
  enum PaymentTermsStatus {
    DRAFT
    SUBMITTED
    ACCEPTED
    CANCELLED
  }

  enum PaymentCurrency {
    USD
    EUR
    GBP
  }

  enum PaymentModel {
    MILESTONE
    COST_AND_MATERIALS
    RETAINER
  }

  enum MilestonePayoutStatus {
    PENDING
    READY_FOR_REVIEW
    APPROVED
    PAID
    REJECTED
  }

  enum BillingFrequency {
    WEEKLY
    BIWEEKLY
    MONTHLY
  }

  enum EvaluationFrequency {
    WEEKLY
    MONTHLY
    PER_MILESTONE
  }

  type Milestone {
    id: OID!
    name: String!
    amount: Amount!
    expectedCompletionDate: Date
    requiresApproval: Boolean!
    payoutStatus: MilestonePayoutStatus!
  }

  type CostAndMaterials {
    hourlyRate: Amount
    variableCap: Amount
    billingFrequency: BillingFrequency!
    timesheetRequired: Boolean!
  }

  type Retainer {
    retainerAmount: Amount!
    billingFrequency: BillingFrequency!
    startDate: Date!
    endDate: Date
    autoRenew: Boolean!
    servicesIncluded: String!
  }

  type Escrow {
    amountHeld: Amount!
    proofOfFundsDocumentId: String
    releaseConditions: String!
    escrowProvider: String
  }

  type EvaluationTerms {
    evaluationFrequency: EvaluationFrequency!
    evaluatorTeam: String!
    criteria: [String!]!
    impactsPayout: Boolean!
    impactsReputation: Boolean!
    commentsVisibleToClient: Boolean!
  }

  type BonusClause {
    id: OID!
    condition: String!
    bonusAmount: Amount!
    comment: String
  }

  type PenaltyClause {
    id: OID!
    condition: String!
    deductionAmount: Amount!
    comment: String
  }

  type PaymentTermsState {
    status: PaymentTermsStatus!
    proposer: String!
    payer: String!
    currency: PaymentCurrency!
    paymentModel: PaymentModel!
    totalAmount: Amount
    milestoneSchedule: [Milestone!]!
    costAndMaterials: CostAndMaterials
    retainerDetails: Retainer
    escrowDetails: Escrow
    evaluation: EvaluationTerms
    bonusClauses: [BonusClause!]!
    penaltyClauses: [PenaltyClause!]!
  }

  """
  Queries: PaymentTerms
  """
  type PaymentTermsQueries {
    getDocument(docId: PHID!, driveId: PHID): PaymentTerms
    getDocuments(driveId: String!): [PaymentTerms!]
  }

  type Query {
    PaymentTerms: PaymentTermsQueries
  }

  """
  Mutations: PaymentTerms
  """
  type Mutation {
    PaymentTerms_createDocument(name: String!, driveId: String): String

    PaymentTerms_setBasicTerms(
      driveId: String
      docId: PHID
      input: PaymentTerms_SetBasicTermsInput
    ): Int
    PaymentTerms_updateStatus(
      driveId: String
      docId: PHID
      input: PaymentTerms_UpdateStatusInput
    ): Int
    PaymentTerms_setCostAndMaterials(
      driveId: String
      docId: PHID
      input: PaymentTerms_SetCostAndMaterialsInput
    ): Int
    PaymentTerms_setEscrowDetails(
      driveId: String
      docId: PHID
      input: PaymentTerms_SetEscrowDetailsInput
    ): Int
    PaymentTerms_setEvaluationTerms(
      driveId: String
      docId: PHID
      input: PaymentTerms_SetEvaluationTermsInput
    ): Int
    PaymentTerms_setRetainerDetails(
      driveId: String
      docId: PHID
      input: PaymentTerms_SetRetainerDetailsInput
    ): Int
    PaymentTerms_addMilestone(
      driveId: String
      docId: PHID
      input: PaymentTerms_AddMilestoneInput
    ): Int
    PaymentTerms_updateMilestone(
      driveId: String
      docId: PHID
      input: PaymentTerms_UpdateMilestoneInput
    ): Int
    PaymentTerms_updateMilestoneStatus(
      driveId: String
      docId: PHID
      input: PaymentTerms_UpdateMilestoneStatusInput
    ): Int
    PaymentTerms_deleteMilestone(
      driveId: String
      docId: PHID
      input: PaymentTerms_DeleteMilestoneInput
    ): Int
    PaymentTerms_reorderMilestones(
      driveId: String
      docId: PHID
      input: PaymentTerms_ReorderMilestonesInput
    ): Int
    PaymentTerms_addBonusClause(
      driveId: String
      docId: PHID
      input: PaymentTerms_AddBonusClauseInput
    ): Int
    PaymentTerms_updateBonusClause(
      driveId: String
      docId: PHID
      input: PaymentTerms_UpdateBonusClauseInput
    ): Int
    PaymentTerms_deleteBonusClause(
      driveId: String
      docId: PHID
      input: PaymentTerms_DeleteBonusClauseInput
    ): Int
    PaymentTerms_addPenaltyClause(
      driveId: String
      docId: PHID
      input: PaymentTerms_AddPenaltyClauseInput
    ): Int
    PaymentTerms_updatePenaltyClause(
      driveId: String
      docId: PHID
      input: PaymentTerms_UpdatePenaltyClauseInput
    ): Int
    PaymentTerms_deletePenaltyClause(
      driveId: String
      docId: PHID
      input: PaymentTerms_DeletePenaltyClauseInput
    ): Int
  }

  """
  Module: Terms
  """
  input PaymentTerms_SetBasicTermsInput {
    proposer: String!
    payer: String!
    currency: PaymentCurrency!
    paymentModel: PaymentModel!
    totalAmount: Amount
  }
  input PaymentTerms_UpdateStatusInput {
    status: PaymentTermsStatus!
  }
  input PaymentTerms_SetCostAndMaterialsInput {
    hourlyRate: Amount
    variableCap: Amount
    billingFrequency: BillingFrequency!
    timesheetRequired: Boolean!
  }
  input PaymentTerms_SetEscrowDetailsInput {
    amountHeld: Amount!
    proofOfFundsDocumentId: String
    releaseConditions: String!
    escrowProvider: String
  }
  input PaymentTerms_SetEvaluationTermsInput {
    evaluationFrequency: EvaluationFrequency!
    evaluatorTeam: String!
    criteria: [String!]!
    impactsPayout: Boolean!
    impactsReputation: Boolean!
    commentsVisibleToClient: Boolean!
  }
  input PaymentTerms_SetRetainerDetailsInput {
    retainerAmount: Amount!
    billingFrequency: BillingFrequency!
    startDate: Date!
    endDate: Date
    autoRenew: Boolean!
    servicesIncluded: String!
  }

  """
  Module: Milestones
  """
  input PaymentTerms_AddMilestoneInput {
    id: OID!
    name: String!
    amount: Amount!
    expectedCompletionDate: Date
    requiresApproval: Boolean!
  }
  input PaymentTerms_UpdateMilestoneInput {
    id: OID!
    name: String
    amount: Amount
    expectedCompletionDate: Date
    requiresApproval: Boolean
  }
  input PaymentTerms_UpdateMilestoneStatusInput {
    id: OID!
    payoutStatus: MilestonePayoutStatus!
  }
  input PaymentTerms_DeleteMilestoneInput {
    id: OID!
  }
  input PaymentTerms_ReorderMilestonesInput {
    order: [OID!]!
  }

  """
  Module: Clauses
  """
  input PaymentTerms_AddBonusClauseInput {
    id: OID!
    condition: String!
    bonusAmount: Amount!
    comment: String
  }
  input PaymentTerms_UpdateBonusClauseInput {
    id: OID!
    condition: String
    bonusAmount: Amount
    comment: String
  }
  input PaymentTerms_DeleteBonusClauseInput {
    id: OID!
  }
  input PaymentTerms_AddPenaltyClauseInput {
    id: OID!
    condition: String!
    deductionAmount: Amount!
    comment: String
  }
  input PaymentTerms_UpdatePenaltyClauseInput {
    id: OID!
    condition: String
    deductionAmount: Amount
    comment: String
  }
  input PaymentTerms_DeletePenaltyClauseInput {
    id: OID!
  }
`;
