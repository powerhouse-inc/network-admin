import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  id: "powerhouse/network-profile",
  name: "Network Profile",
  extension: "",
  description:
    "Document model for managing network profile information including social media links and branding and logos.",
  author: {
    name: "Powerhouse",
    website: "https://www.powerhouse.inc/",
  },
  specifications: [
    {
      version: 1,
      changeLog: [],
      state: {
        global: {
          schema:
            "enum NetworkCategory {\n  DEFI\n  OSS\n  CRYPTO\n  NGO\n  CHARITY\n}\n\ntype NetworkProfileState {\n  name: String!\n  icon: String!\n  darkThemeIcon: String!\n  logo: String!\n  darkThemeLogo: String!\n  logoBig: String!\n  website: String\n  description: String!\n  category: [NetworkCategory!]!\n  x: String\n  github: String\n  discord: String\n  youtube: String\n}",
          initialValue:
            '"{\\n  \\"name\\": \\"\\",\\n  \\"icon\\": \\"\\",\\n  \\"darkThemeIcon\\": \\"\\",\\n  \\"logo\\": \\"\\",\\n  \\"darkThemeLogo\\": \\"\\",\\n  \\"logoBig\\": \\"\\",\\n  \\"website\\": null,\\n  \\"description\\": \\"\\",\\n  \\"category\\": [],\\n  \\"x\\": null,\\n  \\"github\\": null,\\n  \\"discord\\": null,\\n  \\"youtube\\": null\\n}"',
          examples: [],
        },
        local: {
          schema: "",
          initialValue: '""',
          examples: [],
        },
      },
      modules: [
        {
          id: "network-profile-management",
          name: "network-profile-management",
          description:
            "Operations for managing network profile information including basic details and social media links",
          operations: [
            {
              id: "SET_ICON",
              name: "SET_ICON",
              description: "Sets the icon for the network profile",
              schema:
                "input SetIconInput {\n  icon: String\n  darkThemeIcon: String\n}",
              template: "Sets the icon for the network profile",
              reducer: "state.icon = action.input.icon || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_LOGO",
              name: "SET_LOGO",
              description: "Sets the logo for the network profile",
              schema:
                "input SetLogoInput {\n  logo: String\n  darkThemeLogo: String\n}",
              template: "Sets the logo for the network profile",
              reducer: "state.logo = action.input.logo || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_LOGO_BIG",
              name: "SET_LOGO_BIG",
              description: "Sets the big logo for the network profile",
              schema: "input SetLogoBigInput {\n  logoBig: String!\n}",
              template: "Sets the big logo for the network profile",
              reducer: "state.logoBig = action.input.logoBig || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_WEBSITE",
              name: "SET_WEBSITE",
              description: "Sets the website URL for the network profile",
              schema: "input SetWebsiteInput {\n  website: String\n}",
              template: "Sets the website URL for the network profile",
              reducer: "state.website = action.input.website || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_DESCRIPTION",
              name: "SET_DESCRIPTION",
              description: "Sets the description for the network profile",
              schema: "input SetDescriptionInput {\n  description: String!\n}",
              template: "Sets the description for the network profile",
              reducer: "state.description = action.input.description || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_CATEGORY",
              name: "SET_CATEGORY",
              description: "Sets the category for the network profile",
              schema:
                "input SetCategoryInput {\n  category: [NetworkCategory!]!\n}",
              template: "Sets the category for the network profile",
              reducer: "state.category = action.input.category || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_X",
              name: "SET_X",
              description:
                "Sets the X (Twitter) handle for the network profile",
              schema: "input SetXInput {\n  x: String\n}",
              template: "Sets the X (Twitter) handle for the network profile",
              reducer: "state.x = action.input.x || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_GITHUB",
              name: "SET_GITHUB",
              description: "Sets the GitHub username for the network profile",
              schema: "input SetGithubInput {\n  github: String\n}",
              template: "Sets the GitHub username for the network profile",
              reducer: "state.github = action.input.github || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_DISCORD",
              name: "SET_DISCORD",
              description:
                "Sets the Discord invite or username for the network profile",
              schema: "input SetDiscordInput {\n  discord: String\n}",
              template:
                "Sets the Discord invite or username for the network profile",
              reducer: "state.discord = action.input.discord || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_YOUTUBE",
              name: "SET_YOUTUBE",
              description: "Sets the YouTube channel for the network profile",
              schema: "input SetYoutubeInput {\n  youtube: String\n}",
              template: "Sets the YouTube channel for the network profile",
              reducer: "state.youtube = action.input.youtube || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "SET_PROFILE_NAME",
              name: "SET_PROFILE_NAME",
              description: "Sets the name of the network profile",
              schema: "input SetProfileNameInput {\n  name: String!\n}",
              template: "Sets the name of the network profile",
              reducer: "state.name = action.input.name || null;",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
    },
  ],
};
