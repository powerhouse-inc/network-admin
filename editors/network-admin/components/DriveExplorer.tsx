import {
  Breadcrumbs,
  CreateDocumentModal,
  useBreadcrumbs,
} from "@powerhousedao/design-system";
import {
  SidebarProvider,
  Sidebar,
  useSidebar,
  Icon,
  type SidebarNode,
} from "@powerhousedao/document-engineering";
import {
  addDocument,
  type DriveEditorProps,
  getSyncStatusSync,
  setSelectedNode,
  useAllFolderNodes,
  useDocumentModelModules,
  useDriveContext,
  useDriveSharingType,
  useEditorModules,
  useFileChildNodes,
  useFolderChildNodes,
  useSelectedDrive,
  useSelectedFolder,
  useSelectedNodePath,
  useUserPermissions,
} from "@powerhousedao/reactor-browser";
import type { DocumentModelModule } from "document-model";
import { useCallback, useRef, useState, useMemo } from "react";
import { CreateDocument } from "./CreateDocument.jsx";
import { EditorContainer } from "./EditorContainer.jsx";
import { FolderTree } from "./FolderTree.jsx";

/**
 * Main drive explorer component with sidebar navigation and content area.
 * Layout: Left sidebar (folder tree) + Right content area (files/folders + document editor)
 */
