import { WagmiContext } from "@powerhousedao/design-system";
import {
  AnalyticsProvider,
  useAppConfig,
  type DriveEditorProps,
} from "@powerhousedao/reactor-browser";
import { DriveExplorer } from "./components/DriveExplorer.js";

/**
 * Base editor component that renders the drive explorer interface.
 * Customize document opening behavior and drive-level actions here.
 */
export function BaseEditor(props: any) {
  const { context, document } = props;
  return (
    <div className="h-full w-full">
      <DriveExplorer document={document} context={context} />
    </div>
  );
}

/**
 * Main editor entry point with required providers.
 */
export default function Editor(props: any) {
  const appConfig = useAppConfig();
  const analyticsDatabaseName = appConfig?.analyticsDatabaseName;
  return (
    // Required context providers for drive functionality
    <WagmiContext>
      <AnalyticsProvider databaseName={analyticsDatabaseName}>
        <BaseEditor {...props} />
      </AnalyticsProvider>
    </WagmiContext>
  );
}
