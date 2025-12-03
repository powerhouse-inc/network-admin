import { useState, useCallback } from "react";
import {
  Shield,
  Lock,
  FileCheck,
  Building,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TextInput, Textarea } from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import type { PaymentTermsState } from "../../../document-models/payment-terms/gen/types.js";
import type { PaymentTermsAction } from "../../../document-models/payment-terms/gen/actions.js";
import { type actions as paymentTermsActions } from "../../../document-models/payment-terms/index.js";

interface EscrowSectionProps {
  state: PaymentTermsState;
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function EscrowSection({
  state,
  dispatch,
  actions,
  isExpanded,
  onToggleExpand,
}: EscrowSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    amountHeld: state.escrowDetails?.amountHeld?.value?.toString() || "",
    proofOfFundsDocumentId: state.escrowDetails?.proofOfFundsDocumentId || "",
    releaseConditions: state.escrowDetails?.releaseConditions || "",
    escrowProvider: state.escrowDetails?.escrowProvider || "",
  });

  const hasEscrow = !!(
    state.escrowDetails && state.escrowDetails.releaseConditions
  );

  const handleSave = useCallback(() => {
    if (!formData.amountHeld || isNaN(parseFloat(formData.amountHeld))) {
      toast("Please enter a valid escrow amount", { type: "error" });
      return;
    }

    if (!formData.releaseConditions.trim()) {
      toast("Release conditions are required", { type: "error" });
      return;
    }

    dispatch(
      actions.setEscrowDetails({
        amountHeld: {
          value: parseFloat(formData.amountHeld),
          unit: state.currency,
        },
        proofOfFundsDocumentId: formData.proofOfFundsDocumentId || undefined,
        releaseConditions: formData.releaseConditions,
        escrowProvider: formData.escrowProvider || undefined,
      }),
    );

    toast("Escrow configuration saved", { type: "success" });
    setIsEditing(false);
  }, [formData, state.currency, dispatch, actions]);

  const handleCancel = useCallback(() => {
    setFormData({
      amountHeld: state.escrowDetails?.amountHeld?.value?.toString() || "",
      proofOfFundsDocumentId: state.escrowDetails?.proofOfFundsDocumentId || "",
      releaseConditions: state.escrowDetails?.releaseConditions || "",
      escrowProvider: state.escrowDetails?.escrowProvider || "",
    });
    setIsEditing(false);
  }, [state.escrowDetails]);

  const handleRemoveEscrow = useCallback(() => {
    dispatch(
      actions.setEscrowDetails({
        amountHeld: { value: 0, unit: state.currency },
        releaseConditions: "",
        escrowProvider: "",
        proofOfFundsDocumentId: "",
      }),
    );
    toast("Escrow removed", { type: "success" });
  }, [dispatch, actions, state.currency]);

  const formatCurrency = (value: number | undefined) => {
    if (!value) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: state.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md self-start">
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-stone-50 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-lg ${hasEscrow ? "bg-emerald-100" : "bg-white"}`}
          >
            <Shield
              size={18}
              className={hasEscrow ? "text-emerald-600" : "text-slate-500"}
            />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800">
              Escrow Protection
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              {hasEscrow ? (
                <span className="text-emerald-600">
                  {formatCurrency(state.escrowDetails?.amountHeld?.value)} held
                </span>
              ) : (
                "Optional security deposit"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasEscrow && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-600">
              <Lock size={12} />
              Active
            </span>
          )}
          {isExpanded ? (
            <ChevronUp size={20} className="text-slate-400" />
          ) : (
            <ChevronDown size={20} className="text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500 after:content-['_*'] after:text-rose-500">
                  Amount Held ({state.currency})
                </label>
                <TextInput
                  type="number"
                  value={formData.amountHeld}
                  onChange={(e) =>
                    setFormData({ ...formData, amountHeld: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500">
                  <Building size={14} className="inline align-middle mr-1.5" />
                  Escrow Provider
                </label>
                <TextInput
                  value={formData.escrowProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, escrowProvider: e.target.value })
                  }
                  placeholder="e.g., Escrow.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500">
                  <FileCheck size={14} className="inline align-middle mr-1.5" />
                  Proof of Funds Document ID
                </label>
                <TextInput
                  value={formData.proofOfFundsDocumentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proofOfFundsDocumentId: e.target.value,
                    })
                  }
                  placeholder="Document reference"
                  className="font-mono"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500 after:content-['_*'] after:text-rose-500">
                  Release Conditions
                </label>
                <Textarea
                  value={formData.releaseConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      releaseConditions: e.target.value,
                    })
                  }
                  placeholder="Describe the conditions under which escrow funds will be released..."
                  rows={3}
                />
              </div>

              <div className="col-span-2 flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-white bg-slate-800 border-none rounded-md cursor-pointer transition-colors hover:bg-slate-700"
                    onClick={handleSave}
                  >
                    <Check size={14} />
                    Save
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-500 bg-stone-100 border border-gray-200 rounded-md cursor-pointer transition-colors hover:bg-stone-200"
                    onClick={handleCancel}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
                {hasEscrow && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-rose-600 bg-transparent border-none rounded-md cursor-pointer transition-colors hover:bg-rose-50"
                    onClick={handleRemoveEscrow}
                  >
                    Remove Escrow
                  </button>
                )}
              </div>
            </div>
          ) : hasEscrow ? (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">
                    Amount Held
                  </label>
                  <p className="text-[15px] font-mono font-semibold text-emerald-600 py-2.5">
                    {formatCurrency(state.escrowDetails?.amountHeld?.value)}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">
                    <Building
                      size={14}
                      className="inline align-middle mr-1.5"
                    />
                    Provider
                  </label>
                  <p
                    className={`text-[15px] py-2.5 ${!state.escrowDetails?.escrowProvider ? "text-slate-400 italic" : "text-slate-800"}`}
                  >
                    {state.escrowDetails?.escrowProvider || "Not specified"}
                  </p>
                </div>

                {state.escrowDetails?.proofOfFundsDocumentId && (
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-500">
                      <FileCheck
                        size={14}
                        className="inline align-middle mr-1.5"
                      />
                      Proof of Funds
                    </label>
                    <p className="text-[13px] font-mono py-2.5 text-slate-800">
                      {state.escrowDetails.proofOfFundsDocumentId}
                    </p>
                  </div>
                )}

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">
                    Release Conditions
                  </label>
                  <div className="p-3 bg-stone-50 rounded-md text-sm leading-relaxed text-slate-800">
                    {state.escrowDetails?.releaseConditions}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-500 bg-transparent border-none rounded-md cursor-pointer transition-colors hover:bg-stone-100 hover:text-slate-800"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={14} />
                  Edit Escrow
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-gray-200 rounded-lg bg-stone-50">
              <Shield size={32} className="text-slate-400 mb-3" />
              <p className="text-[15px] font-semibold text-slate-800 mb-1">
                No escrow configured
              </p>
              <p className="text-sm text-slate-400 mb-4">
                Add escrow protection for secure payments
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-slate-800 border-none rounded-md cursor-pointer transition-colors hover:bg-slate-700"
                onClick={() => setIsEditing(true)}
              >
                Set Up Escrow
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
