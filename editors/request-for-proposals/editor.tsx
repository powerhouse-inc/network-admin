import type { EditorProps } from "document-model";
import {
  type RequestForProposalsDocument,
  RequestForProposalsState,
  actions,
  type RfpStatusInput,
} from "../../document-models/request-for-proposals/index.js";
import { Button, toast } from "@powerhousedao/design-system";
import { useSelectedDocument } from "@powerhousedao/reactor-browser";
import {
  DatePicker,
  Select,
  TextInput,
} from "@powerhousedao/document-engineering";
import { MarkdownEditor } from "./markdown-editor.js";

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

export default function Editor(props: any) {
  let dispatch: any;
  const { document } = props;
  const state: RequestForProposalsState = document?.state
    .global as RequestForProposalsState;

  if (!document) {
    return <div>No document selected</div>;
  }

  if (props.dispatch) {
    dispatch = props.dispatch;
  } else {
    const selectedDocument = useSelectedDocument();
    dispatch = selectedDocument[1];
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Request for Proposals
        </h1>
        {/* Main Form Section */}
        <div className="flex flex-row gap-2 mb-8">
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
          <div className="w-[150px] flex-1">
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

        {/* Description */}
        <div className="mb-8">
          <MarkdownEditor
            height={200}
            label="Summary"
            value={state.summary || ""}
            onChange={() => {}}
            onBlur={(value) => dispatch(actions.editRfp({ summary: value }))}
          />
        </div>

        {/* Submission Deadline */}
        <div className="mb-8 w-[250px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Deadline
          </label>
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

        {/* Eligibility Criteria */}
        <div className="mb-8">
          <MarkdownEditor
            height={200}
            label="Eligibility Criteria"
            value={state.eligibilityCriteria || ""}
            onChange={() => {}}
            onBlur={(value) =>
              dispatch(actions.editRfp({ eligibilityCriteria: value }))
            }
          />
        </div>

        {/* Eligibility Criteria */}
        <div className="mb-8">
          <MarkdownEditor
            height={200}
            label="Evaluation Criteria"
            value={state.evaluationCriteria || ""}
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
