import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: Builders Document
  """
  type BuildersQueries {
    getDocument(docId: PHID!, driveId: PHID): Builders
    getDocuments(driveId: String!): [Builders!]
  }

  type Query {
    Builders: BuildersQueries
  }

  """
  Mutations: Builders
  """
  type Mutation {
    Builders_createDocument(name: String!, driveId: String): String

    Builders_addBuilder(
      driveId: String
      docId: PHID
      input: Builders_AddBuilderInput
    ): Int
    Builders_removeBuilder(
      driveId: String
      docId: PHID
      input: Builders_RemoveBuilderInput
    ): Int
  }

  """
  Module: Builders
  """
  input Builders_AddBuilderInput {
    builderPhid: PHID!
  }
  input Builders_RemoveBuilderInput {
    builderPhid: PHID!
  }
`;
