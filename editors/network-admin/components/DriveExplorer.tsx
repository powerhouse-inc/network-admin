import type { EditorProps } from "document-model";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  setSelectedNode,
  useSelectedDriveSafe,
  useSelectedFolder,
  useUserPermissions,
  useDocumentsInSelectedDrive,
  useFileNodesInSelectedDrive,
  useNodeActions,
  useSelectedDocumentSafe,
  showDeleteNodeModal,
  addDocument,
  dispatchActions,
} from "@powerhousedao/reactor-browser";
import { Button } from "@powerhousedao/document-engineering";
import { CreateDocumentModal } from "@powerhousedao/design-system/connect";
import { type DocumentModelModule, type PHDocument } from "document-model";
import { WorkstreamIcon } from "./icons/WorkstreamIcon.js";
import type { NetworkProfileDocument } from "../../../document-models/network-profile/index.js";
import {
  editClientInfo,
  editWorkstream,
} from "../../../document-models/workstream/gen/creators.js";
import { FolderTree } from "./FolderTree.js";

/**
 * Main drive explorer component with sidebar navigation and content area.
 * Layout: Left sidebar (folder tree) + Right content area (files/folders + document editor)
 */
export function DriveExplorer({ children }: EditorProps) {
  const { isAllowedToCreateDocuments } = useUserPermissions();

  // === DOCUMENT EDITOR STATE ===
  const [activeSidebarNodeId, setActiveSidebarNodeId] =
    useState<string>("workstreams");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRootNode, setSelectedRootNode] =
    useState<string>("workstreams");
  const [modalDocumentType, setModalDocumentType] = useState<string>(
    "powerhouse/workstream",
  );
  const selectedDocumentModel = useRef<DocumentModelModule | null>(null);

  // === STATE MANAGEMENT HOOKS ===
  // Core state hooks for drive navigation
  const [selectedDrive] = useSelectedDriveSafe(); // Currently selected drive
  const selectedFolder = useSelectedFolder(); // Currently selected folder
  const allDocuments = useDocumentsInSelectedDrive();
  const fileChildren = useFileNodesInSelectedDrive();
  const { onRenameNode } = useNodeActions();

  // Listen to global selected document state (for external editors like Scope of Work)
  const [globalSelectedDocument] = useSelectedDocumentSafe();

  const networkAdminDocuments = allDocuments?.filter(
    (doc: PHDocument) =>
      doc.header.documentType === "powerhouse/network-profile" ||
      doc.header.documentType === "powerhouse/workstream" ||
      doc.header.documentType === "powerhouse/scopeofwork" ||
      doc.header.documentType === "powerhouse/rfp" ||
      doc.header.documentType === "payment-terms" ||
      doc.header.documentType === "powerhouse/builders",
  );

  //check if network profile doc is created, set isNetworkProfileCreated to true
  const isNetworkProfileCreated =
    networkAdminDocuments?.some(
      (doc: PHDocument) =>
        doc.header.documentType === "powerhouse/network-profile",
    ) || false;

  // Sync global selected document with local activeDocumentId
  useEffect(() => {
    if (globalSelectedDocument?.header?.id) {
      // Also update the sidebar node ID to match
      setActiveSidebarNodeId(`editor-${globalSelectedDocument.header.id}`);
    }
  }, [globalSelectedDocument]);

  // Check if current active document is a Scope of Work (should show in full view)
  const isScopeOfWorkFullView =
    globalSelectedDocument?.header.documentType === "powerhouse/scopeofwork";

  // === EVENT HANDLERS ===

  // Display function that switches views based on active node ID
  const displayActiveNode = (activeNodeId: string) => {
    // Determine the type of node and extract the actual ID
    let nodeType = "unknown";

    if (activeNodeId === "workstreams") {
      nodeType = "workstreams";
    } else if (activeNodeId === "network-information") {
      nodeType = "workstreams";
    } else if (activeNodeId.startsWith("editor-")) {
      nodeType = "file";
    }

    const networkProfileDoc = networkAdminDocuments?.find(
      (doc) => doc.header.documentType === "powerhouse/network-profile",
    ) as NetworkProfileDocument | undefined;
    switch (nodeType) {
      case "workstreams":
        return (
          <div className="w-full h-full p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-6 flex flex-col items-center justify-center mb-10">
                <h1 className="text-2xl font-bold">
                  Welcome to the Network Admin
                </h1>
                {/* Card to display the network profile */}
                {isNetworkProfileCreated &&
                  networkProfileDoc?.state.global.logo && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 max-w-lg mx-auto text-sm">
                      <div className="flex items-start justify-between gap-4">
                        {networkProfileDoc?.state.global.logo ? (
                          <img
                            src={networkProfileDoc?.state.global.logo}
                            alt="Network Profile Logo"
                            className="mb-4 max-w-64 max-h-12 w-auto h-auto object-contain flex-shrink-0"
                          />
                        ) : (
                          <div></div>
                        )}
                        <div className="flex flex-wrap gap-2 justify-end flex-shrink-0">
                          {networkProfileDoc?.state.global.category.map(
                            (category) => (
                              <span
                                key={category}
                                className={`inline-flex items-center justify-center rounded-md w-fit whitespace-nowrap shrink-0 border-2 px-2 py-0 text-sm font-extrabold ${
                                  category.toLowerCase() === "oss"
                                    ? "bg-purple-600/30 text-purple-600 border-purple-600/70"
                                    : category.toLowerCase() === "defi"
                                      ? "bg-blue-600/30 text-blue-600 border-blue-600/70"
                                      : "bg-gray-500/30 text-gray-500 border-gray-500/70"
                                }`}
                              >
                                {category}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                      <p className="mt-4">
                        {networkProfileDoc?.state.global.description}
                      </p>
                    </div>
                  )}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    color="dark" // Customize button appearance
                    size="sm"
                    className="cursor-pointer hover:bg-gray-600 hover:text-white"
                    title={"Create Workstream Document"}
                    aria-description={"Create Workstream Document"}
                    onClick={() => {
                      setModalDocumentType("powerhouse/workstream");
                      setOpenModal(true);
                    }}
                    disabled={!isNetworkProfileCreated}
                  >
                    <span className="flex items-center gap-2">
                      <WorkstreamIcon className="w-7 h-7 text-white" />
                      Create Workstream Document
                    </span>
                  </Button>

                  <Button
                    color="dark" // Customize button appearance
                    size="sm"
                    className="cursor-pointer hover:bg-gray-600 hover:text-white"
                    title={"Create Network Profile Document"}
                    aria-description={"Create Network Profile Document"}
                    onClick={() => {
                      setModalDocumentType("powerhouse/network-profile");
                      setOpenModal(true);
                    }}
                    disabled={isNetworkProfileCreated}
                  >
                    <span className="flex items-center gap-2">
                      Create Network Profile Document
                    </span>
                  </Button>
                </div>
              </div>

              {/* === DOCUMENTS TABLE === */}
              {networkAdminDocuments && networkAdminDocuments.length > 0 && (
                <div className="w-full">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">
                    📄 Documents
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Type
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {networkAdminDocuments.map((document) => {
                          // Find the corresponding file node for actions
                          const fileNode = fileChildren?.find(
                            (file) => file.id === document.header.id,
                          );

                          return (
                            <tr
                              key={document.header.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-2 py-2">
                                <div
                                  className="text-sm font-medium text-gray-900 truncate max-w-xs"
                                  title={fileNode?.name || document.header.name}
                                >
                                  {fileNode?.name || document.header.name}
                                </div>
                              </td>
                              <td className="px-2 py-2">
                                <div
                                  className="text-sm text-gray-500 truncate max-w-xs"
                                  title={document.header.documentType}
                                >
                                  {document.header.documentType}
                                </div>
                              </td>

                              <td className="px-2 py-2">
                                <div className="flex gap-2 flex-wrap">
                                  <button
                                    onClick={() => {
                                      if (fileNode) {
                                        setSelectedNode(fileNode);
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                                  >
                                    Open
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!fileNode || !fileNode.id) return;
                                      const currentName =
                                        fileNode.name || document.header.name;
                                      const newName = prompt(
                                        "Enter new name:",
                                        currentName,
                                      );
                                      if (
                                        newName &&
                                        newName.trim() &&
                                        newName !== currentName
                                      ) {
                                        try {
                                          await onRenameNode(
                                            newName.trim(),
                                            fileNode,
                                          );
                                        } catch (error) {
                                          console.error(
                                            "Failed to rename document",
                                            error,
                                          );
                                        }
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-yellow-500 text-white rounded text-xs font-medium hover:bg-yellow-600 transition-colors whitespace-nowrap"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (fileNode && fileNode.id) {
                                        showDeleteNodeModal(fileNode.id);
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors whitespace-nowrap"
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
          </div>
        );
      default:
        return <div>Unknown node type: {nodeType}</div>;
    }
  };

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
          editorType,
        );

        if (!node?.id) {
          console.error("Error creating document", fileName);
          return;
        }

        if (documentType === "powerhouse/workstream") {
          const networkProfileDoc = networkAdminDocuments?.find(
            (doc) => doc.header.documentType === "powerhouse/network-profile",
          ) as NetworkProfileDocument | undefined;
          const actionsToDispatch = [
            editWorkstream({ title: fileName }),
            editClientInfo({
              clientId: networkProfileDoc?.header.id || "",
              name: networkProfileDoc?.state.global.name || "",
              icon: networkProfileDoc?.state.global.icon || "",
            }),
          ];
          await dispatchActions(actionsToDispatch, node.id);
        }

        selectedDocumentModel.current = null;

        console.log("Created document node", node);

        if (node) {
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
    [selectedDrive?.header.id, modalDocumentType, networkAdminDocuments],
  );

  // Create builders document
  const createBuildersDocument = useCallback(async () => {
    try {
      const isCreated = allDocuments?.some(
        (doc) => doc.header.documentType === "powerhouse/builders",
      );
      if (isCreated) {
        return;
      } else {
        console.log("Creating builders document");
        const node = await addDocument(
          selectedDrive?.header.id || "",
          "Builders",
          "powerhouse/builders",
          undefined, // creating in root folder
          undefined,
          undefined,
          "builders-editor",
        );

        if (!node?.id) {
          console.error("Error creating builders document");
          return;
        }

        return node;
      }
    } catch (error) {
      console.error("Failed to create builders document:", error);
      return null;
    }
  }, [selectedDrive?.header.id, allDocuments]);

  // === RENDER ===
  return (
    <div className="h-full">
      {/* === FULL VIEW MODE (for Scope of Work) === */}
      {isScopeOfWorkFullView && children ? (
        <div className="h-full w-full">{children}</div>
      ) : (
        /* === NORMAL VIEW WITH SIDEBAR === */
        <div className="flex h-full">
          <FolderTree
            activeSidebarNodeId={activeSidebarNodeId}
            setActiveSidebarNodeId={setActiveSidebarNodeId}
            setSelectedRootNode={setSelectedRootNode}
            createBuildersDocument={createBuildersDocument}
          />

          {/* === MAIN CONTENT AREA === */}
          <div className="flex-1 overflow-y-auto">
            <div className="h-full">
              {children ||
                displayActiveNode(selectedFolder?.id || selectedRootNode)}
            </div>
          </div>

          {/* === DOCUMENT CREATION MODAL === */}
          <CreateDocumentModal
            onContinue={onCreateDocument}
            onOpenChange={(open) => setOpenModal(open)}
            open={openModal}
          />
        </div>
      )}
    </div>
  );
}
