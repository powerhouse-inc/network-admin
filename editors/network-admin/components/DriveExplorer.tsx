import { Button, CreateDocumentModal } from "@powerhousedao/design-system";
import {
  Sidebar,
  SidebarProvider,
  type SidebarNode,
} from "@powerhousedao/document-engineering";
import {
  addDocument,
  setSelectedNode,
  useAllFolderNodes,
  useFileChildNodes,
  useSelectedDrive,
  useSelectedFolder,
  dispatchActions,
  useSelectedDocument,
  useSelectedDriveDocuments,
  showDeleteNodeModal,
  useSelectedDriveId,
  useNodeActions,
} from "@powerhousedao/reactor-browser";
import { type DocumentModelModule } from "document-model";
import { type Node } from "document-drive";
import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import { EditorContainer } from "./EditorContainer.js";
import { editWorkstream } from "../../../document-models/workstream/gen/creators.js";
import { type WorkstreamStatus } from "../../../document-models/workstream/gen/types.js";

const WorkstreamStatusEnums = [
  "RFP_DRAFT",
  "PREWORK_RFC",
  "RFP_CANCELLED",
  "OPEN_FOR_PROPOSALS",
  "PROPOSAL_SUBMITTED",
  "NOT_AWARDED",
  "AWARDED",
  "IN_PROGRESS",
  "FINISHED",
];

/**1
 * Main drive explorer component with sidebar navigation and content area.
 * Layout: Left sidebar (folder tree) + Right content area (files/folders + document editor)
 */
