import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

import type { PaymentTermsState, BillingFrequency } from "../../document-models/payment-terms/gen/schema/types.js";

export interface TimeMaterialsTabProps {
  state: PaymentTermsState;
  dispatch: (action: any) => void;
  actions: any;
}

export function TimeMaterialsTab({ state, dispatch, actions }: TimeMaterialsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    retainerAmount: state.timeAndMaterials?.retainerAmount?.value?.toString() || "",
    hourlyRate: state.timeAndMaterials?.hourlyRate?.value?.toString() || "",
    variableCap: state.timeAndMaterials?.variableCap?.value?.toString() || "",
    billingFrequency: state.timeAndMaterials?.billingFrequency || "MONTHLY",
    timesheetRequired: state.timeAndMaterials?.timesheetRequired || false
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(actions.setTimeAndMaterials({
      retainerAmount: formData.retainerAmount ? {
        value: parseFloat(formData.retainerAmount),
        unit: state.currency
      } : undefined,
      hourlyRate: formData.hourlyRate ? {
        value: parseFloat(formData.hourlyRate),
        unit: state.currency
      } : undefined,
      variableCap: formData.variableCap ? {
        value: parseFloat(formData.variableCap),
        unit: state.currency
      } : undefined,
      billingFrequency: formData.billingFrequency,
      timesheetRequired: formData.timesheetRequired
    }));
    
    setIsEditing(false);
  }, [formData, dispatch, actions, state.currency]);

  const handleCancel = useCallback(() => {
    setFormData({
      retainerAmount: state.timeAndMaterials?.retainerAmount?.value?.toString() || "",
      hourlyRate: state.timeAndMaterials?.hourlyRate?.value?.toString() || "",
      variableCap: state.timeAndMaterials?.variableCap?.value?.toString() || "",
      billingFrequency: state.timeAndMaterials?.billingFrequency || "MONTHLY",
      timesheetRequired: state.timeAndMaterials?.timesheetRequired || false
    });
    setIsEditing(false);
  }, [state.timeAndMaterials]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Time & Materials Configuration</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {state.timeAndMaterials ? "Edit Configuration" : "Configure Time & Materials"}
          </button>
        </div>

        {state.timeAndMaterials ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retainer Amount</label>
              <p className="text-lg">
                {state.timeAndMaterials.retainerAmount 
                  ? `${state.timeAndMaterials.retainerAmount.value} ${state.timeAndMaterials.retainerAmount.unit}` 
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
              <p className="text-lg">
                {state.timeAndMaterials.hourlyRate 
                  ? `${state.timeAndMaterials.hourlyRate.value} ${state.timeAndMaterials.hourlyRate.unit}` 
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variable Cap</label>
              <p className="text-lg">
                {state.timeAndMaterials.variableCap 
                  ? `${state.timeAndMaterials.variableCap.value} ${state.timeAndMaterials.variableCap.unit}` 
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Frequency</label>
              <p className="text-lg">{state.timeAndMaterials.billingFrequency}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timesheet Required</label>
              <p className="text-lg">{state.timeAndMaterials.timesheetRequired ? "Yes" : "No"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No time & materials configuration set up yet.</p>
            <p className="text-sm">Click "Configure Time & Materials" to get started.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Configure Time & Materials</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Retainer Amount
          </label>
          <input
            type="number"
            value={formData.retainerAmount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, retainerAmount: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hourly Rate
          </label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, hourlyRate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variable Cap
          </label>
          <input
            type="number"
            value={formData.variableCap}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, variableCap: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Frequency *
          </label>
          <select
            value={formData.billingFrequency}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({...formData, billingFrequency: e.target.value as BillingFrequency})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="BIWEEKLY">Biweekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="timesheetRequired"
              checked={formData.timesheetRequired}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, timesheetRequired: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="timesheetRequired" className="text-sm font-medium text-gray-700">
              Timesheet Required
            </label>
          </div>
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