import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Subgraph definition
  """
  type Query {
    allNetworks: [AllNetworks!]!
  }


  type AllNetworks {
    id: PHID
    documentType: String
    network: Network
    builders: [Builder!]!
  }

  type Network {
    name: String!
    icon: String!
    darkThemeIcon: String!
    logo: String!
    darkThemeLogo: String!
    logoBig: String!
    website: String
    description: String!
    category: [NetworkCategory!]!
    x: String
    github: String
    discord: String
    youtube: String
  }

  enum NetworkCategory {
    DEFI
    OSS
    CRYPTO
    NGO
    CHARITY
  }

  type Builder {
    id: PHID
    name: String!
    icon: String!
    description: String!
  }

`;

