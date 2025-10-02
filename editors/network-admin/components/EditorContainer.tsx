import { getRevisionFromDate, useTimelineItems } from "@powerhousedao/common";
import {
  DocumentToolbar,
  RevisionHistory,
  type TimelineItem,
} from "@powerhousedao/design-system";
import {
  exportFile,
  useEditorModuleById,
  useSelectedDrive,
  useDocumentById,
  addDocument,
  useNodes,
  useFallbackEditorModule,
  dispatchActions,
} from "@powerhousedao/reactor-browser";
import { Action, PHDocument } from "document-model";
import { Suspense, useCallback, useState } from "react";
import { actions as rfpActions } from "../../../document-models/request-for-proposals/index.js";
import { ScopeOfWork } from "@powerhousedao/project-management/document-models";

/**
 * Document editor container that wraps individual document editors.
 * Handles document loading, toolbar, revision history, and dynamic editor loading.
 * Customize toolbar actions and editor context here.
 */
export const EditorContainer = (props: {
  handleClose: () => void;
  hideToolbar?: boolean;
  activeDocumentId: string;
  setActiveDocumentId: (id: string) => void;
  setActiveSidebarNodeId: (id: string) => void;
}) => {
  const {
    handleClose,
    hideToolbar = false,
    activeDocumentId,
    setActiveDocumentId,
    setActiveSidebarNodeId,
  } = props;
  // UI state for revision history and timeline
  const [selectedTimelineItem, setSelectedTimelineItem] =
    useState<TimelineItem | null>(null);

  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  const [selectedDocument, dispatch] = useDocumentById(
    props.activeDocumentId
  ) as [
    PHDocument | undefined,
    (actionOrActions: Action | Action[] | undefined) => void,
  ];
  const [selectedDrive] = useSelectedDrive();

  const nodes = useNodes();
  const folderId =
    nodes?.find((node) => node.id === selectedDocument?.header.id)
      ?.parentFolder || undefined;

  const createRfpDocument = useCallback(async () => {
    const rfpDocName = `RFP-${(selectedDocument?.state as any).global?.title || "Untitled"}`;
    const rfpDocCode = `RFP-${(selectedDocument?.state as any).global?.code || ""}`;
    try {
      const createdNode = await addDocument(
        selectedDrive?.header.id || "",
        rfpDocName,
        "powerhouse/rfp",
        folderId,
        undefined,
        undefined,
        "request-for-proposals-editor"
      );
      if (!createdNode?.id) {
        console.error("Error creating RFP document", rfpDocName);
        return null;
      }
      await dispatchActions(
        rfpActions.editRfp({ title: rfpDocName, code: rfpDocCode }),
        createdNode.id
      );
      return createdNode;
    } catch (error) {
      console.error("Error creating RFP document", error);
      return null;
    }
  }, [selectedDrive, (selectedDocument?.state as any).global, folderId]);

  const createSowDocument = useCallback(async () => {
    const sowDocName = `SOW-${(selectedDocument?.state as any).global?.title || "Untitled"}`;
    try {
      const createdNode = await addDocument(
        selectedDrive?.header.id || "",
        sowDocName,
        "powerhouse/scopeofwork",
        folderId,
        undefined,
        undefined,
        "scope-of-work-editor"
      );
      if (!createdNode?.id) {
        console.error("Error creating SOW document", sowDocName);
        return null;
      }
      await dispatchActions(
        ScopeOfWork.actions.editScopeOfWork({ title: sowDocName }),
        createdNode.id
      );
      return createdNode;
    } catch (error) {
      console.error("Error creating SOW document", error);
      return null;
    }
  }, [selectedDrive, (selectedDocument?.state as any).global, folderId]);

  const createPaymentTermsDocument = useCallback(async () => {
    const paymentTermsDocName = `Payment Terms-${(selectedDocument?.state as any).global?.title || "Untitled"}`;
    try {
      const createdNode = await addDocument(
        selectedDrive?.header.id || "",
        paymentTermsDocName,
        "payment-terms",
        folderId,
        undefined,
        undefined,
        "payment-terms-editor"
      );
      if (!createdNode?.id) {
        console.error(
          "Error creating Payment Terms document",
          paymentTermsDocName
        );
        return null;
      }
      return createdNode;
    } catch (error) {
      console.error("Error creating Payment Terms document", error);
      return null;
    }
  }, [selectedDrive, (selectedDocument?.state as any).global, folderId]);

  // Timeline data for revision history
  const timelineItems = useTimelineItems(
    selectedDocument?.header.id,
    selectedDocument?.header.createdAtUtcIso,
    selectedDrive?.header.id
  );

  let preferredEditor = useFallbackEditorModule(
    selectedDocument?.header.documentType
  );

  const editorModule = useEditorModuleById(
    selectedDocument?.header.meta?.preferredEditor ||
      preferredEditor?.id ||
      undefined
  );
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

  return (
    <div className="">
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
              onSwitchboardLinkClick={() => {}} // Customize switchboard integration
              title={selectedDocument.header.name}
              timelineButtonVisible={editorModule.config.timelineEnabled}
              timelineItems={timelineItems.data}
              onTimelineItemClick={setSelectedTimelineItem}
            />
          )}
          <EditorComponent
            key={selectedDocument.header.id}
            context={{
              readMode: !!selectedTimelineItem,
              selectedTimelineRevision: getRevisionFromDate(
                selectedTimelineItem?.startDate,
                selectedTimelineItem?.endDate,
                selectedDocument.operations.global
              ),
            }}
            dispatch={dispatch}
            document={selectedDocument}
            error={console.error}
            setActiveSidebarNodeId={setActiveSidebarNodeId}
            setActiveDocumentId={setActiveDocumentId}
            createSow={createSowDocument}
            createPaymentTerms={createPaymentTermsDocument}
            documentId={selectedDocument.header.id}
          />
        </Suspense>
      )}
    </div>
  );
};
