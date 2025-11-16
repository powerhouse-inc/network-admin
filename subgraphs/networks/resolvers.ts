import { type BaseSubgraph } from "@powerhousedao/reactor-api";
import type { NetworkProfileDocument } from "../../document-models/network-profile/index.js";

export const getResolvers = (subgraph: BaseSubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      allNetworks: async () => {
        const drives = await reactor.getDrives();

        const docs: NetworkProfileDocument[] = [];

        for (const driveId of drives) {
          const docsIds = await reactor.getDocuments(driveId);

          const driveDocs = await Promise.allSettled(
            docsIds.map(async (docId) =>
              reactor.getDocument<NetworkProfileDocument>(docId),
            ),
          );

          driveDocs.forEach((result) => {
            if (
              result.status === "fulfilled" &&
              result.value.header.documentType === "powerhouse/network-profile"
            ) {
              docs.push(result.value);
            }
          });
        }

        return docs.map((doc) => {
          const state = doc.state.global;
          return {
            id: doc.header.id,
            documentType: doc.header.documentType,
            network: {
              name: state.name,
              icon: state.icon,
              logo: state.logo,
              logoBig: state.logoBig,
              website: state.website ?? null,
              description: state.description,
              category: state.category,
              x: state.x ?? null,
              github: state.github ?? null,
              discord: state.discord ?? null,
              youtube: state.youtube ?? null,
            },
          };
        });
      },
    },
  };
};
