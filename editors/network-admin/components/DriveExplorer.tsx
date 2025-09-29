import {
  Button,
  CreateDocumentModal,
  useDrop,
} from "@powerhousedao/design-system";
import {
  Sidebar,
  SidebarProvider,
  type SidebarNode,
} from "@powerhousedao/document-engineering";
import {
  addDocument,
  type DriveEditorProps,
  getSyncStatusSync,
  setSelectedNode,
  useAllFolderNodes,
  useDocumentById,
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
  useAllDocuments,
  useNodes,
  dispatchActions,
} from "@powerhousedao/reactor-browser";
import {
  actions,
  PHDocument,
  PHDocumentState,
  type DocumentModelModule,
} from "document-model";
import { type Node } from "document-drive";
import { twMerge } from "tailwind-merge";
import { useCallback, useRef, useState, useMemo } from "react";
import { EditorContainer } from "./EditorContainer.js";
import { editWorkstream } from "../../../document-models/workstream/gen/creators.js";

/**
 * Main drive explorer component with sidebar navigation and content area.
 * Layout: Left sidebar (folder tree) + Right content area (files/folders + document editor)
 */
export function DriveExplorer(props: any) {
  // === DOCUMENT EDITOR STATE ===
  // Customize document opening/closing behavior here
  const [activeDocumentId, setActiveDocumentId] = useState<
    string | undefined
  >();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRootNode, setSelectedRootNode] =
    useState<string>("workstreams");
  const [modalDocumentType, setModalDocumentType] = useState<string>(
    "powerhouse/workstream"
  );
  const selectedDocumentModel = useRef<DocumentModelModule | null>(null);
  const editorModules = useEditorModules();

  // Track the last created folder for drag and drop targeting
  const [lastCreatedFolder, setLastCreatedFolder] = useState<Node | undefined>(
    undefined
  );
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
  const allDocuments = useAllDocuments();

  // All folders for the sidebar tree view
  const allFolders = useAllFolderNodes();

  const folderChildren = useFolderChildNodes();
  const fileChildren = useFileChildNodes();
  const filesWithDocuments = fileChildren.map((file) => {
    const document = allDocuments?.find(
      (doc: PHDocument) => doc.header.id === file.id
    );
    const state = (document?.state as any)?.global;
    return {
      ...file,
      state,
    };
  });

  const networkAdminDocuments = allDocuments?.filter(
    (doc) =>
      doc.header.documentType === "powerhouse/network-profile" ||
      doc.header.documentType === "powerhouse/workstream" ||
      doc.header.documentType === "powerhouse/scopeofwork" ||
      doc.header.documentType === "powerhouse/rfp" ||
      doc.header.documentType === "payment-terms"
  );

  // Find the folder containing the most recent workstream document
  const getMostRecentWorkstreamFolder = useCallback(() => {
    const workstreamFiles = fileChildren.filter(
      (file) => file.documentType === "powerhouse/workstream"
    );
    if (workstreamFiles.length === 0) return undefined;

    // Sort by creation time (assuming newer files have higher IDs or we can use a different method)
    const mostRecentWorkstream = workstreamFiles[workstreamFiles.length - 1];

    // Find the folder that contains this workstream
    if (mostRecentWorkstream.parentFolder) {
      return allFolders.find(
        (folder) => folder.id === mostRecentWorkstream.parentFolder
      );
    }

    return undefined;
  }, [fileChildren, allFolders]);

  // === DROP HOOKS ===
  const mostRecentWorkstreamFolder = getMostRecentWorkstreamFolder();
  const dropTargetNode =
    lastCreatedFolder ||
    mostRecentWorkstreamFolder ||
    selectedFolder ||
    undefined;

  // Create a custom onAddFile wrapper that ensures the correct folder is used
  const onAddFileWithTarget = useCallback(
    (file: File, targetFolder?: Node) => {
      console.log("onAddFileWithTarget called with:", {
        file,
        targetFolder,
        dropTargetNode,
      });
      // Use the dropTargetNode as the folder, not the targetFolder parameter
      return onAddFile(file, dropTargetNode);
    },
    [onAddFile, dropTargetNode]
  );

  const { isDropTarget, dropProps } = useDrop({
    node: dropTargetNode,
    onAddFile: onAddFileWithTarget,
    onCopyNode,
    onMoveNode,
  });

  // check if workstream doc is created, set isWorkstreamCreated to true
  const isWorkstreamCreated = networkAdminDocuments?.some(
    (doc) => doc.header.documentType === "powerhouse/workstream"
  ) || false;
  //check if network profile doc is created, set isNetworkProfileCreated to true
  const isNetworkProfileCreated = networkAdminDocuments?.some(
    (doc) => doc.header.documentType === "powerhouse/network-profile"
  ) || false;

  // Convert network admin documents to SidebarNode format
  const sidebarNodes = useMemo((): SidebarNode[] => {
    // Group documents by type
    const workstreamDocs = networkAdminDocuments?.filter(
      (doc) => doc.header.documentType === "powerhouse/workstream"
    ) || [];
    const scopeOfWorkDocs = networkAdminDocuments?.filter(
      (doc) => doc.header.documentType === "powerhouse/scopeofwork"
    ) || [];
    const rfpDocs = networkAdminDocuments?.filter(
      (doc) => doc.header.documentType === "powerhouse/rfp"
    ) || [];
    const paymentTermsDocs = networkAdminDocuments?.filter(
      (doc) => doc.header.documentType === "payment-terms"
    ) || [];
    const networkProfileDocs = networkAdminDocuments?.filter(
      (doc) => doc.header.documentType === "powerhouse/network-profile"
    ) || [];

    const workstreamsNode: SidebarNode = {
      id: "workstreams",
      title: "Workstreams",
      children: [
        // Add workstream documents
        ...workstreamDocs.map((doc) => ({
          id: `editor-${doc.header.id}`,
          title: `${(doc.state as any)?.global?.code || ""} - ${(doc.state as any)?.global?.title || doc.header.name}`,
        })),
        // Add scope of work documents
        ...scopeOfWorkDocs.map((doc) => ({
          id: `editor-${doc.header.id}`,
          title: `${(doc.state as any)?.global?.title || doc.header.name}`,
        })),
        // Add RFP documents
        ...rfpDocs.map((doc) => ({
          id: `editor-${doc.header.id}`,
          title: `${(doc.state as any)?.global?.code || ""} - ${(doc.state as any)?.global?.title || doc.header.name}`,
        })),
        // Add payment terms documents
        ...paymentTermsDocs.map((doc) => ({
          id: `editor-${doc.header.id}`,
          title: `${(doc.state as any)?.global?.code || ""} - ${(doc.state as any)?.global?.title || doc.header.name}`,
        })),
      ],
    };

    const networkInfoNode: SidebarNode = {
      id: "network-information",
      title: "Network Information",
      children: [
        // Add network profile documents
        ...networkProfileDocs.map((doc) => ({
          id: `editor-${doc.header.id}`,
          title: doc.header.name,
        })),
      ],
    };

    return [workstreamsNode, networkInfoNode];
  }, [networkAdminDocuments]);

  // Handle sidebar node selection
  const handleActiveNodeChange = useCallback(
    (nodeId: string) => {
      console.log("nodeId", nodeId);

      // Clear the last created folder when navigating to a different node
      setLastCreatedFolder(undefined);

      // Find the node by ID
      const findNodeById = (
        nodes: SidebarNode[],
        id: string
      ): SidebarNode | null => {
        for (const node of nodes) {
          if (node.id === id) {
            return node;
          }
          if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const newNode = findNodeById(sidebarNodes, nodeId);
      if (!newNode) return;

      if (newNode.id === "workstreams") {
        setActiveDocumentId(undefined);
        setSelectedRootNode("workstreams");
      } else if (newNode.id === "network-information") {
        setActiveDocumentId(undefined);
        setSelectedRootNode("network-information");
        // Handle network information display
      } else if (newNode.id.startsWith("editor-")) {
        // Extract file ID from editor-{file.id} format
        const fileId = newNode.id.replace("editor-", "");
        const file = fileChildren.find((f) => f.id === fileId);
        if (file?.documentType === "powerhouse/scopeofwork") {
          setSelectedNode(file);
        } else {
          setActiveDocumentId(fileId);
        }
      } else {
        // Find if it's a folder
        const folder = allFolders.find((f) => f.id === newNode.id);

        if (folder) {
          setActiveDocumentId(undefined);
        }
      }
    },
    [
      allFolders,
      fileChildren,
      setSelectedNode,
      setActiveDocumentId,
      sidebarNodes,
    ]
  );

  // === EVENT HANDLERS ===

  // Display function that switches views based on active node ID
  const displayActiveNode = (activeNodeId: string) => {
    // Determine the type of node and extract the actual ID
    let nodeType = "unknown";
    let actualId = activeNodeId;

    if (activeNodeId === "workstreams") {
      nodeType = "workstreams";
    } else if (activeNodeId === "network-information") {
      nodeType = "workstreams";
    } else if (activeNodeId.startsWith("editor-")) {
      nodeType = "file";
      actualId = activeNodeId.replace("editor-", "");
    } else {
      // Check if it's a folder
      const folder = allFolders.find((f) => f.id === activeNodeId);
      if (folder) {
        nodeType = "folder";
      } else {
        // Check if it's a file (direct ID)
        const file = fileChildren.find((f) => f.id === activeNodeId);
        if (file) {
          nodeType = "file";
          actualId = activeNodeId; // Use the ID as-is for files
        }
      }
    }

    switch (nodeType) {
      case "workstreams":
        return (
          <div className="mt-10 p-4 flex flex-col items-center justify-center">
            <div className="space-y-6 flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">
                Welcome to the Network Admin
              </h1>
              <p>
                Create a new workstream to get started, or select an existing
                workstream on the left
              </p>
              <div className="flex gap-3">
                <Button
                  color="dark" // Customize button appearance
                  size="medium"
                  className="cursor-pointer hover:bg-gray-600 hover:text-white"
                  title={"Create Workstream Document"}
                  aria-description={"Create Workstream Document"}
                  onClick={() => {
                    setModalDocumentType("powerhouse/workstream");
                    setOpenModal(true);
                  }}
                  disabled={isWorkstreamCreated}
                >
                  <span>
                    {/* {/* {/* <span className="text-sm"> */}
                    Create Workstream Document
                  </span>
                </Button>

                <Button
                  color="dark" // Customize button appearance
                  size="medium"
                  className="cursor-pointer hover:bg-gray-600 hover:text-white"
                  title={"Create Network Profile Document"}
                  aria-description={"Create Network Profile Document"}
                  onClick={() => {
                    setModalDocumentType("powerhouse/network-profile");
                    setOpenModal(true);
                  }}
                  disabled={isNetworkProfileCreated}
                >
                  <span>Create Network Profile Document</span>
                </Button>
              </div>
            </div>

            {/* === DOCUMENTS TABLE === */}
            {networkAdminDocuments && networkAdminDocuments.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  📄 Documents
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {networkAdminDocuments.map((document) => {
                        // Find the corresponding file node for actions
                        const fileNode = fileChildren.find(
                          (file) => file.id === document.header.id
                        );
                        
                        return (
                          <tr key={document.header.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {document.header.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {document.header.documentType}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {document.header.createdAtUtcIso
                                  ? new Date(
                                      document.header.createdAtUtcIso
                                    ).toLocaleDateString() +
                                      " " +
                                      new Date(
                                        document.header.createdAtUtcIso
                                      ).toLocaleTimeString()
                                  : "Unknown"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (fileNode) {
                                      setSelectedNode(fileNode);
                                    }
                                    setActiveDocumentId(document.header.id);
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                >
                                  Open
                                </button>
                                <button
                                  onClick={() => {
                                    if (!fileNode || !fileNode.id) return;
                                    const newName = prompt(
                                      "Enter new name:",
                                      document.header.name || ""
                                    );
                                    if (
                                      newName &&
                                      newName.trim() &&
                                      newName !== document.header.name
                                    ) {
                                      try {
                                        onRenameNode(newName.trim(), fileNode);
                                      } catch (error) {
                                        alert(
                                          "Failed to rename document. Please try again."
                                        );
                                      }
                                    }
                                  }}
                                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (fileNode) {
                                      showDeleteNodeModal(fileNode);
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Unknown node type: {nodeType}</div>;
    }
  };

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
          const createdFolder = await onAddFolder(name.trim(), selectedFolder);
          // Track the created folder for drag and drop targeting
          console.log("Created manual folder:", createdFolder);
          setLastCreatedFolder(createdFolder);
        } catch (error) {
          console.error("Failed to create folder:", error);
        }
      }
    },
    [onAddFolder, selectedFolder]
  );

  // Handle document creation from modal
  const onCreateDocument = useCallback(
    async (fileName: string) => {
      setOpenModal(false);

      // Use the document type that was set when the modal was opened
      const documentType = modalDocumentType;

      // Determine editor type based on document type
      const editorType =
        documentType === "powerhouse/network-profile"
          ? "network-profile-editor"
          : "workstream-editor";

      console.log(`Creating ${documentType} document: ${fileName}`);

      try {
        const node = await addDocument(
          selectedDrive?.header.id || "",
          fileName,
          documentType,
          undefined, // creating in root folder
          undefined,
          undefined,
          editorType
        );

        if (!node?.id) {
          console.error("Error creating document", fileName);
          return;
        }

        await dispatchActions(editWorkstream({ title: fileName }), node.id);

        selectedDocumentModel.current = null;

        console.log("Created document node", node);

        if (node) {
          // Customize: Auto-open created document by uncommenting below
          // setActiveDocumentId(node.id);

          // Refresh the sidebar by triggering a re-render
          // Set the root node based on the document type that was created
          if (documentType === "powerhouse/network-profile") {
            setSelectedRootNode("network-information");
          } else {
            setSelectedRootNode("workstreams");
          }
        }
      } catch (error) {
        console.error("Failed to create document:", error);
      }
    },
    [
      addDocument,
      selectedDrive?.header.id,
      selectedFolder?.id,
      modalDocumentType,
    ]
  );

  // Filter available document types here if needed
  const documentModelModules = useDocumentModelModules();

  // Get active document and its editor components
  const activeDocument = activeDocumentId
    ? fileChildren.find((file) => file.id === activeDocumentId)
    : undefined;

  const documentModelModule = activeDocument
    ? documentModelModules?.find(
        (m) => m.documentModel.id === activeDocument.documentType
      )
    : null;

  const editorModule = activeDocument
    ? editorModules?.find((e) =>
        e.documentTypes.includes(activeDocument.documentType)
      )
    : null;

  // === RENDER ===
  return (
    <SidebarProvider nodes={sidebarNodes}>
      {/* === LEFT SIDEBAR: Folder Navigation === */}
      <div className="flex h-full">
        <Sidebar
          className={String.raw`
            [&_.sidebar\\_\\_item--active]:bg-yellow-500
          `}
          nodes={sidebarNodes}
          activeNodeId={selectedFolder?.id || activeDocumentId}
          onActiveNodeChange={(node) => handleActiveNodeChange(node.id)}
          sidebarTitle="Network Admin"
          showSearchBar={true}
          allowPinning={true}
          resizable={true}
          initialWidth={300}
          maxWidth={500}
          enableMacros={2}
          handleOnTitleClick={() => {
            setActiveDocumentId(undefined);
            setSelectedRootNode("workstreams");
          }}
        />

        {/* === MAIN CONTENT AREA === */}
        <div className="flex-1 overflow-y-auto">
          <div
            {...dropProps}
            className={twMerge(
              "rounded-md border-2 border-transparent ",
              isDropTarget && "border-dashed border-blue-100"
            )}
          >
            {activeDocumentId ? (
              <EditorContainer
                handleClose={() => setActiveDocumentId(undefined)}
                hideToolbar={false}
                activeDocumentId={activeDocumentId}
                setActiveDocumentId={setActiveDocumentId}
              />
            ) : (
              displayActiveNode(selectedFolder?.id || selectedRootNode)
            )}
          </div>
        </div>

        {/* === DOCUMENT CREATION MODAL === */}
        {/* Modal for entering document name after selecting type */}
        {/* Note: Modal title is fixed, but document type is determined by selectedRootNode */}
        <CreateDocumentModal
          onContinue={onCreateDocument}
          onOpenChange={(open) => setOpenModal(open)}
          open={openModal}
        />
      </div>
    </SidebarProvider>
  );
}
