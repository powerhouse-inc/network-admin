import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition for Workstream (powerhouse/workstream)
  """
  type WorkstreamState {
    code: String
    title: String
    status: WorkstreamStatus!
    client: ClientInfo # eventually tie it to the AID?
    rfp: RFP
    initialProposal: Proposal
    alternativeProposals: [Proposal!]!
    sow: PHID
    paymentTerms: PHID
    paymentRequests: [PHID!]!
  }

  enum WorkstreamStatus {
    RFP_DRAFT
    PREWORK_RFC # RFP status change to RFC
    RFP_CANCELLED
    OPEN_FOR_PROPOSALS
    PROPOSAL_SUBMITTED
    NOT_AWARDED
    AWARDED
    IN_PROGRESS
    FINISHED
  }

  type Proposal {
    id: ID!
    sow: PHID! # a link with a fixed label (i.e, sow)
    paymentTerms: PHID! # a link with a fixed label (i.e., payment terms)
    status: ProposalStatus!
    author: ProposalAuthor! # eventually an AID
  }

  enum ProposalStatus {
    DRAFT
    SUBMITTED
    ACCEPTED
    REJECTED
  }

  type ClientInfo {
    id: PHID!
    name: String
    icon: URL
  }

  type RFP {
    id: PHID!
    title: String!
  }

  type ProposalAuthor {
    id: PHID!
    name: String
    icon: URL
  }

  """
  Queries: Workstream
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
    status: WorkstreamStatusInput
    sowId: PHID
    paymentTerms: PHID
  }

  enum WorkstreamStatusInput {
    RFP_DRAFT
    PREWORK_RFC # RFP status change to RFC
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
    status: ProposalStatusInput
    proposalAuthor: ProposalAuthorInput
  }

  enum ProposalStatusInput {
    DRAFT
    SUBMITTED
    ACCEPTED
    REJECTED
  }

  input ProposalAuthorInput {
    id: PHID!
    name: String
    icon: URL
  }
  input Workstream_AddAlternativeProposalInput {
    id: ID!
    sowId: PHID
    paymentTermsId: PHID
    status: ProposalStatusInput
    proposalAuthor: ProposalAuthorInput
  }
  input Workstream_EditAlternativeProposalInput {
    id: ID!
    sowId: PHID
    paymentTermsId: PHID
    status: ProposalStatusInput
    proposalAuthor: ProposalAuthorInput
  }
  input Workstream_RemoveAlternativeProposalInput {
    id: ID!
  }
`;
