import type { EditorProps } from "document-model";
import { Button, toast, ToastContainer } from "@powerhousedao/design-system";
import {
  TextInput,
  Select,
  PHIDInput,
  Icon,
} from "@powerhousedao/document-engineering";
import {
  type WorkstreamDocument,
  actions,
  type WorkstreamStatus,
  type WorkstreamStatusInput,
} from "../../document-models/workstream/index.js";
import { type RequestForProposalsDocument, type RequestForProposalsState } from "../../document-models/request-for-proposals/index.js";
import { generateId } from "document-model";
import { useAllDocuments, useNodes, useDocumentById, setSelectedNode } from "@powerhousedao/reactor-browser";
import { type Node, type FileNode } from "document-drive";
import { useCallback, useEffect, useState } from "react";

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
  // Debug: Log props to understand what's available
  const { document, context, dispatch } = props;
  // Try to get dispatch from context or props
  const state = document.state.global as any;
  const createRfpDocument = props.createRfp;
  const setActiveDocumentId = props.setActiveDocumentId;

  // Checking if there is an RFP document for this workstream
  const nodes: Node[] = useNodes() || [];
  const workstreamDocument: Node | undefined = nodes.find(
    (node) => node.id === document.header.id
  );
  const fileNodes = nodes.filter(
    (node): node is FileNode => node.kind === "file"
  );
  const rfpDocumentNode: FileNode | undefined = fileNodes.find((node: FileNode) => {
    if (!workstreamDocument && !node.parentFolder) return false;
    return node.parentFolder === workstreamDocument?.parentFolder && node.documentType === "powerhouse/rfp";
  });

  // Get RFP document data using useDocumentById hook - always call with stable ID
  const rfpDocumentId = rfpDocumentNode?.id || "";
  const rfpDocumentData = useDocumentById(rfpDocumentId);
  const [rfpDocumentDataState] = rfpDocumentData || [];

  // State to track RFP document
  const [rfpDocument, setRfpDocument] = useState<(FileNode & {
    document: RequestForProposalsState
  }) | undefined>(undefined);

  // Effect to update RFP document when nodes or document data changes
  useEffect(() => {
    if (rfpDocumentNode && rfpDocumentNode.id && rfpDocumentNode.id !== "" && rfpDocumentDataState?.state?.global) {
      setRfpDocument({
        ...rfpDocumentNode,
        document: rfpDocumentDataState.state.global as RequestForProposalsState
      });
    } else if (!rfpDocumentNode || !rfpDocumentNode.id || rfpDocumentNode.id === "") {
      setRfpDocument(undefined);
    }
  }, [rfpDocumentNode, rfpDocumentDataState]);

  const searchRfpDocuments = (userInput: string) => {
    const results = fileNodes.filter(
      (node): node is FileNode =>
        node.kind === "file" &&
        node.documentType === "powerhouse/rfp" &&
        node.name.toLowerCase().includes(userInput.toLowerCase()) ||
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workstream</h1>
        {/* <nav className="text-sm text-gray-600">
          <span className="text-blue-600 underline cursor-pointer">Home</span>
          <span className="mx-2">›</span>
          <span>Workstream</span>
        </nav> */}
      </div>

      {/* Main Form Section */}
      <div className="flex flex-row gap-6 mb-8">
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

      {/* Client Section */}
      <div className="border border-gray-300 rounded-lg p-6">
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
        <>
          <h1 className="mt-10 text-2xl text-gray-900 mb-4">
            Request for Proposal
          </h1>
          <div className="w-full flex flex-row items-center gap-8">
            <div className="w-[350px]">
              <PHIDInput
                name="Request for Proposal"
                label="RFP Document"
                placeholder="Search for RFP Document"
                variant="withValueTitleAndDescription"
                value={state.rfp?.id || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state.rfp?.id) {
                    dispatch(actions.setRequestForProposal({ rfpId: e.target.value, title: rfpDocument.document.title }));
                  }
                }}
                // search options as the user types
                fetchOptionsCallback={async (userInput) => {
                  const results = searchRfpDocuments(userInput);
                  if (results.length === 0) {
                    return Promise.reject(new Error("No RFP documents found"));
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
                initialOptions={[{
                  value: rfpDocument.id,
                  title: rfpDocument.document.title,
                  path: {
                    text: rfpDocument.document.title,
                    url: rfpDocument.id,
                  },
                  description: "",
                  icon: "File",
                }]}
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
        </>
      ) : (
        <>
          <h1 className="mt-10 text-2xl text-gray-900 mb-4">
            Request for Proposal
          </h1>
          <div className="mt-8 ">
            <Button
              color="light"
              size="small"
              className="cursor-pointer hover:bg-gray-600 hover:text-white"
              title={"Save Workstream"}
              aria-description={"Save Workstream"}
              onClick={createRfpDocument}
            >
              Create RFP Document
            </Button>
          </div>
        </>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
