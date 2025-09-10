import {
  Button,
  CreateDocumentModal,
  useDrop,
} from "@powerhousedao/design-system";
import { Icon, type SidebarNode } from "@powerhousedao/document-engineering";
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
import { IsolatedSidebarProvider } from "./IsolatedSidebarProvider.js";
import { IsolatedSidebar } from "./IsolatedSidebar.js";
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
  const isWorkstreamCreated = fileChildren.some(
    (file) => file.documentType === "powerhouse/workstream"
  );
  //check if network profile doc is created, set isNetworkProfileCreated to true
  const isNetworkProfileCreated = fileChildren.some(
    (file) => file.documentType === "powerhouse/network-profile"
  );

  // Convert folders and files to SidebarNode format
  const sidebarNodes = useMemo((): SidebarNode[] => {
    const workstreamsNode: SidebarNode = {
      id: "workstreams",
      title: "Workstreams",
      children: [
        // Add folders
        ...allFolders
          .filter((folder) => {
            // Only root folders that contain non-network-profile documents
            if (folder.parentFolder) return false;

            // Check if this folder or any of its subfolders contain non-network-profile documents
            const hasNonNetworkProfileFiles = filesWithDocuments.some(
              (file) =>
                file.documentType !== "powerhouse/network-profile" &&
                (file.parentFolder === folder.id ||
                  allFolders.some(
                    (subFolder) =>
                      subFolder.parentFolder === folder.id &&
                      file.parentFolder === subFolder.id
                  ))
            );
            return hasNonNetworkProfileFiles;
          })
          .map((folder) => ({
            id: folder.id,
            title: folder.name,
            children: [
              // Add child folders
              ...allFolders
                .filter(
                  (childFolder) =>
                    childFolder.parentFolder === folder.id &&
                    filesWithDocuments.some(
                      (file) =>
                        file.documentType !== "powerhouse/network-profile" &&
                        file.parentFolder === childFolder.id
                    )
                )
                .map((childFolder) => ({
                  id: childFolder.id,
                  title: childFolder.name,
                  children: [
                    // Add files in this folder (exclude network-profile documents)
                    ...filesWithDocuments
                      .filter(
                        (file) =>
                          file.parentFolder === childFolder.id &&
                          file.documentType !== "powerhouse/network-profile"
                      )
                      .map((file: any) => ({
                        id: `editor-${file.id}`,
                        title: `📄 ${file.state?.code || ""} - ${file.state?.title || file.name}`,
                      })),
                  ],
                })),
              // Add files directly in this folder (exclude network-profile documents)
              ...filesWithDocuments
                .filter(
                  (file) =>
                    file.parentFolder === folder.id &&
                    file.documentType !== "powerhouse/network-profile"
                )
                .map((file: any) => ({
                  id: `editor-${file.id}`,
                  title: `📄 ${file.state?.code || ""} - ${file.state?.title || file.name}`,
                })),
            ],
          })),
        // Add root-level files (exclude network-profile documents)
        ...filesWithDocuments
          .filter(
            (file) =>
              !file.parentFolder &&
              file.documentType !== "powerhouse/network-profile"
          )
          .map((file: any) => ({
            id: `editor-${file.id}`,
            title: `📄 ${file.state?.code || ""} - ${file.state?.title || file.name}`,
          })),
      ],
    };

    const networkInfoNode: SidebarNode = {
      id: "network-information",
      title: "Network Information",
      children: [
        // Add folders that contain network-profile documents
        ...allFolders
          .filter((folder) => {
            // Check if this folder or any of its subfolders contain network-profile documents
            const hasNetworkProfileFiles = filesWithDocuments.some(
              (file) =>
                file.documentType === "powerhouse/network-profile" &&
                (file.parentFolder === folder.id ||
                  allFolders.some(
                    (subFolder) =>
                      subFolder.parentFolder === folder.id &&
                      file.parentFolder === subFolder.id
                  ))
            );
            return hasNetworkProfileFiles;
          })
          .map((folder) => ({
            id: folder.id,
            title: folder.name,
            children: [
              // Add child folders that contain network-profile documents
              ...allFolders
                .filter(
                  (childFolder) =>
                    childFolder.parentFolder === folder.id &&
                    filesWithDocuments.some(
                      (file) =>
                        file.documentType === "powerhouse/network-profile" &&
                        file.parentFolder === childFolder.id
                    )
                )
                .map((childFolder) => ({
                  id: childFolder.id,
                  title: childFolder.name,
                  children: [
                    // Add network-profile files in this folder
                    ...filesWithDocuments
                      .filter(
                        (file) =>
                          file.documentType === "powerhouse/network-profile" &&
                          file.parentFolder === childFolder.id
                      )
                      .map((file: any) => ({
                        id: `editor-${file.id}`,
                        title: `📄 ${file.name}`,
                      })),
                  ],
                })),
              // Add network-profile files directly in this folder
              ...filesWithDocuments
                .filter(
                  (file) =>
                    file.documentType === "powerhouse/network-profile" &&
                    file.parentFolder === folder.id
                )
                .map((file: any) => ({
                  id: `editor-${file.id}`,
                  title: `📄 ${file.name}`,
                })),
            ],
          })),
        // Add root-level network-profile files
        ...filesWithDocuments
          .filter(
            (file) =>
              !file.parentFolder &&
              file.documentType === "powerhouse/network-profile"
          )
          .map((file: any) => ({
            id: `editor-${file.id}`,
            title: `📄 ${file.name}`,
          })),
      ],
    };

    return [workstreamsNode, networkInfoNode];
  }, [allFolders, filesWithDocuments]);

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
        setActiveDocumentId(fileId);
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
      nodeType = "network-information";
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
          <div className="mt-20 p-4 flex flex-col items-center justify-center">
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
              {/* === HEADER SECTION === */}
              {/* <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Root Contents</h2>
                  {isAllowedToCreateDocuments && (
                    <button
                      onClick={() => handleCreateFolder()}
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      + New Folder
                    </button>
                  )}
                </div> */}

              {/* Navigation breadcrumbs */}
              {/* {breadcrumbs.length > 1 && (
                  <div className="border-b border-gray-200 pb-3">
                    <Breadcrumbs
                      breadcrumbs={breadcrumbs}
                      createEnabled={isAllowedToCreateDocuments}
                      onCreate={handleCreateFolder}
                      onBreadcrumbSelected={onBreadcrumbSelected}
                    />
                  </div>
                )} */}
            </div>

            {/* === FOLDERS AND FILES GRID LAYOUT === */}
            {(folderChildren.length > 0 || fileChildren.length > 0) && (
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-6">
                  {/* === FOLDERS COLUMN === */}
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">
                      📁 Folders
                    </h3>
                    <div className="space-y-2">
                      {folderChildren.map((folderNode) =>
                        folderNode && folderNode.id ? (
                          <div
                            key={folderNode.id}
                            className="p-2 border rounded"
                          >
                            <div className="font-medium">
                              📁 {folderNode.name}
                            </div>
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
                                  const newName = prompt(
                                    "Enter new name:",
                                    folderNode.name || ""
                                  );
                                  if (
                                    newName &&
                                    newName.trim() &&
                                    newName !== folderNode.name
                                  ) {
                                    try {
                                      onRenameNode(newName.trim(), folderNode);
                                    } catch (error) {
                                      console.error("Failed to rename:", error);
                                      alert(
                                        "Failed to rename folder. Please try again."
                                      );
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
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* === FILES COLUMN === */}
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">
                      📄 Documents
                    </h3>
                    <div className="space-y-2">
                      {fileChildren.map((fileNode) => (
                        <div key={fileNode.id} className="p-2 border rounded">
                          <div className="font-medium">{fileNode.name}</div>
                          <div className="text-sm text-gray-500">
                            {fileNode.documentType}
                          </div>
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
                                if (!fileNode || !fileNode.id) return;
                                const newName = prompt(
                                  "Enter new name:",
                                  fileNode.name || ""
                                );
                                if (
                                  newName &&
                                  newName.trim() &&
                                  newName !== fileNode.name
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
                </div>
              </div>
            )}
          </div>
        );

      case "folder":
        const folder = allFolders.find((f) => f.id === actualId);
        if (!folder) return null;

        return (
          <div className="p-4">
            <div className="space-y-6">
              {/* === HEADER SECTION === */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Contents of "{folder.name}"
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedNode(selectedDrive?.header.id);
                    }}
                    className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                  >
                    Back
                  </button>
                  {isAllowedToCreateDocuments && (
                    <button
                      onClick={() => handleCreateFolder()}
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      + New Folder
                    </button>
                  )}
                </div>
              </div>

              {/* === FOLDERS SECTION === */}
              {folderChildren.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-500">
                    📁 Folders
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {folderChildren.map((folderNode) =>
                      folderNode && folderNode.id ? (
                        <div key={folderNode.id} className="p-2 border rounded">
                          <div className="font-medium">
                            📁 {folderNode.name}
                          </div>
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
                                const newName = prompt(
                                  "Enter new name:",
                                  folderNode.name || ""
                                );
                                if (
                                  newName &&
                                  newName.trim() &&
                                  newName !== folderNode.name
                                ) {
                                  try {
                                    onRenameNode(newName.trim(), folderNode);
                                  } catch (error) {
                                    console.error("Failed to rename:", error);
                                    alert(
                                      "Failed to rename folder. Please try again."
                                    );
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
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* === FILES/DOCUMENTS SECTION === */}
              {fileChildren.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-500">
                    📄 Documents
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {fileChildren.map((fileNode) => (
                      <div key={fileNode.id} className="p-2 border rounded">
                        <div className="font-medium">{fileNode.name}</div>
                        <div className="text-sm text-gray-500">
                          {fileNode.documentType}
                        </div>
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
                              if (!fileNode || !fileNode.id) return;
                              const newName = prompt(
                                "Enter new name:",
                                fileNode.name || ""
                              );
                              if (
                                newName &&
                                newName.trim() &&
                                newName !== fileNode.name
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
              ) : null}

              {/* === EMPTY STATE === */}
              {folderChildren.length === 0 && fileChildren.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <p className="text-lg">🗂️ This folder is empty</p>
                  <p className="mt-2 text-sm">
                    Create your first document or folder below
                  </p>
                </div>
              )}

              {/* === DOCUMENT CREATION SECTION === */}
              {/* <CreateDocument /> */}
            </div>
          </div>
        );

      case "network-information":
        return (
          <div className="mt-20 p-4 flex flex-col items-center justify-center">
            <div className="space-y-6 flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">Network Information</h1>
              <p>
                Create a new network profile to get started, or select an
                existing network profile from the left sidebar
              </p>
              <div className="flex gap-3">
                <Button
                  color="dark"
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

            {/* === NETWORK PROFILE FOLDERS AND FILES GRID LAYOUT === */}
            {(folderChildren.length > 0 || fileChildren.length > 0) && (
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-6">
                  {/* === FOLDERS COLUMN === */}
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">
                      📁 Network Profile Folders
                    </h3>
                    <div className="space-y-2">
                      {folderChildren
                        .filter((folder) => {
                          // Only show folders that contain network-profile documents
                          return filesWithDocuments.some(
                            (file) =>
                              file.documentType ===
                                "powerhouse/network-profile" &&
                              (file.parentFolder === folder.id ||
                                allFolders.some(
                                  (subFolder) =>
                                    subFolder.parentFolder === folder.id &&
                                    file.parentFolder === subFolder.id
                                ))
                          );
                        })
                        .map((folderNode) =>
                          folderNode && folderNode.id ? (
                            <div
                              key={folderNode.id}
                              className="p-2 border rounded"
                            >
                              <div className="font-medium">
                                📁 {folderNode.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Network Profile Folder
                              </div>
                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={() => setSelectedNode(folderNode)}
                                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                >
                                  Open
                                </button>
                                <button
                                  onClick={() => {
                                    const newName = prompt(
                                      "Enter new name:",
                                      folderNode.name || ""
                                    );
                                    if (
                                      newName &&
                                      newName.trim() &&
                                      newName !== folderNode.name
                                    ) {
                                      try {
                                        onRenameNode(
                                          newName.trim(),
                                          folderNode
                                        );
                                      } catch (error) {
                                        console.error(
                                          "Failed to rename:",
                                          error
                                        );
                                        alert(
                                          "Failed to rename folder. Please try again."
                                        );
                                      }
                                    }
                                  }}
                                  className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-blue-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    showDeleteNodeModal(folderNode)
                                  }
                                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : null
                        )}
                    </div>
                  </div>

                  {/* === NETWORK PROFILE FILES COLUMN === */}
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">
                      🌐 Network Profile Documents
                    </h3>
                    <div className="space-y-2">
                      {filesWithDocuments
                        .filter(
                          (file) =>
                            file.documentType === "powerhouse/network-profile"
                        )
                        .map((fileNode) => (
                          <div key={fileNode.id} className="p-2 border rounded">
                            <div className="font-medium">
                              🌐 {fileNode.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Network Profile
                            </div>
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
                                  if (!fileNode || !fileNode.id) return;
                                  const newName = prompt(
                                    "Enter new name:",
                                    fileNode.name || ""
                                  );
                                  if (
                                    newName &&
                                    newName.trim() &&
                                    newName !== fileNode.name
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
                                className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-blue-600"
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
                </div>
              </div>
            )}

            {/* === EMPTY STATE === */}
            {folderChildren.length === 0 && fileChildren.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">🌐 No network profiles yet</p>
                <p className="mt-2 text-sm">
                  Create your first network profile above
                </p>
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
        let folder = undefined;
        if (documentType === "powerhouse/workstream") {
          folder = await onAddFolder(fileName, undefined);
          // Track the created folder for drag and drop targeting
          console.log("Created workstream folder:", folder);
          setLastCreatedFolder(folder);
        }

        const node = await addDocument(
          selectedDrive?.header.id || "",
          fileName,
          documentType,
          folder?.id,
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

  // === DOCUMENT EDITOR DATA ===
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
    <IsolatedSidebarProvider nodes={sidebarNodes}>
      <div className="flex h-full">
        {/* === LEFT SIDEBAR: Folder Navigation === */}
        <IsolatedSidebar
          nodes={sidebarNodes}
          activeNodeId={selectedFolder?.id || activeDocumentId}
          onActiveNodeChange={handleActiveNodeChange}
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
    </IsolatedSidebarProvider>
  );
}
