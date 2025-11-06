import { useState, useCallback, useMemo } from "react";
import { toast } from "@powerhousedao/design-system";
import { Select, TextInput, Button } from "@powerhousedao/document-engineering";
import type {
  PaymentTermsState,
  PaymentCurrency,
  PaymentModel,
  PaymentTermsStatus,
} from "../../document-models/payment-terms/gen/types.js";
import type { PaymentTermsAction } from "../../document-models/payment-terms/gen/actions.js";
import { type actions as paymentTermsActions } from "../../document-models/payment-terms/index.js";

export interface BasicTermsTabProps {
  state: PaymentTermsState;
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
}

export function BasicTermsTab({
  state,
  dispatch,
  actions,
}: BasicTermsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    proposer: state.proposer || "",
    payer: state.payer || "",
    currency: state.currency || "USD",
    paymentModel: state.paymentModel || "MILESTONE",
    totalAmount: state.totalAmount?.value?.toString() || "",
    status: state.status || "DRAFT",
    useEscrow: !!(state.escrowDetails && state.escrowDetails.releaseConditions),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      dispatch(
        actions.setBasicTerms({
          proposer: formData.proposer,
          payer: formData.payer,
          currency: formData.currency,
          paymentModel: formData.paymentModel,
          totalAmount: formData.totalAmount
            ? {
                value: parseFloat(formData.totalAmount),
                unit: formData.currency,
              }
            : undefined,
        })
      );

      if (formData.status !== state.status) {
        dispatch(actions.updateStatus({ status: formData.status }));
      }

      // Handle escrow toggle
      if (formData.useEscrow && !state.escrowDetails) {
        dispatch(
          actions.setEscrowDetails({
            amountHeld: { value: 0, unit: formData.currency },
            releaseConditions: "Upon project completion",
            escrowProvider: "",
            proofOfFundsDocumentId: "",
          })
        );
      } else if (!formData.useEscrow && state.escrowDetails) {
        dispatch(
          actions.setEscrowDetails({
            amountHeld: { value: 0, unit: formData.currency },
            releaseConditions: "",
            escrowProvider: "",
            proofOfFundsDocumentId: "",
          })
        );
      }

      toast("Basic terms updated successfully", {
        type: "success",
      });
      setIsEditing(false);
    },
    [formData, dispatch, actions, state.status, state.escrowDetails]
  );

  const handleCancel = useCallback(() => {
    setFormData({
      proposer: state.proposer || "",
      payer: state.payer || "",
      currency: state.currency || "USD",
      paymentModel: state.paymentModel || "MILESTONE",
      totalAmount: state.totalAmount?.value?.toString() || "",
      status: state.status || "DRAFT",
      useEscrow: !!(
        state.escrowDetails && state.escrowDetails.releaseConditions
      ),
    });
    setIsEditing(false);
  }, [state]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <Button
            onClick={() => setIsEditing(true)}
            color="light"
            size="sm"
            className="cursor-pointer hover:bg-blue-600 hover:text-white"
          >
            Edit Terms
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposer
            </label>
            <p className="text-lg">{state.proposer || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payer
            </label>
            <p className="text-lg">{state.payer || "Not set"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <p className="text-lg">{state.currency}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Model
            </label>
            <p className="text-lg">{state.paymentModel.replace(/_/g, " ")}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <p className="text-lg">
              {state.totalAmount
                ? `${state.totalAmount.value} ${state.totalAmount.unit}`
                : "Not set"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <p className="text-lg">{state.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escrow
            </label>
            <p className="text-lg">
              {state.escrowDetails && state.escrowDetails.releaseConditions
                ? "Enabled"
                : "Disabled"}
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
          <TextInput
            value={formData.proposer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, proposer: e.target.value })
            }
            placeholder="Enter proposer name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payer *
          </label>
          <TextInput
            value={formData.payer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, payer: e.target.value })
            }
            placeholder="Enter payer name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency *
          </label>
          <Select
            value={formData.currency}
            onChange={(value) =>
              setFormData({ ...formData, currency: value as PaymentCurrency })
            }
            options={[
              { value: "USD", label: "USD" },
              { value: "EUR", label: "EUR" },
              { value: "GBP", label: "GBP" },
            ]}
            placeholder="Select currency"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Model *
          </label>
          <Select
            value={formData.paymentModel}
            onChange={(value) =>
              setFormData({ ...formData, paymentModel: value as PaymentModel })
            }
            options={[
              { value: "MILESTONE", label: "Milestone" },
              { value: "COST_AND_MATERIALS", label: "Cost & Materials" },
              { value: "RETAINER", label: "Retainer" },
            ]}
            placeholder="Select payment model"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <TextInput
            value={formData.totalAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, totalAmount: e.target.value })
            }
            placeholder="0.00"
            type="number"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <Select
            value={formData.status}
            onChange={(value) =>
              setFormData({ ...formData, status: value as PaymentTermsStatus })
            }
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "SUBMITTED", label: "Submitted" },
              { value: "ACCEPTED", label: "Accepted" },
              { value: "CANCELLED", label: "Cancelled" },
            ]}
            placeholder="Select status"
            required
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useEscrow"
              checked={formData.useEscrow}
              onChange={(e) =>
                setFormData({ ...formData, useEscrow: e.target.checked })
              }
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="useEscrow"
              className="text-sm font-medium text-gray-700"
            >
              Use Escrow
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          color="light"
          size="sm"
          className="cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Save Terms
        </Button>
        <Button
          type="button"
          onClick={handleCancel}
          color="light"
          size="sm"
          className="cursor-pointer hover:bg-gray-600 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
