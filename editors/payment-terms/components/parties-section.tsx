import { useState, useCallback } from "react";
import { Users, UserCircle, Building2, Pencil, Check, X } from "lucide-react";
import { TextInput } from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import type { PaymentTermsState } from "../../../document-models/payment-terms/gen/types.js";
import type { PaymentTermsAction } from "../../../document-models/payment-terms/gen/actions.js";
import { type actions as paymentTermsActions } from "../../../document-models/payment-terms/index.js";

interface PartiesSectionProps {
  state: PaymentTermsState;
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
}

export function PartiesSection({
  state,
  dispatch,
  actions,
}: PartiesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    proposer: state.proposer || "",
    payer: state.payer || "",
  });

  const handleSave = useCallback(() => {
    if (!formData.proposer.trim() || !formData.payer.trim()) {
      toast("Both proposer and payer are required", { type: "error" });
      return;
    }

    dispatch(
      actions.setBasicTerms({
        proposer: formData.proposer,
        payer: formData.payer,
        currency: state.currency,
        paymentModel: state.paymentModel,
        totalAmount: state.totalAmount || undefined,
      }),
    );

    toast("Parties updated successfully", { type: "success" });
    setIsEditing(false);
  }, [formData, state, dispatch, actions]);

  const handleCancel = useCallback(() => {
    setFormData({
      proposer: state.proposer || "",
      payer: state.payer || "",
    });
    setIsEditing(false);
  }, [state]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-stone-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-slate-500">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800">
              Parties
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Contract participants
            </p>
          </div>
        </div>
        {!isEditing ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-500 bg-transparent border-none rounded-md cursor-pointer transition-colors hover:bg-stone-100 hover:text-slate-800"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={14} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-white bg-emerald-600 border-none rounded-md cursor-pointer transition-colors hover:bg-emerald-700"
              onClick={handleSave}
            >
              <Check size={14} />
              Save
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-500 bg-transparent border-none rounded-md cursor-pointer transition-colors hover:bg-stone-100 hover:text-slate-800"
              onClick={handleCancel}
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Proposer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-500">
              <UserCircle size={14} className="inline align-middle mr-1.5" />
              Proposer
            </label>
            {isEditing ? (
              <TextInput
                value={formData.proposer}
                onChange={(e) =>
                  setFormData({ ...formData, proposer: e.target.value })
                }
                placeholder="Enter proposer name or entity"
              />
            ) : (
              <p
                className={`text-[15px] py-2.5 ${!state.proposer ? "text-slate-400 italic" : "text-slate-800"}`}
              >
                {state.proposer || "Not specified"}
              </p>
            )}
          </div>

          {/* Payer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-500">
              <Building2 size={14} className="inline align-middle mr-1.5" />
              Payer
            </label>
            {isEditing ? (
              <TextInput
                value={formData.payer}
                onChange={(e) =>
                  setFormData({ ...formData, payer: e.target.value })
                }
                placeholder="Enter payer name or entity"
              />
            ) : (
              <p
                className={`text-[15px] py-2.5 ${!state.payer ? "text-slate-400 italic" : "text-slate-800"}`}
              >
                {state.payer || "Not specified"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
