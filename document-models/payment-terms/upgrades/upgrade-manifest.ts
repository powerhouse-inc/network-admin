import type { UpgradeManifest } from "document-model";
import { latestVersion, supportedVersions } from "./versions.js";

export const paymentTermsUpgradeManifest: UpgradeManifest<
  typeof supportedVersions
> = {
  documentType: "payment-terms",
  latestVersion,
  supportedVersions,
  upgrades: {},
};
