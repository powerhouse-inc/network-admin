import type {
  Action,
  EditorProps,
  PHDocument,
  PHDocumentState,
} from "document-model";
import { Button, toast, ToastContainer } from "@powerhousedao/design-system";
import {
  TextInput,
  Select,
  OIDInput,
  ObjectSetTable,
  ColumnDef,
  ColumnAlignment,
  buildEnumCellEditor,
} from "@powerhousedao/document-engineering";
import {
  type WorkstreamDocument,
  actions,
  type WorkstreamStatusInput,
  ProposalStatusInput,
} from "../../document-models/workstream/index.js";
import {
  type RequestForProposalsState,
  actions as rfpActions,
} from "../../document-models/request-for-proposals/index.js";
import { ScopeOfWork } from "@powerhousedao/project-management/document-models";
import { ScopeOfWorkState } from "@powerhousedao/project-management/document-models/scope-of-work";
import { generateId } from "document-model";
import {
  useDocumentById,
  useSelectedDrive,
  addDocument,
  useSelectedDriveDocuments,
  dispatchActions,
} from "@powerhousedao/reactor-browser";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelectedWorkstreamDocument } from "../hooks/useWorkstreamDocument.js";
import type { WorkstreamState } from "../../document-models/workstream/gen/schema/types.js";
import type { Proposal } from "../../document-models/workstream/gen/schema/types.js";
export type IProps = EditorProps;

// Status options for the dropdown
const statusOptions: Array<{ value: WorkstreamStatusInput; label: string }> = [
  { value: "RFP_DRAFT", label: "RFP Draft (RFP_DRAFT)" },
  { value: "PREWORK_RFC", label: "Create Initial Proposal > PREWORK_RFC" },
  { value: "RFP_CANCELLED", label: "Cancel RFP > RFP_CANCELLED" },
  { value: "OPEN_FOR_PROPOSALS", label: "Open for Proposals" },
  { value: "PROPOSAL_SUBMITTED", label: "Proposal Submitted" },
  { value: "NOT_AWARDED", label: "Not Awarded" },
  { value: "AWARDED", label: "Awarded" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "FINISHED", label: "Finished" },
];

const statusStyles = {
  DRAFT: "bg-[#fcdfbd] text-[#ffa033] rounded px-2 py-1 font-semibold",
  SUBMITTED: "bg-[#bfdffd] text-[#339cff] rounded px-2 py-1 font-semibold",
  ACCEPTED: "bg-[#c8ecd1] text-[#4fc86f] rounded px-2 py-1 font-semibold",
  REJECTED: "bg-[#ffaea8] text-[#de3333] rounded px-2 py-1 font-semibold",
};

