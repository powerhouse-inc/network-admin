import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  networkProfileDocumentType,
} from "../../document-models/network-profile/index.js";

import type {
  NetworkProfileDocument,
  SetIconInput,
  SetLogoInput,
  SetLogoBigInput,
  SetWebsiteInput,
  SetDescriptionInput,
  SetCategoryInput,
  SetXInput,
  SetGithubInput,
  SetDiscordInput,
  SetYoutubeInput,
  SetProfileNameInput,
} from "../../document-models/network-profile/index.js";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      NetworkProfile: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc =
              await reactor.getDocument<NetworkProfileDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<NetworkProfileDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.header.documentType === networkProfileDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      NetworkProfile_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(networkProfileDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: networkProfileDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      NetworkProfile_setIcon: async (
        _: unknown,
        args: { docId: string; input: SetIconInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.setIcon(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setIcon");
        }

        return true;
      },

      NetworkProfile_setLogo: async (
        _: unknown,
        args: { docId: string; input: SetLogoInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.setLogo(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setLogo");
        }

        return true;
      },

      NetworkProfile_setLogoBig: async (
        _: unknown,
        args: { docId: string; input: SetLogoBigInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setLogoBig(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setLogoBig");
        }

        return true;
      },

      NetworkProfile_setWebsite: async (
        _: unknown,
        args: { docId: string; input: SetWebsiteInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setWebsite(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setWebsite");
        }

        return true;
      },

      NetworkProfile_setDescription: async (
        _: unknown,
        args: { docId: string; input: SetDescriptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setDescription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setDescription");
        }

        return true;
      },

      NetworkProfile_setCategory: async (
        _: unknown,
        args: { docId: string; input: SetCategoryInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setCategory(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setCategory");
        }

        return true;
      },

      NetworkProfile_setX: async (
        _: unknown,
        args: { docId: string; input: SetXInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.setX(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setX");
        }

        return true;
      },

      NetworkProfile_setGithub: async (
        _: unknown,
        args: { docId: string; input: SetGithubInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.setGithub(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setGithub");
        }

        return true;
      },

      NetworkProfile_setDiscord: async (
        _: unknown,
        args: { docId: string; input: SetDiscordInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setDiscord(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setDiscord");
        }

        return true;
      },

      NetworkProfile_setYoutube: async (
        _: unknown,
        args: { docId: string; input: SetYoutubeInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setYoutube(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setYoutube");
        }

        return true;
      },

      NetworkProfile_setProfileName: async (
        _: unknown,
        args: { docId: string; input: SetProfileNameInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<NetworkProfileDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setProfileName(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setProfileName");
        }

        return true;
      },
    },
  };
};
