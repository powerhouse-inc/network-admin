import { type BaseSubgraph } from "@powerhousedao/reactor-api";
import type { NetworkProfileDocument } from "../../document-models/network-profile/index.js";
import type { BuildersDocument } from "../../document-models/builders/index.js";
import type { PHDocument } from "document-model";

export const getResolvers = (subgraph: BaseSubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      allNetworks: async () => {
        const drives = await reactor.getDrives();

        // Step 1: Collect all network profile documents and builders documents with their drive IDs
        const networkDocsWithDriveId: Array<{
          doc: NetworkProfileDocument;
          driveId: string;
        }> = [];
        const driveIdToBuildersDoc = new Map<string, BuildersDocument>();

        for (const driveId of drives) {
          const docsIds = await reactor.getDocuments(driveId);

          // Fetch all documents in the drive
          const docs = await Promise.all(
            docsIds.map(async (docId) =>
              reactor.getDocument<PHDocument>(docId),
            ),
          );

          // Find network profile and builders documents
          for (const doc of docs) {
            if (doc.header.documentType === "powerhouse/network-profile") {
              networkDocsWithDriveId.push({
                doc: doc as NetworkProfileDocument,
                driveId: driveId,
              });
            } else if (doc.header.documentType === "powerhouse/builders") {
              driveIdToBuildersDoc.set(driveId, doc as BuildersDocument);
            }
          }
        }

        // Step 2: Collect all unique builder PHIDs from all BuildersDocuments
        const allBuilderPhids = new Set<string>();
        driveIdToBuildersDoc.forEach((buildersDoc) => {
          const builders = buildersDoc.state.global.builders;
          if (Array.isArray(builders)) {
            builders.forEach((phid) => {
              if (phid) {
                allBuilderPhids.add(phid);
              }
            });
          }
        });

        // Step 3: Fetch all builder-profile documents from all drives using the PHIDs
        const builderProfileDocs = await Promise.all(
          Array.from(allBuilderPhids).map(async (phid) => {
            try {
              return await reactor.getDocument<PHDocument>(phid);
            } catch (error) {
              console.warn(`Failed to fetch builder profile ${phid}:`, error);
              return null;
            }
          }),
        );

        // Step 4: Create a map of PHID to builder profile document
        const builderProfileMap = new Map<string, PHDocument>();
        builderProfileDocs.forEach((doc) => {
          if (
            doc &&
            doc.header.documentType === "powerhouse/builder-profile"
          ) {
            builderProfileMap.set(doc.header.id, doc);
          }
        });

        // Step 5: Helper function to get builder profile data by PHID
        const getBuilderProfileByPhid = (phid: string) => {
          const doc = builderProfileMap.get(phid);
          if (!doc) return null;

          const state = (doc.state as any).global;
          return {
            id: doc.header.id,
            name: state?.name || doc.header.id,
            icon: state?.icon || "",
            description: state?.description || state?.slug || "",
          };
        };

        // Step 6: Map each network to its builders from the same drive
        return networkDocsWithDriveId.map(({ doc, driveId }) => {
          const state = doc.state.global;

          // Get the BuildersDocument from the same drive as the network
          const buildersDoc = driveIdToBuildersDoc.get(driveId);
          
          // Get builders list from the BuildersDocument and map to builder profiles
          const builders = buildersDoc
            ? (buildersDoc.state.global.builders || [])
                .map((phid: string) => getBuilderProfileByPhid(phid))
                .filter((builder) => builder !== null)
            : [];

          return {
            id: doc.header.id,
            documentType: doc.header.documentType,
            network: {
              name: state.name,
              icon: state.icon,
              darkThemeIcon: state.darkThemeIcon ?? null,
              logo: state.logo,
              darkThemeLogo: state.darkThemeLogo ?? null,
              logoBig: state.logoBig,
              website: state.website ?? null,
              description: state.description,
              category: state.category,
              x: state.x ?? null,
              github: state.github ?? null,
              discord: state.discord ?? null,
              youtube: state.youtube ?? null,
            },
            builders: builders,
          };
        });
      },
    },
  };
};
