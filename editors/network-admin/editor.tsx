import { WagmiContext } from "@powerhousedao/design-system";
import {
  AnalyticsProvider,
  useAppConfig,
  type DriveEditorProps,
} from "@powerhousedao/reactor-browser";
import { DriveExplorer } from "./components/DriveExplorer.js";
import { withDropZone } from "./utils/withDropZone.js";

export type IProps = DriveEditorProps & {
  context?: any;
  document?: any;
};

/**
 * Base editor component that renders the drive explorer interface.
 * Customize document opening behavior and drive-level actions here.
 */
export function BaseEditor(props: IProps) {
  const { context, document } = props;
  return (
    <div style={{ height: "100%" }}>
      <DriveExplorer document={document} context={context} />
    </div>
  );
}

// Wrap base editor with drop zone functionality
const BaseEditorWithDropZone = withDropZone(BaseEditor);

/**
 * Main editor entry point with required providers.
 */
export default function Editor(props: IProps) {
  const appConfig = useAppConfig();
  const analyticsDatabaseName = appConfig?.analyticsDatabaseName;
  return (
    // Required context providers for drive functionality
    <WagmiContext>
      <AnalyticsProvider databaseName={analyticsDatabaseName}>
        <BaseEditorWithDropZone {...props} />
      </AnalyticsProvider>
    </WagmiContext>
  );
}
