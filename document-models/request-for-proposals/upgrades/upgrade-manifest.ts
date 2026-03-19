import type { UpgradeManifest } from "document-model";
import { latestVersion, supportedVersions } from "./versions.js";

export const requestForProposalsUpgradeManifest: UpgradeManifest<
  typeof supportedVersions
> = {
  documentType: "powerhouse/rfp",
  latestVersion,
  supportedVersions,
  upgrades: {},
};
