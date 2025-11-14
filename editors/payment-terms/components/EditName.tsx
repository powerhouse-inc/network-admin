import { setName } from "document-model";
import type { FormEventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { useSelectedPaymentTermsDocument } from "@powerhousedao/network-admin/document-models/payment-terms";

/** Displays the name of the selected PaymentTerms document and allows editing it */
export function EditPaymentTermsName() {
  const [paymentTermsDocument, dispatch] = useSelectedPaymentTermsDocument();
  const [isEditing, setIsEditing] = useState(false);

  if (!paymentTermsDocument) return null;

  const paymentTermsDocumentName = paymentTermsDocument.header.name;

  const onClickEditPaymentTermsName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(true);
  };

  const onClickCancelEditPaymentTermsName: MouseEventHandler<
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
          defaultValue={paymentTermsDocumentName}
          autoFocus
        />
        <div className="flex gap-2">
          <button type="submit" className="text-sm text-gray-600">
            Save
          </button>
          <button
            className="text-sm text-red-800"
            onClick={onClickCancelEditPaymentTermsName}
          >
            Cancel
          </button>
        </div>
      </form>
    );

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">
        {paymentTermsDocumentName}
      </h2>
      <button
        className="text-sm text-gray-600"
        onClick={onClickEditPaymentTermsName}
      >
        Edit Name
      </button>
    </div>
  );
}
