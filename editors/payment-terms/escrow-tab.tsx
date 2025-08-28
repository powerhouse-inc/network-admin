import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

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
    
    dispatch(actions.setEscrowDetails({
      amountHeld: {
        value: parseFloat(formData.amountHeld),
        unit: state.currency
      },
      proofOfFundsDocumentId: formData.proofOfFundsDocumentId || undefined,
      releaseConditions: formData.releaseConditions,
      escrowProvider: formData.escrowProvider || undefined
    }));
    
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
          <h2 className="text-xl font-semibold">Escrow Configuration</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {state.escrowDetails ? "Edit Configuration" : "Configure Escrow"}
          </button>
        </div>

        {state.escrowDetails ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Held</label>
              <p className="text-lg">
                {state.escrowDetails.amountHeld 
                  ? `${state.escrowDetails.amountHeld.value} ${state.escrowDetails.amountHeld.unit}` 
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Funds Document ID</label>
              <p className="text-lg">{state.escrowDetails.proofOfFundsDocumentId || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release Conditions</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{state.escrowDetails.releaseConditions}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escrow Provider</label>
              <p className="text-lg">{state.escrowDetails.escrowProvider || "Not specified"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
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
        <h2 className="text-xl font-semibold">Configure Escrow</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Held *
          </label>
          <input
            type="number"
            value={formData.amountHeld}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, amountHeld: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proof of Funds Document ID
          </label>
          <input
            type="text"
            value={formData.proofOfFundsDocumentId}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, proofOfFundsDocumentId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Document ID or reference"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Release Conditions *
          </label>
          <textarea
            value={formData.releaseConditions}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, releaseConditions: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe the conditions under which the escrowed funds will be released..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Escrow Provider
          </label>
          <input
            type="text"
            value={formData.escrowProvider}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, escrowProvider: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name of escrow service provider"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Configuration
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}