import { setName } from "document-model";
import type { FormEventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { useSelectedRequestForProposalsDocument } from "@powerhousedao/network-admin/document-models/request-for-proposals";

/** Displays the name of the selected RequestForProposals document and allows editing it */
export function EditRequestForProposalsName() {
  const [requestForProposalsDocument, dispatch] =
    useSelectedRequestForProposalsDocument();
  const [isEditing, setIsEditing] = useState(false);

  if (!requestForProposalsDocument) return null;

  const requestForProposalsDocumentName =
    requestForProposalsDocument.header.name;

  const onClickEditRequestForProposalsName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(true);
  };

  const onClickCancelEditRequestForProposalsName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(false);
  };

  const onSubmitSetName: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const name = nameInput.value;
    if (!name) return;

    dispatch(setName(name));
    setIsEditing(false);
  };

  if (isEditing)
    return (
      <form
        className="flex gap-2 items-center justify-between"
        onSubmit={onSubmitSetName}
      >
        <input
          className="text-lg font-semibold text-gray-900 p-1"
          type="text"
          name="name"
          defaultValue={requestForProposalsDocumentName}
          autoFocus
        />
        <div className="flex gap-2">
          <button type="submit" className="text-sm text-gray-600">
            Save
          </button>
          <button
            className="text-sm text-red-800"
            onClick={onClickCancelEditRequestForProposalsName}
          >
            Cancel
          </button>
        </div>
      </form>
    );

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">
        {requestForProposalsDocumentName}
      </h2>
      <button
        className="text-sm text-gray-600"
        onClick={onClickEditRequestForProposalsName}
      >
        Edit Name
      </button>
    </div>
  );
}