export function DriveExplorer(props: DriveEditorProps<any>) {
  // === DOCUMENT EDITOR STATE ===
  // Customize document opening/closing behavior here
  const [activeDocumentId, setActiveDocumentId] = useState<
    string | undefined
  >();
  const [openModal, setOpenModal] = useState(false);
  const selectedDocumentModel = useRef<DocumentModelModule | null>(null);
  const editorModules = useEditorModules();
  // === DRIVE CONTEXT HOOKS ===
  // Core drive operations and document models
  const {
    onAddFile,
    onAddFolder,
    onCopyNode,
    onDuplicateNode,
    onMoveNode,
    onRenameNode,
    showDeleteNodeModal,
  } = useDriveContext();

  const { isAllowedToCreateDocuments } = useUserPermissions();
  // === STATE MANAGEMENT HOOKS ===
  // Core state hooks for drive navigation
  const [selectedDrive] = useSelectedDrive(); // Currently selected drive
  const selectedFolder = useSelectedFolder(); // Currently selected folder
  const selectedNodePath = useSelectedNodePath();
  const sharingType = useDriveSharingType(selectedDrive?.header.id);

  // === NAVIGATION SETUP ===
  // Breadcrumbs for folder navigation
  const { breadcrumbs, onBreadcrumbSelected } = useBreadcrumbs({
    selectedNodePath: selectedNodePath as any,
    setSelectedNode: (node) => setSelectedNode(node as any),
    getNodeById: (id: string) => (allFolders.find(node => node.id === id) || fileChildren.find(node => node.id === id)) as any || null,
  });

  const folderChildren = useFolderChildNodes();
  const fileChildren = useFileChildNodes();

  // All folders for the sidebar tree view
  const allFolders = useAllFolderNodes();

  // Convert folders and files to SidebarNode format
  const sidebarNodes = useMemo(() => {
    const rootNode: SidebarNode = {
      id: "root",
      title: "Root",
      children: [
        // Add folders
        ...allFolders
          .filter(folder => !folder.parentFolder) // Only root folders
          .map(folder => ({
            id: folder.id,
            title: folder.name,
            children: [
              // Add child folders
              ...allFolders
                .filter(childFolder => childFolder.parentFolder === folder.id)
                .map(childFolder => ({
                  id: childFolder.id,
                  title: childFolder.name,
                  children: [
                    // Add files in this folder
                    ...fileChildren
                      .filter(file => file.parentFolder === childFolder.id)
                      .map(file => ({
                        id: file.id,
                        title: file.name,
                      }))
                  ]
                })),
              // Add files directly in this folder
              ...fileChildren
                .filter(file => file.parentFolder === folder.id)
                .map(file => ({
                  id: file.id,
                  title: file.name,
                }))
            ]
          })),
        // Add root-level files
        ...fileChildren
          .filter(file => !file.parentFolder)
          .map(file => ({
            id: file.id,
            title: file.name,
          }))
      ]
    };
    return [rootNode];
  }, [allFolders, fileChildren]);

  // Handle sidebar node selection
  const handleActiveNodeChange = useCallback((newNode: SidebarNode) => {
    if (newNode.id === "root") {
      setSelectedNode(undefined);
    } else {
      // Find if it's a folder or file
      const folder = allFolders.find(f => f.id === newNode.id);
      const file = fileChildren.find(f => f.id === newNode.id);
      
      if (folder) {
        setSelectedNode(folder);
      } else if (file) {
        setSelectedNode(file);
        setActiveDocumentId(file.id);
      }
    }
  }, [allFolders, fileChildren, setSelectedNode, setActiveDocumentId]);

  // === EVENT HANDLERS ===

  // Handle folder creation with optional name parameter
  const handleCreateFolder = useCallback(
    async (folderName?: string) => {
      let name: string | undefined = folderName;

      // If no name provided, prompt for it (for manual folder creation)
      if (!name) {
        const promptResult = prompt("Enter folder name:");
        name = promptResult || undefined;
      }

      if (name?.trim()) {
        try {
          await onAddFolder(name.trim(), selectedFolder);
        } catch (error) {
          console.error("Failed to create folder:", error);
        }
      }
    },
    [onAddFolder, selectedFolder],
  );

  // Handle document creation from modal
  const onCreateDocument = useCallback(
    async (fileName: string) => {
      setOpenModal(false);

      const documentModel = selectedDocumentModel.current;
      if (!documentModel || !selectedDrive?.header.id) return;

      try {
        const node = await addDocument(
          selectedDrive.header.id,
          fileName,
          documentModel.documentModel.id,
          selectedFolder?.id,
        );

        selectedDocumentModel.current = null;

        if (node) {
          // Customize: Auto-open created document by uncommenting below
          // setActiveDocumentId(node.id);
        }
      } catch (error) {
        console.error("Failed to create document:", error);
      }
    },
    [addDocument, editorModules, selectedDrive?.header.id, selectedFolder?.id],
  );

  // === DOCUMENT EDITOR DATA ===
  // Filter available document types here if needed
  const documentModelModules = useDocumentModelModules();

  // Get active document and its editor components
  const activeDocument = activeDocumentId
    ? fileChildren.find((file) => file.id === activeDocumentId)
    : undefined;

  const documentModelModule = activeDocument
    ? documentModelModules?.find(
      (m) => m.documentModel.id === activeDocument.documentType,
    )
    : null;

  const editorModule = activeDocument
    ? editorModules?.find((e) =>
      e.documentTypes.includes(activeDocument.documentType),
    )
    : null;

  // === RENDER ===
  return (
    <SidebarProvider>
      <div className="flex h-full">
        {/* === LEFT SIDEBAR: Folder Navigation === */}
        <Sidebar
          nodes={sidebarNodes}
          activeNodeId={selectedFolder?.id || activeDocumentId}
          onActiveNodeChange={handleActiveNodeChange}
          sidebarTitle="Network Admin"
          showSearchBar={true}
          allowPinning={true}
          resizable={true}
          initialWidth={256}
          maxWidth={400}
        />

      {/* === RIGHT CONTENT AREA: Files/Folders AND Document Editor === */}
      <div className="flex-1 flex">
        {/* === FOLDER CONTENTS VIEW - Always visible === */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* === HEADER SECTION === */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {/* Folder title */}
                <h2 className="text-lg font-semibold">
                  {selectedFolder
                    ? `Contents of "${selectedFolder.name}"`
                    : "Root Contents"}
                </h2>
                {/* Customize: Add more action buttons here */}
                {isAllowedToCreateDocuments && (
                  <button
                    onClick={() => handleCreateFolder()}
                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    + New Folder
                  </button>
                )}
              </div>

              {/* Navigation breadcrumbs */}
              {breadcrumbs.length > 1 && (
                <div className="border-b border-gray-200 pb-3">
                  <Breadcrumbs
                    breadcrumbs={breadcrumbs}
                    createEnabled={isAllowedToCreateDocuments}
                    onCreate={handleCreateFolder}
                    onBreadcrumbSelected={onBreadcrumbSelected}
                  />
                </div>
              )}
            </div>

            {/* === FOLDERS SECTION === */}
            {/* Customize grid layout by changing grid-cols-1 */}
            {folderChildren.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  📁 Folders
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {folderChildren.map((folderNode) =>
                    folderNode && folderNode.id ? (
                      <div key={folderNode.id} className="p-2 border rounded">
                        <div className="font-medium">📁 {folderNode.name}</div>
                        <div className="text-sm text-gray-500">Folder</div>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => setSelectedNode(folderNode)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => {
                              const newName = prompt("Enter new name:", folderNode.name || "");
                              if (newName && newName.trim() && newName !== folderNode.name) {
                                try {
                                  onRenameNode(newName.trim(), folderNode);
                                } catch (error) {
                                  console.error("Failed to rename:", error);
                                  alert("Failed to rename folder. Please try again.");
                                }
                              }
                            }}
                            className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => showDeleteNodeModal(folderNode)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key="invalid-folder" className="p-2 border rounded bg-gray-100">
                        <div className="text-sm text-gray-500">Invalid folder data</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* === FILES/DOCUMENTS SECTION === */}
            {/* Customize grid layout by changing grid-cols-1 */}
            {fileChildren.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  📄 Documents
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {fileChildren.map((fileNode) => (
                    <div key={fileNode.id} className="p-2 border rounded">
                      <div className="font-medium">{fileNode.name}</div>
                      <div className="text-sm text-gray-500">{fileNode.documentType}</div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedNode(fileNode);
                            setActiveDocumentId(fileNode.id);
                          }}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => {
                            console.log("FileNode:", fileNode);
                            if (!fileNode || !fileNode.id) {
                              console.error("FileNode is undefined or missing id");
                              return;
                            }
                            const newName = prompt("Enter new name:", fileNode.name || "");
                            if (newName && newName.trim() && newName !== fileNode.name) {
                              try {
                                onRenameNode(newName.trim(), fileNode);
                              } catch (error) {
                                alert("Failed to rename document. Please try again.");
                              }
                            }
                          }}
                          className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => showDeleteNodeModal(fileNode)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === EMPTY STATE === */}
            {/* Network Admin empty state message */}
            {folderChildren.length === 0 && fileChildren.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">🗂️ This folder is empty</p>
                <p className="mt-2 text-sm">
                  Create your first document or folder below
                </p>
              </div>
            )}

            {/* === DOCUMENT CREATION SECTION === */}
            {/* Component for creating new documents */}
            <CreateDocument />
          </div>
        </div>

        {/* === DOCUMENT EDITOR VIEW - Appears on the right when a document is selected === */}
        {activeDocument && documentModelModule && editorModule && (
          <div className="w-1/2 border-l border-gray-200">
            <EditorContainer
              handleClose={() => setActiveDocumentId(undefined)}
              hideToolbar={true}
            />
          </div>
        )}
      </div>

      {/* === DOCUMENT CREATION MODAL === */}
      {/* Modal for entering document name after selecting type */}
      <CreateDocumentModal
        onContinue={onCreateDocument}
        onOpenChange={(open) => setOpenModal(open)}
        open={openModal}
      />
      </div>
    </SidebarProvider>
  );
}
