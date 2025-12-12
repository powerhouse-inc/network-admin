import { type BaseSubgraph } from "@powerhousedao/reactor-api";
import type { NetworkProfileDocument } from "../../document-models/network-profile/index.js";
import type { BuildersDocument } from "../../document-models/builders/index.js";
import type { PHDocument } from "document-model";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  // Shared state for builder profile resolution (used by field resolvers)
  let getBuilderProfileByPhid: ((phid: string) => any) | null = null;

  return {
    Query: {
      allNetworks: async (
        _: unknown,
        args: { filter?: { networkSlug?: string } },
      ) => {
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

        // Also collect contributor PHIDs from builder profiles (we'll fetch them later)
        const contributorPhids = new Set<string>();

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

        // Step 4: Create a map of PHID to builder profile document and collect contributor PHIDs
        const builderProfileMap = new Map<string, PHDocument>();
        builderProfileDocs.forEach((doc) => {
          if (doc && doc.header.documentType === "powerhouse/builder-profile") {
            builderProfileMap.set(doc.header.id, doc);
            // Collect contributor PHIDs from this builder profile
            const state = (doc.state as any).global;
            if (state?.contributors && Array.isArray(state.contributors)) {
              state.contributors.forEach((phid: string) => {
                if (phid && !builderProfileMap.has(phid)) {
                  contributorPhids.add(phid);
                }
              });
            }
          }
        });

        // Step 4b: Fetch contributor builder profiles if any were found
        if (contributorPhids.size > 0) {
          const contributorDocs = await Promise.all(
            Array.from(contributorPhids).map(async (phid) => {
              try {
                return await reactor.getDocument<PHDocument>(phid);
              } catch (error) {
                console.warn(`Failed to fetch contributor builder profile ${phid}:`, error);
                return null;
              }
            }),
          );

          contributorDocs.forEach((doc) => {
            if (doc && doc.header.documentType === "powerhouse/builder-profile") {
              builderProfileMap.set(doc.header.id, doc);
            }
          });
        }

        // Step 5: Helper function to get builder profile data by PHID
        getBuilderProfileByPhid = (phid: string) => {
          const doc = builderProfileMap.get(phid);
          if (!doc) return null;

          const state = (doc.state as any).global;
          // Store contributor PHIDs separately - they'll be resolved by the field resolver
          const contributorPhids = state?.contributors || [];
          return {
            id: doc.header.id,
            code: state?.code || null,
            slug: state?.slug || null,
            name: state?.name || doc.header.name,
            icon: state?.icon || "",
            description: state?.description || state?.slug || "",
            lastModified: state.lastModified || null,
            type: state?.type || "INDIVIDUAL",
            _contributorPhids: contributorPhids, // Internal field for resolver
            status: state?.status || null,
            skils: state?.skils || [],
            scopes: state?.scopes || [],
            links: state?.links || [],
          };
        };

        // Step 6: Map each network to its builders from the same drive
        const allNetworks = networkDocsWithDriveId.map(({ doc, driveId }) => {
          const state = doc.state.global;

          // Get the BuildersDocument from the same drive as the network
          const buildersDoc = driveIdToBuildersDoc.get(driveId);

          // Get builders list from the BuildersDocument and map to builder profiles
          const builders = buildersDoc && getBuilderProfileByPhid
            ? (buildersDoc.state.global.builders || [])
              .map((phid: string) => getBuilderProfileByPhid!(phid))
              .filter((builder) => builder !== null)
            : [];

          return {
            id: doc.header.id,
            documentType: doc.header.documentType,
            network: {
              name: state.name,
              slug: state.name
                ? state.name.toLowerCase().trim().split(/\s+/).join("-")
                : null,
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

        // Step 7: Apply filter if provided
        const networkSlug = args.filter?.networkSlug;
        if (networkSlug) {
          return allNetworks.filter(
            (network) => network.network.slug === networkSlug,
          );
        }

        return allNetworks;
      },
    },
    Builder: {
      contributors: (parent: { _contributorPhids?: string[] }) => {
        // Resolve contributor PHIDs to Builder objects
        if (!parent._contributorPhids || parent._contributorPhids.length === 0) {
          return [];
        }
        if (!getBuilderProfileByPhid) {
          return [];
        }
        return parent._contributorPhids
          .map((phid: string) => getBuilderProfileByPhid!(phid))
          .filter((builder) => builder !== null);
      },
    },
  };
};