export default function Editor() {
  const [doc, dispatch] = useSelectedWorkstreamDocument() as [
    WorkstreamDocument,
    (actionOrActions: Action | Action[] | undefined) => void,
  ];

  // Try to get dispatch from context or props
  const [state, setState] = useState(doc.state.global as WorkstreamState);

  useEffect(() => {
    setState(doc.state.global as WorkstreamState);
  }, [doc.state.global]);

  const [selectedDrive] = useSelectedDrive();

  // Local state to track newly created document IDs
  const [newlyCreatedSowId, setNewlyCreatedSowId] = useState<string | null>(
    null
  );
  const [newlyCreatedPaymentTermsId, setNewlyCreatedPaymentTermsId] = useState<
    string | null
  >(null);
  const [newlyCreatedRfpId, setNewlyCreatedRfpId] = useState<string | null>(
    null
  );

  // Loading states to prevent double-clicks
  const [isCreatingRfp, setIsCreatingRfp] = useState(false);
  const [isCreatingSow, setIsCreatingSow] = useState(false);
  const [isCreatingPaymentTerms, setIsCreatingPaymentTerms] = useState(false);

  const createRfpDocument = useCallback(async () => {
    if (isCreatingRfp) return null; // Prevent double-calls
    setIsCreatingRfp(true);
    try {
      const createdNode = await addDocument(
        selectedDrive?.header.id || "",
        `RFP-${state.title || ""}`,
        "powerhouse/rfp",
        undefined,
        undefined,
        undefined,
        "request-for-proposals-editor"
      );
      console.log("Created RFP document", createdNode);
      if (createdNode) {
        await dispatchActions(
          rfpActions.editRfp({
            title: `RFP-${state.title || ""}`,
          }),
          createdNode.id
        );
      }
      return createdNode;
    } catch (error) {
      console.error("Failed to create RFP document:", error);
      return null;
    } finally {
      setIsCreatingRfp(false);
    }
  }, [isCreatingRfp, selectedDrive?.header.id, state.title]);

  const createSowDocument = useCallback(async () => {
    if (isCreatingSow) return null; // Prevent double-calls
    setIsCreatingSow(true);
    try {
      const createdNode = await addDocument(
        selectedDrive?.header.id || "",
        `SOW-${state.title || ""}`,
        "powerhouse/scopeofwork",
        undefined,
        undefined,
        undefined,
        "scope-of-work-editor"
      );
      console.log("Created SOW document", createdNode);
      if (createdNode) {
        await dispatchActions(
          ScopeOfWork.actions.editScopeOfWork({
            title: `SOW-${state.title || ""}`,
          }),
          createdNode.id
        );
      }
      return createdNode;
    } catch (error) {
      console.error("Failed to create SOW document:", error);
      return null;
    } finally {
      setIsCreatingSow(false);
    }
  }, [isCreatingSow, selectedDrive?.header.id, state.title]);

  const createPaymentTermsDocument = useCallback(async () => {
    if (isCreatingPaymentTerms) return null; // Prevent double-calls
    setIsCreatingPaymentTerms(true);
    try {
      const createdNode = await addDocument(
        selectedDrive?.header.id || "",
        `Payment Terms-${state.title || ""}`,
        "payment-terms",
        undefined,
        undefined,
        undefined,
        "payment-terms-editor"
      );
      console.log("Created Payment Terms document", createdNode);
      // Note: Payment Terms might not have actions to initialize, so we just create it
      return createdNode;
    } catch (error) {
      console.error("Failed to create Payment Terms document:", error);
      return null;
    } finally {
      setIsCreatingPaymentTerms(false);
    }
  }, [isCreatingPaymentTerms, selectedDrive?.header.id, state.title]);

  // Local state to track manual input values
  const [manualAuthorInput, setManualAuthorInput] = useState<string>("");

  // Effect to clear local state when global state is updated
  useEffect(() => {
    if (state.initialProposal?.sow && newlyCreatedSowId) {
      setNewlyCreatedSowId(null);
    }
  }, [state.initialProposal?.sow, newlyCreatedSowId]);

  // Effect to clear local state when global state is updated
  useEffect(() => {
    if (state.initialProposal?.paymentTerms && newlyCreatedPaymentTermsId) {
      setNewlyCreatedPaymentTermsId(null);
    }
  }, [state.initialProposal?.paymentTerms, newlyCreatedPaymentTermsId]);

  // Effect to clear local state when global state is updated
  useEffect(() => {
    if (state.rfp?.id && newlyCreatedRfpId) {
      setNewlyCreatedRfpId(null);
    }
  }, [state.rfp?.id, newlyCreatedRfpId]);

  const allDocuments = useSelectedDriveDocuments();

  let rfpDocumentNode: PHDocument | undefined = undefined;
  if (state.rfp?.id) {
    rfpDocumentNode = allDocuments?.find((doc: PHDocument) => {
      return (
        doc.header.documentType === "powerhouse/rfp" &&
        doc.header.id === state.rfp?.id
      );
    });
  }

  // Find SOW document node
  let sowDocumentNode: PHDocument | undefined = undefined;
  if (state.initialProposal?.sow) {
    sowDocumentNode = allDocuments?.find((doc: PHDocument) => {
      return (
        doc.header.documentType === "powerhouse/scopeofwork" &&
        doc.header.id === state.initialProposal?.sow
      );
    });
  }

  // Find Payment Terms document node
  let paymentTermsDocumentNode: PHDocument | undefined = undefined;
  if (state.initialProposal?.paymentTerms) {
    paymentTermsDocumentNode = allDocuments?.find((doc: PHDocument) => {
      return (
        doc.header.documentType === "payment-terms" &&
        doc.header.id === state.initialProposal?.paymentTerms
      );
    });
  }

  // Get RFP document data using useDocumentById hook - always call with stable ID
  const rfpDocumentId = rfpDocumentNode?.header.id || "";
  const rfpDocumentData = useDocumentById(rfpDocumentId);
  const [rfpDocumentDataState] = rfpDocumentData || [];

  // State to track RFP document
  const [rfpDocument, setRfpDocument] = useState<
    | (PHDocument & {
        document: RequestForProposalsState;
      })
    | undefined
  >(undefined);

  // Effect to update RFP document when nodes or document data changes
  useEffect(() => {
    if (
      rfpDocumentNode &&
      rfpDocumentNode.header.id &&
      rfpDocumentNode.header.id !== "" &&
      (
        rfpDocumentDataState?.state as unknown as PHDocumentState & {
          global: RequestForProposalsState;
        }
      )?.global
    ) {
      const newRfpDocument = {
        ...rfpDocumentNode,
        document: (
          rfpDocumentDataState?.state as unknown as PHDocumentState & {
            global: RequestForProposalsState;
          }
        ).global,
      };

      // Only update if the ID changed or if we don't have a document yet
      setRfpDocument((prev) => {
        if (!prev || prev.header.id !== newRfpDocument.header.id) {
          return newRfpDocument;
        }
        // Update if the document content changed
        if (
          JSON.stringify(prev.document) !==
          JSON.stringify(newRfpDocument.document)
        ) {
          return newRfpDocument;
        }
        return prev;
      });
    } else if (
      !rfpDocumentNode ||
      !rfpDocumentNode.header.id ||
      rfpDocumentNode.header.id === ""
    ) {
      setRfpDocument((prev) => (prev === undefined ? prev : undefined));
    }
  }, [rfpDocumentNode, rfpDocumentDataState, newlyCreatedRfpId]);

  const searchRfpDocuments = (userInput: string) => {
    const results = allDocuments?.filter(
      (node): node is PHDocument =>
        node.header.documentType === "powerhouse/rfp" &&
        (!userInput ||
          node.header.name.toLowerCase().includes(userInput.toLowerCase()) ||
          node.header.id.toLowerCase().includes(userInput.toLowerCase()))
    );
    return results?.map((doc) => ({
      value: doc.header.id,
      title: doc.header.name,
      path: "",
    }));
  };
  const searchSowDocuments = (userInput: string) => {
    const results = allDocuments?.filter(
      (node): node is PHDocument =>
        node.header.documentType === "powerhouse/scopeofwork" &&
        (!userInput ||
          node.header.name.toLowerCase().includes(userInput.toLowerCase()) ||
          node.header.id.toLowerCase().includes(userInput.toLowerCase()) ||
          ((
            node.state as unknown as PHDocumentState & {
              global: ScopeOfWorkState;
            }
          )?.global?.title
            ?.toLowerCase()
            .includes(userInput.toLowerCase()) ??
            false))
    );
    return results?.map((doc) => ({
      value: doc.header.id,
      title:
        (doc.state as unknown as PHDocumentState & { global: ScopeOfWorkState })
          ?.global?.title || doc.header.name,
      path: "",
    }));
  };

  const searchPaymentTermsDocuments = (userInput: string) => {
    const results = allDocuments?.filter(
      (node): node is PHDocument =>
        node.header.documentType === "payment-terms" &&
        (!userInput ||
          node.header.name.toLowerCase().includes(userInput.toLowerCase()) ||
          node.header.id.toLowerCase().includes(userInput.toLowerCase()))
    );
    return results?.map((doc) => ({
      value: doc.header.id,
      title: doc.header.name,
      path: "",
    }));
  };

  // Handle workstream field changes
  const handleWorkstreamChange = (field: "code" | "title", value: string) => {
    if (!dispatch) {
      console.error("Dispatch function not available");
      toast(`Failed to update ${field} - no dispatch function`, {
        type: "error",
      });
      return;
    }

    const action = actions.editWorkstream({
      [field]: value || undefined,
    });

    dispatch(action);
  };

  // Handle status change
  const handleStatusChange = (status: WorkstreamStatusInput) => {
    if (!dispatch) {
      console.error("Dispatch function not available");
      toast("Failed to update status - no dispatch function", {
        type: "error",
      });
      return;
    }

    const action = actions.editWorkstream({
      status,
    });

    dispatch(action);
  };

  // Handle client field changes
  const handleClientChange = (field: "name" | "icon", value: string) => {
    if (!dispatch) {
      console.error("Dispatch function not available");
      toast(`Failed to update client ${field} - no dispatch function`, {
        type: "error",
      });
      return;
    }

    const clientId = state.client?.id || generateId();
    const action = actions.editClientInfo({
      clientId,
      [field]: value || undefined,
    });

    dispatch(action);
  };

  // Handle client ID change
  const handleClientIdChange = (clientId: string) => {
    if (!dispatch) {
      console.error("Dispatch function not available");
      toast("Failed to update client ID - no dispatch function", {
        type: "error",
      });
      return;
    }

    const action = actions.editClientInfo({
      clientId,
      name: state.client?.name || undefined,
      icon: state.client?.icon || undefined,
    });

    dispatch(action);
  };

  const alternativeProposalsData = useMemo(() => {
    return state.alternativeProposals.flatMap((p) => [
      {
        ...p,
        authorName: p.author.name,
        authorId: p.author.id,
        authorIcon: p.author.icon,
      },
    ]);
  }, [state.alternativeProposals]);

  const alternativeProposalsColumns = useMemo<Array<ColumnDef<Proposal>>>(
    () => [
      {
        field: "authorName",
        title: "Author",
        editable: true,
        onSave: (newValue, context) => {
          if (newValue !== context.row.author.name) {
            dispatch(
              actions.editAlternativeProposal({
                id: context.row.id,
                proposalAuthor: {
                  id: context.row.author.id,
                  name: newValue as string,
                },
              })
            );
            return true;
          }
          return false;
        },
        renderCell: (value: Proposal["author"]["name"]) => {
          if (value === undefined) {
            return (
              <div className="font-light italic text-left text-gray-500 text-xs">
                + Double-click to add new author
              </div>
            );
          }
          return <div className="text-left">{value}</div>;
        },
      },
      {
        field: "sow",
        title: "SOW",
        type: "oid",
        editable: true,
        align: "center" as ColumnAlignment,
        onSave: (newValue, context) => {
          if (newValue !== context.row.sow) {
            dispatch(
              actions.editAlternativeProposal({
                id: context.row.id as string,
                sowId: newValue as string,
              })
            );
            return true;
          }
          return false;
        },
      },
      {
        field: "paymentTerms",
        title: "Payment Terms",
        type: "oid",
        editable: true,
        align: "center" as ColumnAlignment,
        onSave: (newValue, context) => {
          if (newValue !== context.row.paymentTerms) {
            dispatch(
              actions.editAlternativeProposal({
                id: context.row.id as string,
                paymentTermsId: newValue as string,
              })
            );
            return true;
          }
          return false;
        },
      },
      {
        field: "status",
        title: "Status",
        editable: true,
        align: "center" as ColumnAlignment,
        type: "enum",
        valueGetter: (row: Proposal) => row.status,
        onSave: (newValue, context) => {
          if (newValue !== context.row.status) {
            dispatch(
              actions.editAlternativeProposal({
                id: context.row.id as string,
                status: newValue as ProposalStatusInput,
              })
            );
            return true;
          }
          return false;
        },
        renderCellEditor: buildEnumCellEditor({
          className: "w-[130px]",
          options: [
            { value: "DRAFT", label: "Draft" },
            { value: "SUBMITTED", label: "Submitted" },
            { value: "ACCEPTED", label: "Accepted" },
            { value: "REJECTED", label: "Rejected" },
          ],
        }),
        renderCell: (value: Proposal["status"]) => {
          if (!value) return null;
          return (
            <div
              className={`text-center ${statusStyles[value as keyof typeof statusStyles]}`}
            >
              {value}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="w-full bg-gray-50">
      <div className="p-6 max-w-4xl mx-auto min-h-screen">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workstream</h1>
          {/* <nav className="text-sm text-gray-600">
          <span className="text-blue-600 underline cursor-pointer">Home</span>
          <span className="mx-2">›</span>
          <span>Workstream</span>
        </nav> */}
        </div>

        {/* Main Form Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-row gap-6">
            {/* Code Field */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <TextInput
                className="w-full"
                defaultValue={state.code || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state.code) {
                    handleWorkstreamChange("code", e.target.value);
                  }
                }}
                placeholder="Enter workstream code"
              />
            </div>

            {/* Title Field */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <TextInput
                className="w-full"
                defaultValue={state.title || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state.title) {
                    handleWorkstreamChange("title", e.target.value);
                  }
                }}
                placeholder="Enter workstream title"
              />
            </div>

            {/* Status Field */}
            <div className="flex-1">
              <Select
                label="Status"
                options={statusOptions}
                value={state.status}
                onChange={(value) =>
                  handleStatusChange(value as WorkstreamStatusInput)
                }
              />
            </div>
          </div>
        </div>

        {/* Client Section */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Client</h2>

          <div className="space-y-4">
            {/* Client ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <TextInput
                  className="flex-1"
                  defaultValue={state.client?.id || ""}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    if (e.target.value !== state.client?.id) {
                      handleClientIdChange(e.target.value);
                    }
                  }}
                  placeholder="Enter client ID"
                />
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Client Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <TextInput
                className="w-full"
                defaultValue={state.client?.name || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state.client?.name) {
                    handleClientChange("name", e.target.value);
                  }
                }}
                placeholder="Enter client name"
              />
            </div>

            {/* Client Icon Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <TextInput
                  className="flex-1"
                  defaultValue={state.client?.icon || ""}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    if (e.target.value !== state.client?.icon) {
                      handleClientChange("icon", e.target.value);
                    }
                  }}
                  placeholder="Enter client icon URL"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mt-6 mb-6 shadow-sm">
          <h1 className="text-2xl text-gray-900 mb-4">Request for Proposal</h1>
          <div className="w-full flex flex-row items-center gap-8">
            <div className="w-[350px]">
              <OIDInput
                name="Request for Proposal"
                label="RFP Document"
                placeholder="Search for RFP Document"
                variant="withValueTitleAndDescription"
                value={newlyCreatedRfpId || state.rfp?.id || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state.rfp?.id) {
                    dispatch(
                      actions.setRequestForProposal({
                        rfpId: e.target.value,
                        title: rfpDocument?.document.title || "",
                      })
                    );
                  }
                }}
                // search options as the user types
                fetchOptionsCallback={async (userInput) => {
                  const results = searchRfpDocuments(userInput || "") || [];
                  if (results?.length === 0) {
                    return Promise.reject(new Error("No RFP documents found"));
                  }
                  return results?.map((doc) => ({
                    value: doc.value, // unique document ID
                    title: doc.title, // document title or name
                    path: {
                      text: doc.path,
                      url: doc.value,
                    }, // document path or location
                    description: "", // document description or summary
                    icon: "File", // document icon
                  }));
                }}
                // get details of a specific option by its ID/value
                fetchSelectedOptionCallback={async (documentId) => {
                  console.log("fetching selected option", documentId);
                  const doc = searchRfpDocuments(documentId)?.[0];
                  if (!doc) {
                    return Promise.reject(new Error("RFP document not found"));
                  }
                  return {
                    value: doc.value,
                    title: doc.title,
                    path: {
                      text: doc.path,
                      url: doc.title,
                    },
                    description: "",
                    icon: "File",
                  };
                }}
                initialOptions={[
                  {
                    value: rfpDocument?.header.id || "",
                    title: rfpDocument?.document.title || "",
                    path: {
                      text: rfpDocument?.document.title || "",
                      url: rfpDocument?.header.id || "",
                    },
                    description: "",
                    icon: "File",
                  },
                ]}
              />
            </div>
          </div>
          {!rfpDocument ? (
            <div className="mt-4">
              <Button
                color="light"
                size="small"
                className="cursor-pointer hover:bg-gray-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title={"Save Workstream"}
                aria-description={"Save Workstream"}
                disabled={isCreatingRfp}
                onClick={async () => {
                  const createdNode = await createRfpDocument();
                  if (createdNode) {
                    // Set local state to immediately show the new RFP ID
                    setNewlyCreatedRfpId(createdNode.id);

                    dispatch(
                      actions.setRequestForProposal({
                        rfpId: createdNode.id,
                        title: createdNode.name,
                      })
                    );
                  }
                }}
              >
                {isCreatingRfp ? "Creating..." : "Create RFP Document"}
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Initial Proposal Section */}
        {rfpDocument ? (
          <div>
            {state.initialProposal ? (
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h1 className="text-2xl text-gray-900 mb-4">
                  Initial Proposal
                </h1>
                <div className="flex flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <TextInput
                      label="Author"
                      value={
                        manualAuthorInput ||
                        state.initialProposal?.author?.name ||
                        ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setManualAuthorInput(e.target.value);
                      }}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (
                          e.target.value !== state.initialProposal?.author?.name
                        ) {
                          dispatch(
                            actions.editInitialProposal({
                              id: state.initialProposal?.id || "",
                              proposalAuthor: {
                                id: generateId(),
                                name: e.target.value,
                              },
                            })
                          );
                        }
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <Select
                      label="Status"
                      options={[
                        { value: "DRAFT", label: "Draft" },
                        { value: "SUBMITTED", label: "Submitted" },
                        { value: "ACCEPTED", label: "Accepted" },
                        { value: "REJECTED", label: "Rejected" },
                      ]}
                      value={state.initialProposal.status || "DRAFT"}
                      onChange={(value) => {
                        if (value !== state.initialProposal?.status) {
                          dispatch(
                            actions.editInitialProposal({
                              id: state.initialProposal?.id || "",
                              status: value as ProposalStatusInput,
                            })
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <OIDInput
                      name="Scope of Work"
                      label="Scope Of Work"
                      placeholder="Search for SOW Document"
                      variant="withValueTitleAndDescription"
                      value={
                        newlyCreatedSowId || state.initialProposal?.sow || ""
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (e.target.value !== state.initialProposal?.sow) {
                          dispatch(
                            actions.editInitialProposal({
                              id: state.initialProposal?.id || "",
                              sowId: e.target.value,
                            })
                          );
                        }
                      }}
                      // search options as the user types
                      fetchOptionsCallback={async (userInput) => {
                        const results =
                          searchSowDocuments(userInput || "") || [];
                        if (results?.length === 0) {
                          return Promise.reject(
                            new Error("No SOW documents found")
                          );
                        }
                        return results?.map((doc) => ({
                          value: doc.value, // unique document ID
                          title: doc.title, // document title or name
                          path: {
                            text: doc.path,
                            url: doc.value,
                          }, // document path or location
                          description: "", // document description or summary
                          icon: "File", // document icon
                        }));
                      }}
                      // get details of a specific option by its ID/value
                      fetchSelectedOptionCallback={async (documentId) => {
                        const doc = searchSowDocuments(documentId)?.[0];
                        if (!doc) {
                          return Promise.reject(
                            new Error("SOW document not found")
                          );
                        }
                        return {
                          value: doc.value,
                          title: doc.title,
                          path: {
                            text: doc.path,
                            url: doc.title,
                          },
                          description: "",
                          icon: "File",
                        };
                      }}
                      initialOptions={
                        sowDocumentNode
                          ? [
                              {
                                value: sowDocumentNode.header.id,
                                title:
                                  (
                                    sowDocumentNode.state as unknown as PHDocumentState & {
                                      global: ScopeOfWorkState;
                                    }
                                  )?.global?.title ||
                                  sowDocumentNode.header.name,
                                path: {
                                  text: sowDocumentNode.header.name,
                                  url: sowDocumentNode.header.id,
                                },
                                description: "",
                                icon: "File",
                              },
                            ]
                          : undefined
                      }
                    />
                    <button
                      className="text-sm bg-gray-100 rounded-md mt-1 p-1 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCreatingSow}
                      onClick={async () => {
                        console.log("Creating sow");
                        const createdNode = await createSowDocument();
                        if (createdNode) {
                          // Set local state to immediately show the new SOW ID
                          setNewlyCreatedSowId(createdNode.id);

                          dispatch(
                            actions.editInitialProposal({
                              id: state.initialProposal?.id || "",
                              sowId: createdNode.id,
                            })
                          );
                        }
                      }}
                    >
                      {isCreatingSow ? "Creating..." : "Create sow"}
                    </button>
                  </div>
                  <div className="flex-1">
                    <OIDInput
                      name="Payment Terms"
                      label="Payment Terms"
                      placeholder="Search for Payment Terms Document"
                      variant="withValueTitleAndDescription"
                      value={
                        newlyCreatedPaymentTermsId ||
                        state.initialProposal?.paymentTerms ||
                        ""
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        if (
                          e.target.value !== state.initialProposal?.paymentTerms
                        ) {
                          dispatch(
                            actions.editInitialProposal({
                              id: state.initialProposal?.id || "",
                              paymentTermsId: e.target.value,
                            })
                          );
                        }
                      }}
                      // search options as the user types
                      fetchOptionsCallback={async (userInput) => {
                        const results =
                          searchPaymentTermsDocuments(userInput || "") || [];
                        if (results?.length === 0) {
                          return Promise.reject(
                            new Error("No Payment Terms documents found")
                          );
                        }
                        return results?.map((doc) => ({
                          value: doc.value, // unique document ID
                          title: doc.title, // document title or name
                          path: {
                            text: doc.path,
                            url: doc.value,
                          }, // document path or location
                          description: "", // document description or summary
                          icon: "File", // document icon
                        }));
                      }}
                      // get details of a specific option by its ID/value
                      fetchSelectedOptionCallback={async (documentId) => {
                        const doc =
                          searchPaymentTermsDocuments(documentId)?.[0];
                        if (!doc) {
                          return Promise.reject(
                            new Error("Payment Terms document not found")
                          );
                        }
                        return {
                          value: doc.value,
                          title: doc.title,
                          path: {
                            text: doc.path,
                            url: doc.title,
                          },
                          description: "",
                          icon: "File",
                        };
                      }}
                      initialOptions={
                        paymentTermsDocumentNode
                          ? [
                              {
                                value: paymentTermsDocumentNode.header.id,
                                title: paymentTermsDocumentNode.header.name,
                                path: {
                                  text: paymentTermsDocumentNode.header.name,
                                  url: paymentTermsDocumentNode.header.id,
                                },
                                description: "",
                                icon: "File",
                              },
                            ]
                          : undefined
                      }
                    />
                    <button
                      className="text-sm bg-gray-100 rounded-md mt-1 p-1 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCreatingPaymentTerms}
                      onClick={async () => {
                        console.log("Creating payment terms");
                        const createdNode = await createPaymentTermsDocument();
                        if (createdNode) {
                          // Set local state to immediately show the new Payment Terms ID
                          setNewlyCreatedPaymentTermsId(createdNode.id);

                          dispatch(
                            actions.editInitialProposal({
                              id: state.initialProposal?.id || "",
                              paymentTermsId: createdNode.id,
                            })
                          );
                        }
                      }}
                    >
                      {isCreatingPaymentTerms ? "Creating..." : "Create Payment Terms"}
                    </button>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Alternative Proposals
                  </h2>
                  <ObjectSetTable
                    columns={alternativeProposalsColumns}
                    data={alternativeProposalsData}
                    allowRowSelection={true}
                    onDelete={(data: Proposal[]) => {
                      if (data.length > 0) {
                        data.forEach((d: Proposal) => {
                          dispatch(
                            actions.removeAlternativeProposal({
                              id: d.id,
                            })
                          );
                        });
                      }
                    }}
                    onAdd={(data) => {
                      if (data.authorName) {
                        dispatch(
                          actions.addAlternativeProposal({
                            id: generateId(),
                            proposalAuthor: {
                              id: generateId(),
                              name: data.authorName as string,
                            },
                          })
                        );
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h1 className="text-2xl text-gray-900 mb-4">
                  Initial Proposal
                </h1>
                <div className="mt-4">
                  <Button
                    color="light"
                    size="small"
                    className="cursor-pointer hover:bg-gray-600 hover:text-white"
                    title={"Create Initial Proposal"}
                    aria-description={"Create Initial Proposal"}
                    onClick={() => {
                      console.log("Creating initial proposal");
                      dispatch(
                        actions.editInitialProposal({
                          id: generateId(),
                        })
                      );
                    }}
                  >
                    Create Initial Proposal
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
}
