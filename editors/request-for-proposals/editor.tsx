import type { Action, EditorProps } from "document-model";
import {
  type RequestForProposalsDocument,
  RequestForProposalsState,
  actions,
  type RfpStatusInput,
} from "../../document-models/request-for-proposals/index.js";
import {
  DatePicker,
  Select,
  TextInput,
} from "@powerhousedao/document-engineering";
import { MarkdownEditor } from "./markdown-editor.js";
import { useSelectedRequestForProposalsDocument } from "../hooks/useRequestForProposalsDocument.js";

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

  const state = doc?.state.global as RequestForProposalsState;

  return (
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
                  dispatch(actions.editRfp({ status: value as RfpStatusInput }))
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
            onBlur={(value) => dispatch(actions.editRfp({ summary: value }))}
          />
        </div>

        {/* Submission Deadline Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Deadline
          </label>
          <div className="w-[250px]">
            <DatePicker
              value={state.deadline ? new Date(state.deadline) : undefined}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                dispatch(actions.editRfp({ deadline: date?.toISOString() }));
              }}
              name="submission-deadline"
              placeholder="Select submission deadline"
            />
          </div>
        </div>

        {/* Eligibility Criteria Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <MarkdownEditor
            height={200}
            label="Eligibility Criteria"
            value={state.eligibilityCriteria ?? ""}
            onChange={() => {}}
            onBlur={(value) =>
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
            onBlur={(value) =>
              dispatch(actions.editRfp({ evaluationCriteria: value }))
            }
          />
        </div>
      </div>
    </div>
  );
}
