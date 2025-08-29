import { useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import type { 
  PaymentTermsState, 
  PaymentCurrency, 
  PaymentModel,
  PaymentTermsStatus
} from "../../document-models/payment-terms/gen/types.js";

export interface BasicTermsTabProps {
  state: PaymentTermsState;
  dispatch: (action: any) => void;
  actions: any;
}

export function BasicTermsTab({ state, dispatch, actions }: BasicTermsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    proposer: state.proposer || "",
    payer: state.payer || "",
    currency: state.currency || "USD",
    paymentModel: state.paymentModel || "MILESTONE",
    totalAmount: state.totalAmount?.value?.toString() || "",
    status: state.status || "DRAFT",
    useEscrow: !!(state.escrowDetails && state.escrowDetails.releaseConditions)
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(actions.setBasicTerms({
      proposer: formData.proposer,
      payer: formData.payer,
      currency: formData.currency,
      paymentModel: formData.paymentModel,
      totalAmount: formData.totalAmount ? {
        value: parseFloat(formData.totalAmount),
        unit: formData.currency
      } : undefined
    }));

    if (formData.status !== state.status) {
      dispatch(actions.updateStatus({ status: formData.status }));
    }

    // Handle escrow toggle
    if (formData.useEscrow && !state.escrowDetails) {
      dispatch(actions.setEscrowDetails({
        amountHeld: { value: 0, unit: formData.currency },
        releaseConditions: "Upon project completion",
        escrowProvider: "",
        proofOfFundsDocumentId: ""
      }));
    } else if (!formData.useEscrow && state.escrowDetails) {
      dispatch(actions.setEscrowDetails({
        amountHeld: { value: 0, unit: formData.currency },
        releaseConditions: "",
        escrowProvider: "",
        proofOfFundsDocumentId: ""
      }));
    }
    
    toast.success("Basic terms updated successfully");
    setIsEditing(false);
  }, [formData, dispatch, actions, state.status, state.escrowDetails]);

  const handleCancel = useCallback(() => {
    setFormData({
      proposer: state.proposer || "",
      payer: state.payer || "",
      currency: state.currency || "USD",
      paymentModel: state.paymentModel || "MILESTONE",
      totalAmount: state.totalAmount?.value?.toString() || "",
      status: state.status || "DRAFT",
      useEscrow: !!(state.escrowDetails && state.escrowDetails.releaseConditions)
    });
    setIsEditing(false);
  }, [state]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Terms
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposer</label>
            <p className="text-lg">{state.proposer || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payer</label>
            <p className="text-lg">{state.payer || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <p className="text-lg">{state.currency}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Model</label>
            <p className="text-lg">{state.paymentModel.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <p className="text-lg">
              {state.totalAmount 
                ? `${state.totalAmount.value} ${state.totalAmount.unit}` 
                : "Not set"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <p className="text-lg">{state.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Escrow</label>
            <p className="text-lg">
              {state.escrowDetails && state.escrowDetails.releaseConditions ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Basic Terms</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proposer *
          </label>
          <input
            type="text"
            value={formData.proposer}
            onChange={(e) => setFormData({...formData, proposer: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payer *
          </label>
          <input
            type="text"
            value={formData.payer}
            onChange={(e) => setFormData({...formData, payer: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency *
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value as PaymentCurrency})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Model *
          </label>
          <select
            value={formData.paymentModel}
            onChange={(e) => setFormData({...formData, paymentModel: e.target.value as PaymentModel})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="MILESTONE">Milestone</option>
            <option value="COST_AND_MATERIALS">Cost & Materials</option>
            <option value="RETAINER">Retainer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <input
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as PaymentTermsStatus})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useEscrow"
              checked={formData.useEscrow}
              onChange={(e) => setFormData({...formData, useEscrow: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="useEscrow" className="text-sm font-medium text-gray-700">
              Use Escrow
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Terms
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