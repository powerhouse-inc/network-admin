import type { EditorProps } from "document-model";
import {
  type RequestForProposalsDocument,
  actions,
} from "../../document-models/request-for-proposals/index.js";
import { Button } from "@powerhousedao/design-system";
import { useSelectedDocument } from "@powerhousedao/reactor-browser";

export type IProps = EditorProps;

export default function Editor(props: IProps) {
  const [document, dispatch] = useSelectedDocument();

  if (!document) {
    return <div>No document selected</div>;
  }




  return (
    <div className="html-defaults-container">
      <div>
        <h1>This h1 will be styled</h1>
      </div>
    </div>
  );
}
