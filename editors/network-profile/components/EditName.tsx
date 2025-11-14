import { setName } from "document-model";
import type { FormEventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { useSelectedNetworkProfileDocument } from "@powerhousedao/network-admin/document-models/network-profile";

/** Displays the name of the selected NetworkProfile document and allows editing it */
export function EditNetworkProfileName() {
  const [networkProfileDocument, dispatch] =
    useSelectedNetworkProfileDocument();
  const [isEditing, setIsEditing] = useState(false);

  if (!networkProfileDocument) return null;

  const networkProfileDocumentName = networkProfileDocument.header.name;

  const onClickEditNetworkProfileName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(true);
  };

  const onClickCancelEditNetworkProfileName: MouseEventHandler<
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
          defaultValue={networkProfileDocumentName}
          autoFocus
        />
        <div className="flex gap-2">
          <button type="submit" className="text-sm text-gray-600">
            Save
          </button>
          <button
            className="text-sm text-red-800"
            onClick={onClickCancelEditNetworkProfileName}
          >
            Cancel
          </button>
        </div>
      </form>
    );

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">
        {networkProfileDocumentName}
      </h2>
      <button
        className="text-sm text-gray-600"
        onClick={onClickEditNetworkProfileName}
      >
        Edit Name
      </button>
    </div>
  );
}
