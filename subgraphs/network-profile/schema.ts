import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: NetworkProfile Document
  """
  type NetworkProfileQueries {
    getDocument(docId: PHID!, driveId: PHID): NetworkProfile
    getDocuments(driveId: String!): [NetworkProfile!]
  }

  type Query {
    NetworkProfile: NetworkProfileQueries
  }

  """
  Mutations: NetworkProfile
  """
  type Mutation {
    NetworkProfile_createDocument(name: String!, driveId: String): String

    NetworkProfile_setIcon(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetIconInput
    ): Int
    NetworkProfile_setLogo(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetLogoInput
    ): Int
    NetworkProfile_setLogoBig(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetLogoBigInput
    ): Int
    NetworkProfile_setWebsite(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetWebsiteInput
    ): Int
    NetworkProfile_setDescription(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetDescriptionInput
    ): Int
    NetworkProfile_setCategory(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetCategoryInput
    ): Int
    NetworkProfile_setX(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetXInput
    ): Int
    NetworkProfile_setGithub(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetGithubInput
    ): Int
    NetworkProfile_setDiscord(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetDiscordInput
    ): Int
    NetworkProfile_setYoutube(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetYoutubeInput
    ): Int
    NetworkProfile_setProfileName(
      driveId: String
      docId: PHID
      input: NetworkProfile_SetProfileNameInput
    ): Int
  }

  """
  Module: NetworkProfileManagement
  """
  input NetworkProfile_SetIconInput {
    icon: String!
  }
  input NetworkProfile_SetLogoInput {
    logo: String!
  }
  input NetworkProfile_SetLogoBigInput {
    logoBig: String!
  }
  input NetworkProfile_SetWebsiteInput {
    website: String
  }
  input NetworkProfile_SetDescriptionInput {
    description: String!
  }
  input NetworkProfile_SetCategoryInput {
    category: [NetworkProfile_NetworkCategory!]!
  }
  input NetworkProfile_SetXInput {
    x: String
  }
  input NetworkProfile_SetGithubInput {
    github: String
  }
  input NetworkProfile_SetDiscordInput {
    discord: String
  }
  input NetworkProfile_SetYoutubeInput {
    youtube: String
  }
  input NetworkProfile_SetProfileNameInput {
    name: String!
  }
`;
