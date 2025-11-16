import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: Workstream Document
  """
  type WorkstreamQueries {
    getDocument(docId: PHID!, driveId: PHID): Workstream
    getDocuments(driveId: String!): [Workstream!]
  }

  type Query {
    Workstream: WorkstreamQueries
  }

  """
  Mutations: Workstream
  """
  type Mutation {
    Workstream_createDocument(name: String!, driveId: String): String

    Workstream_editWorkstream(
      driveId: String
      docId: PHID
      input: Workstream_EditWorkstreamInput
    ): Int
    Workstream_editClientInfo(
      driveId: String
      docId: PHID
      input: Workstream_EditClientInfoInput
    ): Int
    Workstream_setRequestForProposal(
      driveId: String
      docId: PHID
      input: Workstream_SetRequestForProposalInput
    ): Int
    Workstream_addPaymentRequest(
      driveId: String
      docId: PHID
      input: Workstream_AddPaymentRequestInput
    ): Int
    Workstream_removePaymentRequest(
      driveId: String
      docId: PHID
      input: Workstream_RemovePaymentRequestInput
    ): Int
    Workstream_editInitialProposal(
      driveId: String
      docId: PHID
      input: Workstream_EditInitialProposalInput
    ): Int
    Workstream_addAlternativeProposal(
      driveId: String
      docId: PHID
      input: Workstream_AddAlternativeProposalInput
    ): Int
    Workstream_editAlternativeProposal(
      driveId: String
      docId: PHID
      input: Workstream_EditAlternativeProposalInput
    ): Int
    Workstream_removeAlternativeProposal(
      driveId: String
      docId: PHID
      input: Workstream_RemoveAlternativeProposalInput
    ): Int
  }

  """
  Module: Workstream
  """
  input Workstream_EditWorkstreamInput {
    code: String
    title: String
    status: Workstream_WorkstreamStatusInput
    sowId: PHID
    paymentTerms: PHID
  }

  enum Workstream_WorkstreamStatusInput {
    RFP_DRAFT
    PREWORK_RFC # Workstream_RFP status change to RFC
    RFP_CANCELLED
    OPEN_FOR_PROPOSALS
    PROPOSAL_SUBMITTED
    NOT_AWARDED
    AWARDED
    IN_PROGRESS
    FINISHED
  }
  input Workstream_EditClientInfoInput {
    clientId: PHID!
    name: String
    icon: String
  }
  input Workstream_SetRequestForProposalInput {
    rfpId: PHID!
    title: String!
  }
  input Workstream_AddPaymentRequestInput {
    id: PHID!
  }
  input Workstream_RemovePaymentRequestInput {
    id: PHID!
  }

  """
  Module: Proposals
  """
  input Workstream_EditInitialProposalInput {
    id: ID!
    sowId: PHID
    paymentTermsId: PHID
    status: Workstream_ProposalStatusInput
    proposalAuthor: Workstream_ProposalAuthorInput
  }

  enum Workstream_ProposalStatusInput {
    DRAFT
    SUBMITTED
    ACCEPTED
    REJECTED
  }

  input Workstream_ProposalAuthorInput {
    id: PHID!
    name: String
    icon: URL
  }
  input Workstream_AddAlternativeProposalInput {
    id: ID!
    sowId: PHID
    paymentTermsId: PHID
    status: Workstream_ProposalStatusInput
    proposalAuthor: Workstream_ProposalAuthorInput
  }
  input Workstream_EditAlternativeProposalInput {
    id: ID!
    sowId: PHID
    paymentTermsId: PHID
    status: Workstream_ProposalStatusInput
    proposalAuthor: Workstream_ProposalAuthorInput
  }
  input Workstream_RemoveAlternativeProposalInput {
    id: ID!
  }
`;
