import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import type { 
  PaymentTermsState, 
  BillingFrequency 
} from "../../document-models/payment-terms/gen/schema/types.js";

export interface CostMaterialsTabProps {
  state: PaymentTermsState;
  dispatch: (action: any) => void;
  actions: any;
}

export function CostMaterialsTab({ state, dispatch, actions }: CostMaterialsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hourlyRate: state.costAndMaterials?.hourlyRate?.value?.toString() || "",
    variableCap: state.costAndMaterials?.variableCap?.value?.toString() || "",
    billingFrequency: state.costAndMaterials?.billingFrequency || "MONTHLY",
    timesheetRequired: state.costAndMaterials?.timesheetRequired || false
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(actions.setCostAndMaterials({
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
    
    toast.success("Cost & Materials configuration saved");
    setIsEditing(false);
  }, [formData, dispatch, actions, state.currency]);

  const handleCancel = useCallback(() => {
    setFormData({
      hourlyRate: state.costAndMaterials?.hourlyRate?.value?.toString() || "",
      variableCap: state.costAndMaterials?.variableCap?.value?.toString() || "",
      billingFrequency: state.costAndMaterials?.billingFrequency || "MONTHLY",
      timesheetRequired: state.costAndMaterials?.timesheetRequired || false
    });
    setIsEditing(false);
  }, [state.costAndMaterials]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Cost & Materials Configuration</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {state.costAndMaterials ? "Edit Configuration" : "Configure Cost & Materials"}
          </button>
        </div>

        {state.costAndMaterials ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate</label>
              <p className="text-lg dark:text-white">
                {state.costAndMaterials.hourlyRate 
                  ? `${state.costAndMaterials.hourlyRate.value} ${state.costAndMaterials.hourlyRate.unit}` 
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variable Cap</label>
              <p className="text-lg dark:text-white">
                {state.costAndMaterials.variableCap 
                  ? `${state.costAndMaterials.variableCap.value} ${state.costAndMaterials.variableCap.unit}` 
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Billing Frequency</label>
              <p className="text-lg dark:text-white">{state.costAndMaterials.billingFrequency}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timesheet Required</label>
              <p className="text-lg dark:text-white">{state.costAndMaterials.timesheetRequired ? "Yes" : "No"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No cost & materials configuration set up yet.</p>
            <p className="text-sm">Click "Configure Cost & Materials" to get started.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Configure Cost & Materials</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hourly Rate
          </label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Variable Cap
          </label>
          <input
            type="number"
            value={formData.variableCap}
            onChange={(e) => setFormData({...formData, variableCap: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Billing Frequency *
          </label>
          <select
            value={formData.billingFrequency}
            onChange={(e) => setFormData({...formData, billingFrequency: e.target.value as BillingFrequency})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="WEEKLY">Weekly</option>
            <option value="BIWEEKLY">Biweekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id="timesheetRequired"
            checked={formData.timesheetRequired}
            onChange={(e) => setFormData({...formData, timesheetRequired: e.target.checked})}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="timesheetRequired" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Timesheet Required
          </label>
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
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}