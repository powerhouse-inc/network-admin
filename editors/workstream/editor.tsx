import type { Action, EditorProps } from "document-model";
import { Button, toast, ToastContainer } from "@powerhousedao/design-system";
import {
  TextInput,
  Select,
  PHIDInput,
  Icon,
  ObjectSetTable,
  ColumnDef,
  ColumnAlignment,
} from "@powerhousedao/document-engineering";
import {
  type WorkstreamDocument,
  actions,
  type WorkstreamStatus,
  type WorkstreamStatusInput,
  ProposalStatusInput,
} from "../../document-models/workstream/index.js";
import {
  type RequestForProposalsDocument,
  type RequestForProposalsState,
} from "../../document-models/request-for-proposals/index.js";
import { generateId } from "document-model";
import {
  useAllDocuments,
  useNodes,
  useDocumentById,
  setSelectedNode,
} from "@powerhousedao/reactor-browser";
import { type Node, type FileNode } from "document-drive";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fa } from "zod/v4/locales";

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

export default function Editor(props: any) {
  const [doc, dispatch] = useDocumentById(props.documentId) as [
    WorkstreamDocument,
    (actionOrActions: Action | Action[] | undefined) => void,
  ];

  // Try to get dispatch from context or props
  const state = doc.state.global as any;
  const createRfpDocument = props.createRfp;
  const setActiveDocumentId = props.setActiveDocumentId;
  const createSowDocument = props.createSow;
  const createPaymentTermsDocument = props.createPaymentTerms;

  // Local state to track newly created SOW document ID
  const [newlyCreatedSowId, setNewlyCreatedSowId] = useState<string | null>(
    null
  );

  // Local state to track newly created Payment Terms document ID
  const [newlyCreatedPaymentTermsId, setNewlyCreatedPaymentTermsId] = useState<
    string | null
  >(null);

  // Local state to track newly created RFP document ID
  const [newlyCreatedRfpId, setNewlyCreatedRfpId] = useState<string | null>(
    null
  );

  // Local state to track manual input values
  const [manualSowInput, setManualSowInput] = useState<string>("");
  const [manualPaymentTermsInput, setManualPaymentTermsInput] =
    useState<string>("");
  const [manualAuthorInput, setManualAuthorInput] = useState<string>("");

  // Effect to clear local state when global state is updated
  useEffect(() => {
    if (state.initialProposal?.sow && newlyCreatedSowId) {
      setNewlyCreatedSowId(null);
      setManualSowInput("");
    }
  }, [state.initialProposal?.sow, newlyCreatedSowId]);

  // Effect to clear local state when global state is updated
  useEffect(() => {
    if (state.initialProposal?.paymentTerms && newlyCreatedPaymentTermsId) {
      setNewlyCreatedPaymentTermsId(null);
      setManualPaymentTermsInput("");
    }
  }, [state.initialProposal?.paymentTerms, newlyCreatedPaymentTermsId]);

  // Effect to clear local state when global state is updated
  useEffect(() => {
    if (state.rfp?.id && newlyCreatedRfpId) {
      setNewlyCreatedRfpId(null);
    }
  }, [state.rfp?.id, newlyCreatedRfpId]);

  // Checking if there is an RFP document for this workstream
  const nodes: Node[] = useNodes() || [];
  const workstreamDocument: Node | undefined = nodes.find(
    (node) => node.id === doc.header.id
  );
  const fileNodes = nodes.filter(
    (node): node is FileNode => node.kind === "file"
  );
  const rfpDocumentNode: FileNode | undefined = fileNodes.find(
    (node: FileNode) => {
      if (!workstreamDocument && !node.parentFolder) return false;
      return (
        node.parentFolder === workstreamDocument?.parentFolder &&
        node.documentType === "powerhouse/rfp"
      );
    }
  );

  const sowDocumentNode: FileNode | undefined = fileNodes.find(
    (node: FileNode) => {
      if (!workstreamDocument && !node.parentFolder) return false;
      return (
        node.parentFolder === workstreamDocument?.parentFolder &&
        node.documentType === "powerhouse/scopeofwork"
      );
    }
  );

  const paymentTermsDocumentNode: FileNode | undefined = fileNodes.find(
    (node: FileNode) => {
      if (!workstreamDocument && !node.parentFolder) return false;
      return (
        node.parentFolder === workstreamDocument?.parentFolder &&
        node.documentType === "payment-terms"
      );
    }
  );

  // Get RFP document data using useDocumentById hook - always call with stable ID
  const rfpDocumentId = rfpDocumentNode?.id || "";
  const rfpDocumentData = useDocumentById(rfpDocumentId);
  const [rfpDocumentDataState] = rfpDocumentData || [];

  // State to track RFP document
  const [rfpDocument, setRfpDocument] = useState<
    | (FileNode & {
        document: RequestForProposalsState;
      })
    | undefined
  >(undefined);

  // Effect to update RFP document when nodes or document data changes
  useEffect(() => {
    if (
      rfpDocumentNode &&
      rfpDocumentNode.id &&
      rfpDocumentNode.id !== "" &&
      (rfpDocumentDataState?.state as any)?.global
    ) {
      const newRfpDocument = {
        ...rfpDocumentNode,
        document: (rfpDocumentDataState?.state as any)
          .global as RequestForProposalsState,
      };
      
      // Only update if the ID changed or if we don't have a document yet
      setRfpDocument((prev) => {
        if (!prev || prev.id !== newRfpDocument.id) {
          return newRfpDocument;
        }
        // Update if the document content changed
        if (JSON.stringify(prev.document) !== JSON.stringify(newRfpDocument.document)) {
          return newRfpDocument;
        }
        return prev;
      });
    } else if (
      !rfpDocumentNode ||
      !rfpDocumentNode.id ||
      rfpDocumentNode.id === ""
    ) {
      setRfpDocument((prev) => prev === undefined ? prev : undefined);
    }
  }, [rfpDocumentNode, rfpDocumentDataState]);

  const searchRfpDocuments = (userInput: string) => {
    const results = fileNodes.filter(
      (node): node is FileNode =>
        (node.kind === "file" &&
          node.documentType === "powerhouse/rfp" &&
          node.name.toLowerCase().includes(userInput.toLowerCase())) ||
        node.id.toLowerCase().includes(userInput.toLowerCase())
    );
    return results.map((doc) => ({
      value: doc.id,
      title: doc.name,
      path: nodes.find((node) => node.id === doc.parentFolder)?.name || "",
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
    return state.alternativeProposals.flatMap((p: any) => [
      {
        ...p,
        authorName: p.author.name,
        authorId: p.author.id,
        authorIcon: p.author.icon,
      },
    ]);
  }, [state.alternativeProposals]);

  const alternativeProposalsColumns = useMemo<Array<ColumnDef<any>>>(
    () => [
      {
        field: "authorName",
        title: "Author",
        editable: true,
        onSave: (newValue: any, context: any) => {
          if (newValue !== context.row.title) {
            // dispatch(
            //   actions.editDeliverable({
            //     id: context.row.id,
            //     title: newValue as string,
            //   })
            // );
            return true;
          }
          return false;
        },
        renderCell: (value: any, context: any) => {
          if (value === "") {
            return (
              <div className="font-light italic text-left text-gray-500">
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
        editable: true,
        align: "center" as ColumnAlignment,
        onSave: (newValue: any, context: any) => {
          if (newValue !== context.row.title) {
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
        editable: true,
        align: "center" as ColumnAlignment,
        onSave: (newValue: any, context: any) => {
          if (newValue !== context.row.title) {
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
        editable: false,
        align: "center" as ColumnAlignment,
        width: 100,
        renderCell: (value: any, context: any) => {
          if (!value) return null;
          return (
            <Select
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "SUBMITTED", label: "Submitted" },
                { value: "ACCEPTED", label: "Accepted" },
                { value: "REJECTED", label: "Rejected" },
              ]}
              value={value || "DRAFT"}
              onChange={(value) => {
                if (value !== value) {
                  dispatch(
                    actions.editAlternativeProposal({
                      id: context.row.id as string,
                      status: value as ProposalStatusInput,
                    })
                  );
                }
              }}
            />
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

        {rfpDocument ? (
          <div className="bg-white rounded-lg p-6 mt-6 mb-6 shadow-sm">
            <h1 className="text-2xl text-gray-900 mb-4">
              Request for Proposal
            </h1>
            <div className="w-full flex flex-row items-center gap-8">
              <div className="w-[350px]">
                <PHIDInput
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
                          title: rfpDocument.document.title,
                        })
                      );
                    }
                  }}
                  // search options as the user types
                  fetchOptionsCallback={async (userInput) => {
                    const results = searchRfpDocuments(userInput);
                    if (results.length === 0) {
                      return Promise.reject(
                        new Error("No RFP documents found")
                      );
                    }
                    return results.map((doc) => ({
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
                    const [doc] = searchRfpDocuments(documentId);
                    if (!doc) {
                      return Promise.reject(
                        new Error("RFP document not found")
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
                  initialOptions={[
                    {
                      value: rfpDocument.id,
                      title: rfpDocument.document.title,
                      path: {
                        text: rfpDocument.document.title,
                        url: rfpDocument.id,
                      },
                      description: "",
                      icon: "File",
                    },
                  ]}
                />
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center gap-2">
                  <Icon
                    className="hover:cursor-pointer hover:bg-gray-500"
                    name="Moved"
                    size={18}
                    onClick={() => {
                      setActiveDocumentId(rfpDocumentNode?.id || "");
                    }}
                  />
                  <span>RFP Editor</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 mt-6 mb-6 shadow-sm">
            <h1 className="text-2xl text-gray-900 mb-4">
              Request for Proposal
            </h1>
            <div className="mt-4">
              <Button
                color="light"
                size="small"
                className="cursor-pointer hover:bg-gray-600 hover:text-white"
                title={"Save Workstream"}
                aria-description={"Save Workstream"}
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
                Create RFP Document
              </Button>
            </div>
          </div>
        )}
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
                    <TextInput
                      label="Sow"
                      value={
                        newlyCreatedSowId ||
                        manualSowInput ||
                        state.initialProposal?.sow ||
                        ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setManualSowInput(e.target.value);
                        setNewlyCreatedSowId(null); // Clear newly created ID when user starts typing
                      }}
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
                    />
                    <button
                      className="text-sm bg-gray-100 rounded-md p-1 hover:bg-gray-200"
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
                      Create sow
                    </button>
                  </div>
                  <div className="flex-1">
                    <TextInput
                      label="Payment Terms"
                      value={
                        newlyCreatedPaymentTermsId ||
                        manualPaymentTermsInput ||
                        state.initialProposal?.paymentTerms ||
                        ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setManualPaymentTermsInput(e.target.value);
                        setNewlyCreatedPaymentTermsId(null); // Clear newly created ID when user starts typing
                      }}
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
                    />
                    <button
                      className="text-sm bg-gray-100 rounded-md p-1 hover:bg-gray-200"
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
                      Create Payment Terms
                    </button>
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
                        if (value !== state.initialProposal.status) {
                          dispatch(
                            actions.editInitialProposal({
                              id: state.initialProposal.id,
                              status: value as ProposalStatusInput,
                            })
                          );
                        }
                      }}
                    />
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
                    onDelete={(data: any) => {
                      if (data.length > 0) {
                        data.forEach((d: any) => {
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
