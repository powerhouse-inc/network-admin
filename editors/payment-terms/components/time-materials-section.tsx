import { useState, useCallback } from "react";
import {
  Clock,
  DollarSign,
  Calendar,
  FileSpreadsheet,
  Pencil,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import { TextInput, Select } from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import type {
  PaymentTermsState,
  BillingFrequency,
} from "../../../document-models/payment-terms/gen/types.js";
import type { PaymentTermsAction } from "../../../document-models/payment-terms/gen/actions.js";
import { type actions as paymentTermsActions } from "../../../document-models/payment-terms/index.js";

interface TimeAndMaterialsSectionProps {
  state: PaymentTermsState;
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
}

const BILLING_FREQUENCY_OPTIONS = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "BIWEEKLY", label: "Bi-weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

export function TimeAndMaterialsSection({
  state,
  dispatch,
  actions,
}: TimeAndMaterialsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hourlyRate: state.timeAndMaterials?.hourlyRate?.value?.toString() || "",
    retainerAmount:
      state.timeAndMaterials?.retainerAmount?.value?.toString() || "",
    variableCap: state.timeAndMaterials?.variableCap?.value?.toString() || "",
    billingFrequency: state.timeAndMaterials?.billingFrequency || "MONTHLY",
    timesheetRequired: state.timeAndMaterials?.timesheetRequired ?? true,
  });

  const handleSave = useCallback(() => {
    dispatch(
      actions.setTimeAndMaterials({
        hourlyRate: formData.hourlyRate
          ? { value: parseFloat(formData.hourlyRate), unit: state.currency }
          : undefined,
        retainerAmount: formData.retainerAmount
          ? { value: parseFloat(formData.retainerAmount), unit: state.currency }
          : undefined,
        variableCap: formData.variableCap
          ? { value: parseFloat(formData.variableCap), unit: state.currency }
          : undefined,
        billingFrequency: formData.billingFrequency,
        timesheetRequired: formData.timesheetRequired,
      }),
    );

    toast("Time & Materials configuration saved", { type: "success" });
    setIsEditing(false);
  }, [formData, state.currency, dispatch, actions]);

  const handleCancel = useCallback(() => {
    setFormData({
      hourlyRate: state.timeAndMaterials?.hourlyRate?.value?.toString() || "",
      retainerAmount:
        state.timeAndMaterials?.retainerAmount?.value?.toString() || "",
      variableCap: state.timeAndMaterials?.variableCap?.value?.toString() || "",
      billingFrequency: state.timeAndMaterials?.billingFrequency || "MONTHLY",
      timesheetRequired: state.timeAndMaterials?.timesheetRequired ?? true,
    });
    setIsEditing(false);
  }, [state.timeAndMaterials]);

  const formatCurrency = (value: number | undefined) => {
    if (!value) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: state.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const frequencyLabel =
    BILLING_FREQUENCY_OPTIONS.find(
      (o) => o.value === state.timeAndMaterials?.billingFrequency,
    )?.label || "Monthly";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-stone-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100">
            <Clock size={18} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800">
              Time & Materials
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Rates, billing, and caps
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
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                <DollarSign size={14} className="inline align-middle mr-1.5" />
                Hourly Rate ({state.currency})
              </label>
              <TextInput
                type="number"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                <TrendingUp size={14} className="inline align-middle mr-1.5" />
                Retainer Amount ({state.currency})
              </label>
              <TextInput
                type="number"
                value={formData.retainerAmount}
                onChange={(e) =>
                  setFormData({ ...formData, retainerAmount: e.target.value })
                }
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                Variable Cap ({state.currency})
              </label>
              <TextInput
                type="number"
                value={formData.variableCap}
                onChange={(e) =>
                  setFormData({ ...formData, variableCap: e.target.value })
                }
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                <Calendar size={14} className="inline align-middle mr-1.5" />
                Billing Frequency
              </label>
              <Select
                value={formData.billingFrequency}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    billingFrequency: value as BillingFrequency,
                  })
                }
                options={BILLING_FREQUENCY_OPTIONS}
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="timesheetRequired"
                  className="w-4 h-4 rounded border-gray-300 text-slate-800 focus:ring-slate-500"
                  checked={formData.timesheetRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timesheetRequired: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="timesheetRequired"
                  className="text-[13px] font-medium text-slate-500 cursor-pointer"
                >
                  <FileSpreadsheet
                    size={14}
                    className="inline align-middle mr-1.5"
                  />
                  Timesheet submission required for billing
                </label>
              </div>
            </div>
          </div>
        ) : state.timeAndMaterials ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                <DollarSign size={14} className="inline align-middle mr-1.5" />
                Hourly Rate
              </label>
              <p className="text-[15px] font-mono font-semibold text-slate-800 py-2.5">
                {formatCurrency(state.timeAndMaterials.hourlyRate?.value) || (
                  <span className="text-slate-400 italic font-normal font-sans">
                    Not set
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                <TrendingUp size={14} className="inline align-middle mr-1.5" />
                Retainer Amount
              </label>
              <p className="text-[15px] font-mono font-semibold text-slate-800 py-2.5">
                {formatCurrency(
                  state.timeAndMaterials.retainerAmount?.value,
                ) || (
                  <span className="text-slate-400 italic font-normal font-sans">
                    Not set
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                Variable Cap
              </label>
              <p className="text-[15px] font-mono font-semibold text-slate-800 py-2.5">
                {formatCurrency(state.timeAndMaterials.variableCap?.value) || (
                  <span className="text-slate-400 italic font-normal font-sans">
                    No cap
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                <Calendar size={14} className="inline align-middle mr-1.5" />
                Billing Frequency
              </label>
              <p className="text-[15px] py-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                  {frequencyLabel}
                </span>
              </p>
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-500">
                <FileSpreadsheet
                  size={14}
                  className="inline align-middle mr-1.5"
                />
                Timesheet Required
              </label>
              <p className="text-[15px] py-2.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                    state.timeAndMaterials.timesheetRequired
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-stone-100 text-slate-500"
                  }`}
                >
                  {state.timeAndMaterials.timesheetRequired ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock size={32} className="text-slate-400 mb-3" />
            <p className="text-[15px] font-semibold text-slate-800 mb-1">
              No configuration yet
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Set up hourly rates and billing preferences
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-slate-800 border-none rounded-md cursor-pointer transition-colors hover:bg-slate-700"
              onClick={() => setIsEditing(true)}
            >
              Configure
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
