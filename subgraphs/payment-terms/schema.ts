import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: PaymentTerms Document
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
    PaymentTerms_setTimeAndMaterials(
      driveId: String
      docId: PHID
      input: PaymentTerms_SetTimeAndMaterialsInput
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
    currency: PaymentTerms_PaymentCurrency!
    paymentModel: PaymentTerms_PaymentModel!
    totalAmount: Amount
  }
  input PaymentTerms_UpdateStatusInput {
    status: PaymentTerms_PaymentTermsStatus!
  }
  input PaymentTerms_SetTimeAndMaterialsInput {
    retainerAmount: Amount
    hourlyRate: Amount
    variableCap: Amount
    billingFrequency: PaymentTerms_BillingFrequency!
    timesheetRequired: Boolean!
  }
  input PaymentTerms_SetEscrowDetailsInput {
    amountHeld: Amount!
    proofOfFundsDocumentId: String
    releaseConditions: String!
    escrowProvider: String
  }
  input PaymentTerms_SetEvaluationTermsInput {
    evaluationFrequency: PaymentTerms_EvaluationFrequency!
    evaluatorTeam: String!
    criteria: [String!]!
    impactsPayout: Boolean!
    impactsReputation: Boolean!
    commentsVisibleToClient: Boolean!
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
    payoutStatus: PaymentTerms_MilestonePayoutStatus!
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
