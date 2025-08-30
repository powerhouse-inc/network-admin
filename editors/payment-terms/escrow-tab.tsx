import { useState, useCallback } from "react";
import { TextInput, Textarea } from "@powerhousedao/document-engineering";
import { Button, toast } from "@powerhousedao/design-system";
import type { PaymentTermsState } from "../../document-models/payment-terms/gen/schema/types.js";

export interface EscrowTabProps {
  state: PaymentTermsState;
  dispatch: (action: any) => void;
  actions: any;
}

export function EscrowTab({ state, dispatch, actions }: EscrowTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    amountHeld: state.escrowDetails?.amountHeld?.value?.toString() || "",
    proofOfFundsDocumentId: state.escrowDetails?.proofOfFundsDocumentId || "",
    releaseConditions: state.escrowDetails?.releaseConditions || "",
    escrowProvider: state.escrowDetails?.escrowProvider || ""
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amountHeld || isNaN(parseFloat(formData.amountHeld))) {
      toast("Please enter a valid amount to be held in escrow", {
        type: "error",
      });
      return;
    }
    
    if (!formData.releaseConditions.trim()) {
      toast("Release conditions are required", {
        type: "error",
      });
      return;
    }
    
    dispatch(actions.setEscrowDetails({
      amountHeld: {
        value: parseFloat(formData.amountHeld),
        unit: state.currency
      },
      proofOfFundsDocumentId: formData.proofOfFundsDocumentId || undefined,
      releaseConditions: formData.releaseConditions,
      escrowProvider: formData.escrowProvider || undefined
    }));
    
    toast("Escrow details saved", {
      type: "success",
    });
    setIsEditing(false);
  }, [formData, dispatch, actions, state.currency]);

  const handleCancel = useCallback(() => {
    setFormData({
      amountHeld: state.escrowDetails?.amountHeld?.value?.toString() || "",
      proofOfFundsDocumentId: state.escrowDetails?.proofOfFundsDocumentId || "",
      releaseConditions: state.escrowDetails?.releaseConditions || "",
      escrowProvider: state.escrowDetails?.escrowProvider || ""
    });
    setIsEditing(false);
  }, [state.escrowDetails]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Escrow Configuration</h2>
          <Button
            onClick={() => setIsEditing(true)}
            color="light"
            size="small"
            className="cursor-pointer hover:bg-blue-600 hover:text-white"
          >
            {state.escrowDetails ? "Edit Escrow" : "Configure Escrow"}
          </Button>
        </div>

        {state.escrowDetails && state.escrowDetails.releaseConditions ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Held</label>
              <p className="text-lg dark:text-white">
                {state.escrowDetails.amountHeld 
                  ? `${state.escrowDetails.amountHeld.value} ${state.escrowDetails.amountHeld.unit}` 
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Escrow Provider</label>
              <p className="text-lg dark:text-white">{state.escrowDetails.escrowProvider || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proof of Funds Document ID</label>
              <p className="text-lg font-mono text-sm dark:text-white">
                {state.escrowDetails.proofOfFundsDocumentId || "Not provided"}
              </p>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Release Conditions</label>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border dark:border-gray-600">
                <p className="text-sm dark:text-white">{state.escrowDetails.releaseConditions}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No escrow configuration set up yet.</p>
            <p className="text-sm">Click "Configure Escrow" to get started.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Configure Escrow</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TextInput
          label={`Amount Held (${state.currency}) *`}
          type="number"
          value={formData.amountHeld}
          onChange={(e) => setFormData({...formData, amountHeld: e.target.value})}
          className="w-full"
          placeholder="0.00"
          step="0.01"
          required
        />

        <TextInput
          label="Escrow Provider"
          value={formData.escrowProvider}
          onChange={(e) => setFormData({...formData, escrowProvider: e.target.value})}
          className="w-full"
          placeholder="e.g., Escrow.com"
        />

        <TextInput
          label="Proof of Funds Document ID"
          value={formData.proofOfFundsDocumentId}
          onChange={(e) => setFormData({...formData, proofOfFundsDocumentId: e.target.value})}
          className="w-full"
          placeholder="Document reference ID"
        />

        <div className="col-span-1">
          <Textarea
            label="Release Conditions *"
            value={formData.releaseConditions}
            onChange={(e) => setFormData({...formData, releaseConditions: e.target.value})}
            className="w-full"
            rows={4}
            placeholder="Describe the conditions for releasing escrow funds..."
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
        >
          Save Escrow Details
        </Button>
        <Button
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}