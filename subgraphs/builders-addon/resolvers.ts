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
    if (
      filter.code &&
      String(builder.code || "").toLowerCase() !==
        String(filter.code || "").toLowerCase()
    )
      return false;
    if (
      filter.name &&
      String(builder.name || "").toLowerCase() !==
        String(filter.name || "").toLowerCase()
    )
      return false;
    if (
      filter.slug &&
      String(builder.slug || "").toLowerCase() !==
        String(filter.slug || "").toLowerCase()
    )
      return false;
    if (
      filter.type &&
      String(builder.type || "").toLowerCase() !==
        String(filter.type || "").toLowerCase()
    )
      return false;
    if (
      filter.status &&
      String(builder.status || "").toLowerCase() !==
        String(filter.status || "").toLowerCase()
    )
      return false;

    if (filter.skills && filter.skills.length > 0) {
      const builderSkills = (builder.skils || []).map((s: string) =>
        String(s).toLowerCase(),
      );
      const hasAllSkills = filter.skills.every((skill) =>
        builderSkills.includes(String(skill).toLowerCase()),
      );
      if (!hasAllSkills) return false;
    }

    if (filter.scopes && filter.scopes.length > 0) {
      const builderScopes = (builder.scopes || []).map((s: string) =>
        String(s).toLowerCase(),
      );
      const hasAllScopes = filter.scopes.every((scope) =>
        builderScopes.includes(String(scope).toLowerCase()),
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

        // Step 2: Build a map of deliverable OID -> deliverable object for each SOW
        const sowDeliverablesMap = new Map<string, Map<string, any>>();

        for (const sowDoc of sowDocs) {
          const sowState = (sowDoc.state as any).global;
          if (!sowState || typeof sowState !== "object") continue;

          const deliverablesMap = new Map<string, any>();
          const deliverables = Array.isArray(sowState.deliverables)
            ? sowState.deliverables
            : [];

          for (const deliverable of deliverables) {
            if (!deliverable || typeof deliverable !== "object") continue;
            const deliverableId = deliverable.id;
            if (deliverableId && typeof deliverableId === "string") {
              deliverablesMap.set(deliverableId, deliverable);
            }
          }

          sowDeliverablesMap.set(sowDoc.header.id, deliverablesMap);
        }

        // Step 3: Extract projects from SOW documents and group by projectOwner
        const projectsByOwner = new Map<string, any[]>();

        for (const sowDoc of sowDocs) {
          const sowState = (sowDoc.state as any).global;
          if (!sowState || typeof sowState !== "object") continue;
          if (!Array.isArray(sowState.projects)) continue;

          const deliverablesMap = sowDeliverablesMap.get(sowDoc.header.id) || new Map();

          for (const project of sowState.projects) {
            if (!project || typeof project !== "object") continue;

            const ownerPhid = extractPhid(project.projectOwner);
            if (!ownerPhid) continue;

            // Resolve scope deliverables from OIDs to actual deliverable objects
            let resolvedScope = null;
            if (project.scope && typeof project.scope === "object") {
              try {
                const scopeDeliverableOids = Array.isArray(project.scope.deliverables)
                  ? project.scope.deliverables
                  : [];

                const resolvedDeliverables = scopeDeliverableOids
                  .map((oid: unknown) => {
                    if (!oid || typeof oid !== "string") return null;
                    const deliverable = deliverablesMap.get(oid);
                    if (!deliverable || typeof deliverable !== "object") return null;

                    // Transform to SOW_Deliverable format with error handling
                    try {
                      return {
                        id: deliverable.id || "",
                        icon: deliverable.icon ?? null,
                        title: String(deliverable.title || ""),
                        code: String(deliverable.code || ""),
                        description: String(deliverable.description || ""),
                        status: deliverable.status || "DRAFT",
                        workProgress: deliverable.workProgress ?? null,
                        keyResults: Array.isArray(deliverable.keyResults)
                          ? deliverable.keyResults.map((kr: any) => ({
                              id: kr?.id || "",
                              title: String(kr?.title || ""),
                              link: String(kr?.link || ""),
                            }))
                          : [],
                        budgetAnchor: deliverable.budgetAnchor ?? null,
                      };
                    } catch (error) {
                      console.warn(
                        `Failed to transform deliverable ${oid}:`,
                        error,
                      );
                      return null;
                    }
                  })
                  .filter((d: any) => d !== null);

                // Build resolved scope with error handling
                resolvedScope = {
                  deliverables: resolvedDeliverables,
                  status:
                    project.scope.status ||
                    project.scope.deliverableSetStatus ||
                    "DRAFT",
                  progress: project.scope.progress ?? null,
                  deliverablesCompleted: project.scope.deliverablesCompleted ?? {
                    total: 0,
                    completed: 0,
                  },
                };
              } catch (error) {
                console.warn(
                  `Failed to resolve scope for project ${project.id}:`,
                  error,
                );
                // Fallback to empty scope
                resolvedScope = {
                  deliverables: [],
                  status: "DRAFT",
                  progress: null,
                  deliverablesCompleted: { total: 0, completed: 0 },
                };
              }
            }

            // Transform project to BuilderProject format with error handling
            try {
              const builderProject = {
                id: project.id || "",
                code: String(project.code || ""),
                title: String(project.title || ""),
                slug: String(project.slug || ""),
                abstract: project.abstract ?? null,
                imageUrl: project.imageUrl ?? null,
                scope: resolvedScope,
                budgetType: project.budgetType ?? null,
                currency: project.currency ?? null,
                budget: project.budget ?? null,
                expenditure: project.expenditure ?? null,
              };

              if (!projectsByOwner.has(ownerPhid)) {
                projectsByOwner.set(ownerPhid, []);
              }
              projectsByOwner.get(ownerPhid)!.push(builderProject);
            } catch (error) {
              console.warn(
                `Failed to transform project ${project.id}:`,
                error,
              );
              // Skip this project if transformation fails
              continue;
            }
          }
        }

        // Step 4: Transform builder documents to BuilderProfileState format
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
