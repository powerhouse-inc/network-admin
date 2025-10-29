import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition
  """
  type Query {
    workstreams(driveId: String!): String
  }

  type ProcessorWorkstream {
    id: PHID!
    title: String!
    status: WorkstreamStatus!
    sow: PHID!
    roadmap: PHID!
    final_milestone_target: DateTime!
    initial_proposal_status: ProposalStatus!
    initial_proposal_author: PHID!
  }

  enum WorkstreamStatus {
    RFP_DRAFT
    PREWORK_RFC
    RFP_CANCELLED
    OPEN_FOR_PROPOSALS
    PROPOSAL_SUBMITTED
    NOT_AWARDED
    AWARDED
    IN_PROGRESS
    FINISHED
  }

  enum ProposalStatus {
    DRAFT
    SUBMITTED
    ACCEPTED
    REJECTED
  }
`;
