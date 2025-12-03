import type { Action, EditorProps } from "document-model";
import {
  type RequestForProposalsDocument,
  actions,
  type RfpStatusInput,
} from "../../document-models/request-for-proposals/index.js";
import {
  DatePicker,
  Select,
  TextInput,
  NumberInput,
} from "@powerhousedao/document-engineering";
import { toast, ToastContainer } from "@powerhousedao/design-system/connect";
import { MarkdownEditor } from "./markdown-editor.js";
import { useSelectedRequestForProposalsDocument } from "../../document-models/request-for-proposals/hooks.js";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";

export type IProps = EditorProps;

const statusOptions = [
  { label: "DRAFT", value: "DRAFT" },
  { label: "REQUEST_FOR_COMMMENTS", value: "REQUEST_FOR_COMMMENTS" },
  { label: "CANCELED", value: "CANCELED" },
  { label: "OPEN_FOR_PROPOSALS", value: "OPEN_FOR_PROPOSALS" },
  { label: "AWARDED", value: "AWARDED" },
  { label: "NOT_AWARDED", value: "NOT_AWARDED" },
  { label: "CLOSED", value: "CLOSED" },
];

export default function Editor() {
  const [doc, dispatch] = useSelectedRequestForProposalsDocument() as [
    RequestForProposalsDocument,
    (actionOrActions: Action | Action[] | undefined) => void,
  ];

  // Get the parent folder node for the currently selected node
  const parentFolder = useParentFolderForSelectedNode();

  // Set the selected node to the parent folder node (close the editor)
  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  const state = doc?.state.global;

  // Validation function for budget range
  const validateBudgetRange = (min: number | null, max: number | null) => {
    if (min !== null && max !== null && min >= max) {
      toast("Minimum budget must be less than maximum budget", {
        type: "error",
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <DocumentToolbar document={doc} onClose={handleClose} />
      <div className="w-full bg-gray-50">
        <div className="p-6 max-w-4xl mx-auto min-h-screen">
          {/* Header Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Request for Proposals
            </h1>
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
                      dispatch(actions.editRfp({ code: e.target.value }));
                    }
                  }}
                  placeholder="Enter rfp code"
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
                      dispatch(actions.editRfp({ title: e.target.value }));
                    }
                  }}
                  placeholder="Enter rfp title"
                />
              </div>

              {/* Status Field */}
              <div className="w-[150px]">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={state.status}
                  onChange={(value) =>
                    dispatch(
                      actions.editRfp({ status: value as RfpStatusInput }),
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <MarkdownEditor
              height={200}
              label="Summary"
              value={state.summary ?? ""}
              onChange={() => {}}
              onBlur={(value: string) =>
                dispatch(actions.editRfp({ summary: value }))
              }
            />
          </div>

          {/* Submission Deadline Section */}
          <div className="flex flex-row justify-between bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Deadline
              </label>
              <div className="w-[250px]">
                <DatePicker
                  className="bg-white"
                  value={state.deadline ? new Date(state.deadline) : undefined}
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    dispatch(
                      actions.editRfp({ deadline: date?.toISOString() }),
                    );
                  }}
                  name="submission-deadline"
                  placeholder="Select submission deadline"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <div className="flex flex-row gap-2">
                <NumberInput
                  name="minimum-budget"
                  defaultValue={state.budgetRange?.min || undefined}
                  onBlur={(e) => {
                    const newMin = Number(e.target.value);
                    if (newMin !== Number(state.budgetRange?.min)) {
                      // Validate before dispatching
                      if (
                        validateBudgetRange(
                          newMin,
                          state.budgetRange?.max || null,
                        )
                      ) {
                        dispatch(
                          actions.editRfp({
                            budgetRange: { min: newMin },
                          }),
                        );
                      }
                    }
                  }}
                  placeholder="Minimum budget"
                  className="w-[140px]"
                />
                <span className="text-gray-500">-</span>
                <NumberInput
                  name="maximum-budget"
                  defaultValue={state.budgetRange?.max || undefined}
                  onBlur={(e) => {
                    const newMax = Number(e.target.value);
                    if (newMax !== Number(state.budgetRange?.max)) {
                      // Validate before dispatching
                      if (
                        validateBudgetRange(
                          state.budgetRange?.min || null,
                          newMax,
                        )
                      ) {
                        dispatch(
                          actions.editRfp({
                            budgetRange: { max: newMax },
                          }),
                        );
                      }
                    }
                  }}
                  placeholder="Maximum budget"
                  className="w-[140px]"
                />
                <Select
                  placeholder="Currency"
                  options={[
                    "USD",
                    "EUR",
                    "GBP",
                    "JPY",
                    "CHF",
                    "CNY",
                    "DKK",
                    "USDC",
                    "USDS",
                    "DAI",
                  ].map((currency) => ({ label: currency, value: currency }))}
                  value={state.budgetRange?.currency || ""}
                  onChange={(value) => {
                    if (value !== state.budgetRange?.currency) {
                      dispatch(
                        actions.editRfp({
                          budgetRange: { currency: value as string },
                        }),
                      );
                    }
                  }}
                  className="w-[115px]"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Criteria Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <MarkdownEditor
              height={200}
              label="Eligibility Criteria"
              value={state.eligibilityCriteria ?? ""}
              onChange={() => {}}
              onBlur={(value: string) =>
                dispatch(actions.editRfp({ eligibilityCriteria: value }))
              }
            />
          </div>

          {/* Evaluation Criteria Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <MarkdownEditor
              height={200}
              label="Evaluation Criteria"
              value={state.evaluationCriteria ?? ""}
              onChange={() => {}}
              onBlur={(value: string) =>
                dispatch(actions.editRfp({ evaluationCriteria: value }))
              }
            />
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}
