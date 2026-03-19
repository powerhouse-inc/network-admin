import type { UpgradeManifest } from "document-model";
import { buildersUpgradeManifest } from "./builders/upgrades/upgrade-manifest.js";
import { networkProfileUpgradeManifest } from "./network-profile/upgrades/upgrade-manifest.js";
import { paymentTermsUpgradeManifest } from "./payment-terms/upgrades/upgrade-manifest.js";
import { requestForProposalsUpgradeManifest } from "./request-for-proposals/upgrades/upgrade-manifest.js";
import { workstreamUpgradeManifest } from "./workstream/upgrades/upgrade-manifest.js";

export const upgradeManifests: UpgradeManifest<readonly number[]>[] = [
  buildersUpgradeManifest,
  networkProfileUpgradeManifest,
  paymentTermsUpgradeManifest,
  requestForProposalsUpgradeManifest,
  workstreamUpgradeManifest,
];
