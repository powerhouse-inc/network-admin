import { getRevisionFromDate, useTimelineItems } from "@powerhousedao/common";
import {
  DefaultEditorLoader,
  DocumentToolbar,
  RevisionHistory,
  type TimelineItem,
} from "@powerhousedao/design-system";
import {
  exportFile,
  useEditorModuleById,
  useSelectedDocument,
  useSelectedDrive,
  useDocumentById,
  useEditorModulesForDocumentType
} from "@powerhousedao/reactor-browser";
import { Suspense, useCallback, useState } from "react";

/**
 * Document editor container that wraps individual document editors.
 * Handles document loading, toolbar, revision history, and dynamic editor loading.
 * Customize toolbar actions and editor context here.
 */
export const EditorContainer = (props: { handleClose: () => void; hideToolbar?: boolean; activeDocumentId: string }) => {
  const { handleClose, hideToolbar = false, activeDocumentId } = props;
  // UI state for revision history and timeline
  const [selectedTimelineItem, setSelectedTimelineItem] =
    useState<TimelineItem | null>(null);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [selectedDocument, dispatch] = useDocumentById(props.activeDocumentId);
  const [selectedDrive] = useSelectedDrive();


  // Timeline data for revision history
  const timelineItems = useTimelineItems(
    selectedDocument?.header.id,
    selectedDocument?.header.createdAtUtcIso,
    selectedDrive?.header.id,
  );
  const editorModule = useEditorModuleById(
    selectedDocument?.header.meta?.preferredEditor
  );

  console.log("selectedDocument", selectedDocument);

  // Document export functionality - customize export behavior here
  const onExport = useCallback(async () => {
    if (selectedDocument) {
      await exportFile(selectedDocument);
    }
  }, [selectedDocument]);

  // Loading state component
  const loadingContent = (
    <div className="flex h-full flex-1 items-center justify-center">
      <div>sth is wrong fix yourself</div>
    </div>
  );


  if (!selectedDocument) return loadingContent;

  // Dynamically load the appropriate editor component for this document type
  const EditorComponent = editorModule?.Component;
  if (!EditorComponent) return loadingContent;


  return <div className="">
    {showRevisionHistory ? (
      // Revision history view
      <RevisionHistory
        documentId={selectedDocument.header.id}
        documentTitle={selectedDocument.header.name}
        globalOperations={selectedDocument.operations.global}
        key={selectedDocument.header.id}
        localOperations={selectedDocument.operations.local}
        onClose={() => setShowRevisionHistory(false)}
      />
    ) : (
      // Main editor view
      <Suspense fallback={loadingContent}>
        {!hideToolbar && (
          <DocumentToolbar
            onClose={handleClose}
            onExport={onExport}
            onShowRevisionHistory={() => setShowRevisionHistory(true)}
            onSwitchboardLinkClick={() => { }} // Customize switchboard integration
            title={selectedDocument.header.name}
            timelineButtonVisible={editorModule.config.timelineEnabled}
            timelineItems={timelineItems.data}
            onTimelineItemClick={setSelectedTimelineItem}
          />
        )}
        <EditorComponent
          context={{
            readMode: !!selectedTimelineItem,
            selectedTimelineRevision: getRevisionFromDate(
              selectedTimelineItem?.startDate,
              selectedTimelineItem?.endDate,
              selectedDocument.operations.global,
            ),
          }}
          dispatch={dispatch}
          document={selectedDocument}
          error={console.error}
        />
      </Suspense>
    )}
  </div>
};