export function DriveExplorer(props: any) {
  // === DOCUMENT EDITOR STATE ===
  // Customize document opening/closing behavior here
  const [activeDocumentId, setActiveDocumentId] = useState<
    string | undefined
  >();
  const [activeSidebarNodeId, setActiveSidebarNodeId] =
    useState<string>("workstreams");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRootNode, setSelectedRootNode] =
    useState<string>("workstreams");
  const [modalDocumentType, setModalDocumentType] = useState<string>(
    "powerhouse/workstream"
  );
  const selectedDocumentModel = useRef<DocumentModelModule | null>(null);

  // === STATE MANAGEMENT HOOKS ===
  // Core state hooks for drive navigation
  const [selectedDrive] = useSelectedDrive(); // Currently selected drive
  const selectedFolder = useSelectedFolder(); // Currently selected folder
  const allDocuments = useSelectedDriveDocuments();
  const selectedDriveId = useSelectedDriveId();

  const { onRenameNode } = useNodeActions();

  // Listen to global selected document state (for external editors like Scope of Work)
  const [globalSelectedDocument] = useSelectedDocument();

  // All folders for the sidebar tree view
  const allFolders = useAllFolderNodes();

  const fileChildren = useFileChildNodes();

  const networkAdminDocuments = allDocuments?.filter(
    (doc) =>
      doc.header.documentType === "powerhouse/network-profile" ||
      doc.header.documentType === "powerhouse/workstream" ||
      doc.header.documentType === "powerhouse/scopeofwork" ||
      doc.header.documentType === "powerhouse/rfp" ||
      doc.header.documentType === "payment-terms"
  );

  // Sync global selected document with local activeDocumentId
  // This makes setSelectedNode() trigger the EditorContainer to open
  useEffect(() => {
    if (globalSelectedDocument?.header?.id) {
      setActiveDocumentId(globalSelectedDocument.header.id);
      // Also update the sidebar node ID to match
      setActiveSidebarNodeId(`editor-${globalSelectedDocument.header.id}`);
    }
  }, [globalSelectedDocument]);

  // Check if current active document is a Scope of Work (should show in full view)
  const activeDoc = allDocuments?.find(
    (doc) => doc.header.id === activeDocumentId
  );
  const isScopeOfWorkFullView =
    activeDoc?.header.documentType === "powerhouse/scopeofwork";

  // check if workstream doc is created, set isWorkstreamCreated to true
  const isWorkstreamCreated =
    networkAdminDocuments?.some(
      (doc) => doc.header.documentType === "powerhouse/workstream"
    ) || false;
  //check if network profile doc is created, set isNetworkProfileCreated to true
  const isNetworkProfileCreated =
    networkAdminDocuments?.some(
      (doc) => doc.header.documentType === "powerhouse/network-profile"
    ) || false;

  // Convert network admin documents to SidebarNode format
  const sidebarNodes = useMemo((): SidebarNode[] => {
    // Group documents by type
    const workstreamDocs =
      networkAdminDocuments?.filter(
        (doc) => doc.header.documentType === "powerhouse/workstream"
      ) || [];
    const scopeOfWorkDocs =
      networkAdminDocuments?.filter(
        (doc) => doc.header.documentType === "powerhouse/scopeofwork"
      ) || [];
    const rfpDocs =
      networkAdminDocuments?.filter(
        (doc) => doc.header.documentType === "powerhouse/rfp"
      ) || [];
    const paymentTermsDocs =
      networkAdminDocuments?.filter(
        (doc) => doc.header.documentType === "payment-terms"
      ) || [];
    const networkProfileDocs =
      networkAdminDocuments?.filter(
        (doc) => doc.header.documentType === "powerhouse/network-profile"
      ) || [];

    const workstreamsNode: SidebarNode = {
      id: "workstreams",
      title: "Workstreams",
      children: [
        ...WorkstreamStatusEnums.map((status) => {
          const statusTitle = status
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return {
            id: `workstream-status-${status}`,
            title:
              statusTitle +
              (workstreamDocs.filter(
                (doc) => (doc.state as any)?.global?.status === status
              ).length > 0
                ? ` (${workstreamDocs.filter((doc) => (doc.state as any)?.global?.status === status).length})`
                : ""),
            children: [
              ...workstreamDocs
                .filter((doc) => (doc.state as any)?.global?.status === status)
                .map((doc) => {
                  let sow = null;
                  let paymentTerms = null;
                  let rfp = null;
                  if ((doc.state as any)?.global?.initialProposal) {
                    sow = (doc.state as any)?.global?.initialProposal.sow;
                    paymentTerms = (doc.state as any)?.global?.initialProposal
                      .paymentTerms;
                  }

                  if ((doc.state as any)?.global?.rfp) {
                    rfp = (doc.state as any)?.global?.rfp?.id;
                  }

                  const sowDoc = allDocuments?.find(
                    (doc) => doc.header.id === sow
                  );
                  const rfpDoc = allDocuments?.find(
                    (doc) => doc.header.id === rfp
                  );
                  const pmtDoc = allDocuments?.find(
                    (doc) => doc.header.id === paymentTerms
                  );

                  // get alternative proposals
                  let alternativeProposals = null;
                  if ((doc.state as any)?.global?.alternativeProposals) {
                    alternativeProposals = (doc.state as any)?.global
                      ?.alternativeProposals;
                  }

                  // Only include documents that actually exist
                  const wstrChildDocs = [rfpDoc].filter(
                    (doc) => doc !== undefined && doc !== null
                  );

                  const returnableChildren: any = {
                    id: `editor-${doc.header.id}`,
                    title: `${(doc.state as any)?.global?.code ? (doc.state as any)?.global?.code + " - " : ""}${(doc.state as any)?.global?.title || doc.header.name}`,
                    children: wstrChildDocs.map((childDoc) => {
                      let dynamicTitle =
                        childDoc?.header.documentType === "powerhouse/rfp"
                          ? `Request For Proposal`
                          : `${(childDoc.state as any)?.global?.code ? (childDoc.state as any)?.global?.code + " - " : ""}${(childDoc.state as any)?.global?.title || childDoc.header.name}`;

                      return {
                        id: `editor-${childDoc.header.id}`,
                        title: dynamicTitle,
                      };
                    }),
                  };

                  wstrChildDocs.push(sowDoc as any);
                  wstrChildDocs.push(pmtDoc as any);

                  // if sowDoc or pmtDoc is included in the wstrChildDocs, then add a child with the title "Initial Proposal"
                  if (
                    wstrChildDocs.includes(sowDoc as any) ||
                    wstrChildDocs.includes(pmtDoc as any)
                  ) {
                    returnableChildren.children.push({
                      id: "initial-proposal",
                      title: "Initial Proposal",
                      children: wstrChildDocs
                        .filter(
                          (childDoc) =>
                            childDoc &&
                            childDoc.header &&
                            (childDoc.header.documentType ===
                              "powerhouse/scopeofwork" ||
                              childDoc.header.documentType === "payment-terms")
                        )
                        .map((childDoc) => {
                          let dynamicTitle =
                            childDoc.header.documentType ===
                            "powerhouse/scopeofwork"
                              ? "Scope of Work"
                              : childDoc.header.documentType === "payment-terms"
                                ? "Payment Terms"
                                : null;
                          return {
                            id: `editor-${childDoc.header.id}`,
                            title: dynamicTitle,
                          };
                        }),
                    });
                  }

                  if (alternativeProposals.length > 0) {
                    returnableChildren.children.push({
                      id: "alternative-proposals",
                      title: `Alternative Proposals (${alternativeProposals.length})`,
                      children: alternativeProposals.map((proposal: any) => {
                        // Find documents for this specific proposal
                        const proposalSowDoc = allDocuments?.find(
                          (doc) => doc.header.id === proposal.sow
                        );
                        const proposalPaymentTermsDoc = allDocuments?.find(
                          (doc) => doc.header.id === proposal.paymentTerms
                        );

                        // Filter to only include documents that exist
                        const proposalChildDocs = [proposalSowDoc, proposalPaymentTermsDoc].filter(
                          (doc) => doc !== undefined && doc !== null
                        );

                        return {
                          id: `alternative-proposal-${proposal.id}`,
                          title: `${proposal.author.name}`,
                          children: proposalChildDocs.map((childDoc) => {
                            let dynamicTitle =
                              childDoc.header.documentType === "powerhouse/scopeofwork"
                                ? "Scope of Work"
                                : childDoc.header.documentType === "payment-terms"
                                  ? "Payment Terms"
                                  : null;
                            return {
                              id: `editor-${childDoc.header.id}`,
                              title: dynamicTitle,
                            };
                          }),
                        };
                      }),
                    });
                  }

                  return returnableChildren;
                }),
            ],
          };
        }),
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

      // Always update the active sidebar node ID
      setActiveSidebarNodeId(newNode.id);

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
        setActiveDocumentId(fileId);
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
          <div className="w-full h-full p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-6 flex flex-col items-center justify-center mb-10">
                <h1 className="text-2xl font-bold">
                  Welcome to the Network Admin
                </h1>
                <p className="text-center">
                  Create a new workstream to get started, or select an existing
                  workstream on the left
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
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
                            (file) => file.id === document.header.id
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
                                        currentName
                                      );
                                      if (
                                        newName &&
                                        newName.trim() &&
                                        newName !== currentName
                                      ) {
                                        try {
                                          await onRenameNode(
                                            newName.trim(),
                                            fileNode as Node
                                          );
                                        } catch (error) {
                                          console.error(
                                            "Failed to rename document",
                                            error
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
  // === RENDER ===
  return (
    <SidebarProvider nodes={sidebarNodes}>
      {/* === FULL VIEW MODE (for Scope of Work) === */}
      {isScopeOfWorkFullView && activeDocumentId ? (
        <div className="h-full w-full">
          <EditorContainer
            handleClose={() => {
              setActiveDocumentId(undefined);
              setSelectedNode(undefined); // Clear global selection
            }}
            hideToolbar={false}
            activeDocumentId={activeDocumentId}
            setActiveDocumentId={setActiveDocumentId}
            setActiveSidebarNodeId={setActiveSidebarNodeId}
          />
        </div>
      ) : (
        /* === NORMAL VIEW WITH SIDEBAR === */
        <div className="flex h-full">
          <Sidebar
            nodes={sidebarNodes}
            activeNodeId={activeSidebarNodeId}
            onActiveNodeChange={(node) => handleActiveNodeChange(node.id)}
            sidebarTitle="Network Admin"
            showSearchBar={true}
            allowPinning={true}
            resizable={true}
            initialWidth={300}
            maxWidth={500}
            enableMacros={4}
            handleOnTitleClick={() => {
              setActiveDocumentId(undefined);
              setActiveSidebarNodeId("workstreams");
              setSelectedRootNode("workstreams");
            }}
          />

          {/* === MAIN CONTENT AREA === */}
          <div className="flex-1 overflow-y-auto">
            <div className="h-full">
              {activeDocumentId ? (
                <EditorContainer
                  handleClose={() => setActiveDocumentId(undefined)}
                  hideToolbar={false}
                  activeDocumentId={activeDocumentId}
                  setActiveDocumentId={setActiveDocumentId}
                  setActiveSidebarNodeId={setActiveSidebarNodeId}
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
      )}
    </SidebarProvider>
  );
}
