import { type ISubgraph } from "@powerhousedao/reactor-api";
import type { PHDocument } from "document-model";

type BuildersFilter = {
  id?: string;
  code?: string;
  name?: string;
  slug?: string;
  type?: string;
  status?: string;
  skills?: string[];
  scopes?: string[];
};

export const getResolvers = (subgraph: ISubgraph): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  const extractPhid = (value: unknown): string | null => {
    if (typeof value === "string") {
      return value.trim() || null;
    }
    if (
      value &&
      typeof value === "object" &&
      "id" in value &&
      typeof (value as any).id === "string"
    ) {
      const id = (value as any).id;
      return id.trim() || null;
    }
    return null;
  };

  const getCandidateDrives = async (): Promise<string[]> => {
    try {
      const drives = await (reactor as any).getDrives?.();
      if (Array.isArray(drives) && drives.length > 0) return drives as string[];
    } catch {}
    return [] as string[];
  };

  const applyFilters = (
    builder: any,
    filter?: BuildersFilter,
  ): boolean => {
    if (!filter) return true;

    if (filter.id && builder.id !== filter.id) return false;
    if (filter.code && builder.code !== filter.code) return false;
    if (filter.name && builder.name !== filter.name) return false;
    if (filter.slug && builder.slug !== filter.slug) return false;
    if (filter.type && builder.type !== filter.type) return false;
    if (filter.status && builder.status !== filter.status) return false;

    if (filter.skills && filter.skills.length > 0) {
      const builderSkills = builder.skils || [];
      const hasAllSkills = filter.skills.every((skill) =>
        builderSkills.includes(skill),
      );
      if (!hasAllSkills) return false;
    }

    if (filter.scopes && filter.scopes.length > 0) {
      const builderScopes = builder.scopes || [];
      const hasAllScopes = filter.scopes.every((scope) =>
        builderScopes.includes(scope),
      );
      if (!hasAllScopes) return false;
    }

    return true;
  };

  return {
    Query: {
      builders: async (
        parent: unknown,
        args: { filter?: BuildersFilter },
      ) => {
        const filter = args.filter;
        const drives = await getCandidateDrives();

        // Step 1: Collect all builder profile documents
        const builderDocs: PHDocument[] = [];
        const sowDocs: PHDocument[] = [];

        for (const driveId of drives) {
          try {
            const docIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docIds.map(async (docId) => {
                try {
                  return await reactor.getDocument<PHDocument>(docId);
                } catch {
                  return null;
                }
              }),
            );

            for (const doc of docs) {
              if (!doc) continue;

              if (doc.header.documentType === "powerhouse/builder-profile") {
                builderDocs.push(doc);
              } else if (
                doc.header.documentType === "powerhouse/scopeofwork"
              ) {
                sowDocs.push(doc);
              }
            }
          } catch (error) {
            console.warn(`Failed to process drive ${driveId}:`, error);
          }
        }

        // Step 2: Extract projects from SOW documents and group by projectOwner
        const projectsByOwner = new Map<string, any[]>();

        for (const sowDoc of sowDocs) {
          const sowState = (sowDoc.state as any).global;
          if (!sowState || !Array.isArray(sowState.projects)) continue;

          for (const project of sowState.projects) {
            if (!project || typeof project !== "object") continue;

            const ownerPhid = extractPhid(project.projectOwner);
            if (!ownerPhid) continue;

            // Transform project to BuilderProject format
            const builderProject = {
              id: project.id || null,
              code: project.code || "",
              title: project.title || "",
              slug: project.slug || "",
              abstract: project.abstract || null,
              imageUrl: project.imageUrl || null,
              scope: project.scope || null,
              budgetType: project.budgetType || null,
              currency: project.currency || null,
              budget: project.budget || null,
              expenditure: project.expenditure || null,
            };

            if (!projectsByOwner.has(ownerPhid)) {
              projectsByOwner.set(ownerPhid, []);
            }
            projectsByOwner.get(ownerPhid)!.push(builderProject);
          }
        }

        // Step 3: Transform builder documents to BuilderProfileState format
        const builders = builderDocs
          .map((doc) => {
            const state = (doc.state as any).global;

            // Ensure all non-nullable fields are properly handled
            const name = String(state?.name ?? doc.header?.name ?? "");
            const icon = String(state?.icon ?? "");
            const description = String(state?.description ?? state?.slug ?? "");
            const type = state?.type ?? "INDIVIDUAL";
            const skils = Array.isArray(state?.skils) ? state.skils : [];
            const scopes = Array.isArray(state?.scopes) ? state.scopes : [];
            const links = Array.isArray(state?.links) ? state.links : [];
            const contributors = Array.isArray(state?.contributors)
              ? state.contributors
              : [];

            const builder = {
              id: doc.header.id,
              code: state?.code ?? null,
              slug: state?.slug ?? null,
              name,
              icon,
              description,
              lastModified: state?.lastModified ?? null,
              type,
              contributors,
              status: state?.status ?? null,
              skils,
              scopes,
              links,
              projects: projectsByOwner.get(doc.header.id) || [],
            };

            return builder;
          })
          .filter((builder) => applyFilters(builder, filter));

        return builders;
      },
    },
    SOW_Progress: {
      __resolveType(obj: any) {
        if (obj && typeof obj === "object") {
          if (
            Object.prototype.hasOwnProperty.call(obj, "total") &&
            Object.prototype.hasOwnProperty.call(obj, "completed")
          ) {
            return "SOW_StoryPoint";
          }
          if (Object.prototype.hasOwnProperty.call(obj, "value")) {
            return "SOW_Percentage";
          }
          if (Object.prototype.hasOwnProperty.call(obj, "done")) {
            return "SOW_Binary";
          }
        }
        return null;
      },
    },
  };
};
