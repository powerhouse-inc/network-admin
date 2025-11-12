import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: RequestForProposals Document
  """
  type RequestForProposalsQueries {
    getDocument(docId: PHID!, driveId: PHID): RequestForProposals
    getDocuments(driveId: String!): [RequestForProposals!]
  }

  type Query {
    RequestForProposals: RequestForProposalsQueries
  }

  """
  Mutations: RequestForProposals
  """
  type Mutation {
    RequestForProposals_createDocument(name: String!, driveId: String): String

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
    budgetRange: RequestForProposals_BudgetRangeInput
    status: RequestForProposals_RFPStatusInput
    deadline: DateTime
    tags: [String!]
  }

  input RequestForProposals_BudgetRangeInput {
    min: Float
    max: Float
    currency: String
  }

  enum RequestForProposals_RFPStatusInput {
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
    proposalStatus: RequestForProposals_RfpProposalStatusInput!
    submittedby: OID
    budgetEstimate: String!
    paymentTerms: RequestForProposals_RfpPaymentTermInput!
  }

  enum RequestForProposals_RfpPaymentTermInput {
    MILESTONE_BASED_FIXED_PRICE
    MILESTONE_BASED_ADVANCE_PAYMENT
    RETAINER_BASED
    VARIABLE_COST
    ESCROW
  }

  enum RequestForProposals_RfpProposalStatusInput {
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
