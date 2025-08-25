import { Subgraph } from "@powerhousedao/reactor-api";

import { schema } from "./schema.js";
import { getResolvers } from "./resolvers.js";

export class WorkstreamSubgraph extends Subgraph {
  name = "workstream";

  typeDefs = schema;
  resolvers = getResolvers(this);
  additionalContextFields = {};
  async onSetup() {}
  async onDisconnect() {}
}
