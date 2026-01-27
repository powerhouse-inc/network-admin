import { DateTime } from "luxon";
import type {
  AnalyticsSeriesInput,
  IAnalyticsStore,
} from "@powerhousedao/analytics-engine-core";
import { AnalyticsPath } from "@powerhousedao/analytics-engine-core";
import type { InternalTransmitterUpdate, IProcessor } from "document-drive";

export class MyProcessorProcessor implements IProcessor {
  private readonly NAMESPACE = "MyProcessor";

  private readonly inputs: AnalyticsSeriesInput[] = [];

  constructor(private readonly analyticsStore: IAnalyticsStore) {
    //
  }

  async onStrands(strands: InternalTransmitterUpdate[]): Promise<void> {
    if (strands.length === 0) {
      return;
    }

    for (const strand of strands) {
      if (strand.operations.length === 0) {
        continue;
      }

      const source = AnalyticsPath.fromString(
        `/${this.NAMESPACE}/${strand.driveId}/${strand.documentId}/${strand.branch}/${strand.scope}`,
      );

      // clear source if we have already inserted these analytics
      const firstOp = strand.operations[0];
      if (firstOp.index === 0) {
        await this.clearSource(source);
      }

      if (strand.documentType === "powerhouse/workstream") {
        for (const operation of strand.operations) {
          const timestamp = operation.timestampUtcMs
            ? DateTime.fromMillis(parseInt(operation.timestampUtcMs))
            : DateTime.now();

          const state = (operation as any).state || strand.state;

          // Record analytics for every operation to ensure we don't miss state changes
          this.addWorkstreamAnalytics(
            state,
            source,
            timestamp,
            strand.documentId,
            operation.index,
          );
        }
      }
    }

    // batch insert
    if (this.inputs.length > 0) {
      await this.analyticsStore.addSeriesValues(this.inputs);

      this.inputs.length = 0;
    }
  }

  async onDisconnect() {
    //
  }

  private addWorkstreamAnalytics(
    state: any,
    source: AnalyticsPath,
    timestamp: DateTime,
    documentId: string,
    operationIndex: number,
  ) {
    if (!state) return;

    const dimensions: Record<string, AnalyticsPath> = {};

    if (state.status) {
      dimensions.status = AnalyticsPath.fromString(`/${state.status}`);
    }

    if (state.client?.id) {
      dimensions.network = AnalyticsPath.fromString(`/${state.client.id}`);
    }

    const initialProposal = state.initialProposal;
    if (initialProposal?.status) {
      dimensions.initial_proposal_status = AnalyticsPath.fromString(
        `/${initialProposal.status}`,
      );
    }

    if (state.client?.name) {
      dimensions.network_slug = AnalyticsPath.fromString(
        `/${state.client.name.toLowerCase().split(" ").join("-")}`,
      );
    }

    if (state.title) {
      dimensions.workstream_slug = AnalyticsPath.fromString(
        `/${state.title.toLowerCase().split(" ").join("-")}`,
      );
      dimensions.workstream_title = AnalyticsPath.fromString(
        `/${state.title.split("/").join("-")}`,
      );
    }

    if (initialProposal?.author?.id) {
      dimensions.initial_proposal_author = AnalyticsPath.fromString(
        `/${initialProposal.author.id}`,
      );
    }

    if (initialProposal?.sow) {
      dimensions.sow_phid = AnalyticsPath.fromString(`/${initialProposal.sow}`);
    }

    dimensions.workstream_phid = AnalyticsPath.fromString(`/${documentId}`);
    dimensions.operation_index = AnalyticsPath.fromString(`/${operationIndex}`);

    this.inputs.push({
      start: timestamp,
      source,
      metric: "workstream",
      value: 1,
      dimensions,
    });
  }

  private async clearSource(source: AnalyticsPath) {
    try {
      await this.analyticsStore.clearSeriesBySource(source, true);
    } catch (e) {
      console.error(e);
    }
  }
}
