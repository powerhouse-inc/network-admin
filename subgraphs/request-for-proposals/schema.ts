import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for RequestForProposals (powerhouse/rfp)
  """
  type RequestForProposalsState {
    issuer: ID!
    code: String
    title: String!
    summary: String! # udpated
    briefing: String! # updated
    rfpCommenter: [RfpCommenter!]!
    eligibilityCriteria: String!
    evaluationCriteria: String!
    budgetRange: BudgetRange!
    contextDocuments: [ContextDocument!]!
    status: RFPStatus!
    proposals: [RfpProposal!]!
    deadline: DateTime
    tags: [String!]
  }

  type RfpCommenter {
    id: ID!
    rfpCommentatorType: RFPCommentatorType!
    agentType: RfpAgentType!
    name: String!
    code: String!
    imageUrl: String
  }

  enum RFPCommentatorType {
    INTERNAL # client team
    EXTERNAL # outsourced (if RGH asks BAI team)
  }

  enum RfpAgentType {
    HUMAN
    GROUP
    AI
  }

  type BudgetRange {
    min: Float
    max: Float
    currency: String
  }

  type ContextDocument {
    name: String!
    url: URL!
  }

  enum RFPStatus {
    DRAFT
    REQUEST_FOR_COMMMENTS
    CANCELED
    OPEN_FOR_PROPOSALS
    AWARDED
    NOT_AWARDED
    CLOSED
  }

  type RfpProposal {
    id: OID!
    title: String!
    summary: String!
    proposalStatus: RfpProposalStatus!
    submittedby: OID
    budgetEstimate: String! # a rolled-up total from the payment terms
    paymentTerms: RfpPaymentTerm!
  }

  enum RfpPaymentTerm {
    MILESTONE_BASED_FIXED_PRICE
    MILESTONE_BASED_ADVANCE_PAYMENT
    RETAINER_BASED
    VARIABLE_COST
    ESCROW
  }

  enum RfpProposalStatus {
    SUBMITTED # or received from an RFP issuer POV
    OPENED
    UNDER_REVIEW
    NEEDS_REVISION
    REVISED
    APPROVED
    CONDITIONALLY_APPROVED #
    REJECTED
    WITHDRAWN
  }

  """
  Queries: RequestForProposals
  """
  type RequestForProposalsQueries {
    getDocument(driveId: String, docId: PHID): RequestForProposals
    getDocuments: [RequestForProposals!]
  }

  type Query {
    RequestForProposals: RequestForProposalsQueries
  }

  """
  Mutations: RequestForProposals
  """
  type Mutation {
    RequestForProposals_createDocument(driveId: String, name: String): String

    RequestForProposals_editRfp(
      driveId: String
      docId: PHID
      input: RequestForProposals_EditRfpInput
    ): Int
    RequestForProposals_addContextDocument(
      driveId: String
      docId: PHID
      input: RequestForProposals_AddContextDocumentInput
    ): Int
    RequestForProposals_removeContextDocument(
      driveId: String
      docId: PHID
      input: RequestForProposals_RemoveContextDocumentInput
    ): Int
    RequestForProposals_addProposal(
      driveId: String
      docId: PHID
      input: RequestForProposals_AddProposalInput
    ): Int
    RequestForProposals_changeProposalStatus(
      driveId: String
      docId: PHID
      input: RequestForProposals_ChangeProposalStatusInput
    ): Int
    RequestForProposals_removeProposal(
      driveId: String
      docId: PHID
      input: RequestForProposals_RemoveProposalInput
    ): Int
  }

  """
  Module: RfpState
  """
  input RequestForProposals_EditRfpInput {
    title: String
    code: String
    summary: String
    briefing: String
    eligibilityCriteria: String
    evaluationCriteria: String
    budgetRange: BudgetRangeInput
    status: RFPStatusInput
    deadline: DateTime
    tags: [String!]
  }

  input BudgetRangeInput {
    min: Float
    max: Float
    currency: String
  }

  enum RFPStatusInput {
    DRAFT
    REQUEST_FOR_COMMMENTS
    CANCELED
    OPEN_FOR_PROPOSALS
    AWARDED
    NOT_AWARDED
    CLOSED
  }

  """
  Module: ContexDocument
  """
  input RequestForProposals_AddContextDocumentInput {
    rfpId: OID!
    name: String!
    url: URL!
  }
  input RequestForProposals_RemoveContextDocumentInput {
    rfpId: OID!
    name: String!
  }

  """
  Module: Proposals
  """
  input RequestForProposals_AddProposalInput {
    rfpId: OID!
    id: OID!
    title: String!
    summary: String!
    proposalStatus: RfpProposalStatusInput!
    submittedby: OID
    budgetEstimate: String!
    paymentTerms: RfpPaymentTermInput!
  }

  enum RfpPaymentTermInput {
    MILESTONE_BASED_FIXED_PRICE
    MILESTONE_BASED_ADVANCE_PAYMENT
    RETAINER_BASED
    VARIABLE_COST
    ESCROW
  }

  enum RfpProposalStatusInput {
    SUBMITTED # or received from an RFP issuer POV
    OPENED
    UNDER_REVIEW
    NEEDS_REVISION
    REVISED
    APPROVED
    CONDITIONALLY_APPROVED #
    REJECTED
    WITHDRAWN
  }

  input RequestForProposals_ChangeProposalStatusInput {
    proposalId: OID!
    status: RfpProposalStatusInput!
  }

  input RequestForProposals_RemoveProposalInput {
    rfpId: OID!
    id: OID!
  }
`;
