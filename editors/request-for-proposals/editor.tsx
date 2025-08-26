import type { EditorProps } from "document-model";
import {
  type RequestForProposalsDocument,
  actions,
} from "../../document-models/request-for-proposals/index.js";
import { Button } from "@powerhousedao/design-system";
import { useSelectedDocument } from "@powerhousedao/reactor-browser";
import { TextInput } from "@powerhousedao/document-engineering";

export type IProps = EditorProps;

export default function Editor(props: IProps) {
  const [document, dispatch] = useSelectedDocument();

  if (!document) {
    return <div>No document selected</div>;
  }




  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request for Proposals</h1>
        {/* Main Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Code Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code
            </label>
            <TextInput
              className="w-full"
              // defaultValue={state.code || ""}
              // onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              //   if (e.target.value !== state.code) {
              //     dispatch(actions.editRfp({  code: e.target.value }));
              //   }
              // }}
              placeholder="Enter workstream code"
            />
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <TextInput
              className="w-full"
              // defaultValue={state.title || ""}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                // if (e.target.value !== state.title) {
                //   handleWorkstreamChange("title", e.target.value);
                // }
              }}
              placeholder="Enter workstream title"
            />
          </div>

          {/* Status Field */}
          <div>
            {/* <Select
              label="Status"
              options={statusOptions}
              value={state.status}
              onChange={(value) => handleStatusChange(value as WorkstreamStatusInput)}
            /> */}
          </div>
        </div>

      </div>
    </div>
  );
}
