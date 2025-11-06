import { BaseSubgraph } from "@powerhousedao/reactor-api";
import type { DocumentNode } from "graphql";
import { schema } from "./schema.js";
import { getResolvers } from "./resolvers.js";

export class NetworkProfileSubgraph extends BaseSubgraph {
  name = "network-profile";
  typeDefs: DocumentNode = schema;
  resolvers: Record<string, unknown> = getResolvers(this);
  additionalContextFields = {};
  async onSetup() { }
  async onDisconnect() { }
}
