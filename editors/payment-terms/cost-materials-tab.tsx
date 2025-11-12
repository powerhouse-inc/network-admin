import { useState, useCallback } from "react";
import { TextInput, Select, Button } from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import type {
  PaymentTermsState,
  BillingFrequency,
} from "../../document-models/payment-terms/gen/schema/types.js";
import type { PaymentTermsAction } from "../../document-models/payment-terms/gen/actions.js";
import { type actions as paymentTermsActions } from "../../document-models/payment-terms/index.js";

export interface CostMaterialsTabProps {
  state: PaymentTermsState;
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
}

export function CostMaterialsTab({
  state,
  dispatch,
  actions,
}: CostMaterialsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hourlyRate: state.timeAndMaterials?.hourlyRate?.value?.toString() || "",
    variableCap: state.timeAndMaterials?.variableCap?.value?.toString() || "",
    billingFrequency: state.timeAndMaterials?.billingFrequency || "MONTHLY",
    timesheetRequired: state.timeAndMaterials?.timesheetRequired || false,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      dispatch(
        actions.setTimeAndMaterials({
          hourlyRate: formData.hourlyRate
            ? {
                value: parseFloat(formData.hourlyRate),
                unit: state.currency,
              }
            : undefined,
          variableCap: formData.variableCap
            ? {
                value: parseFloat(formData.variableCap),
                unit: state.currency,
              }
            : undefined,
          billingFrequency: formData.billingFrequency,
          timesheetRequired: formData.timesheetRequired,
        })
      );

      toast("Cost & Materials configuration saved", {
        type: "success",
      });
      setIsEditing(false);
    },
    [formData, dispatch, actions, state.currency]
  );

  const handleCancel = useCallback(() => {
    setFormData({
      hourlyRate: state.timeAndMaterials?.hourlyRate?.value?.toString() || "",
      variableCap: state.timeAndMaterials?.variableCap?.value?.toString() || "",
      billingFrequency: state.timeAndMaterials?.billingFrequency || "MONTHLY",
      timesheetRequired: state.timeAndMaterials?.timesheetRequired || false,
    });
    setIsEditing(false);
  }, [state.timeAndMaterials]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">
            Cost & Materials Configuration
          </h2>
          <Button
            onClick={() => setIsEditing(true)}
            color="light"
            size="sm"
            className="cursor-pointer hover:bg-blue-600 hover:text-white"
          >
            {state.timeAndMaterials
              ? "Edit Configuration"
              : "Configure Cost & Materials"}
          </Button>
        </div>

        {state.timeAndMaterials ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hourly Rate
              </label>
              <p className="text-lg dark:text-white">
                {state.timeAndMaterials.hourlyRate
                  ? `${state.timeAndMaterials.hourlyRate.value} ${state.timeAndMaterials.hourlyRate.unit}`
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Variable Cap
              </label>
              <p className="text-lg dark:text-white">
                {state.timeAndMaterials.variableCap
                  ? `${state.timeAndMaterials.variableCap.value} ${state.timeAndMaterials.variableCap.unit}`
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Billing Frequency
              </label>
              <p className="text-lg dark:text-white">
                {state.timeAndMaterials.billingFrequency}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timesheet Required
              </label>
              <p className="text-lg dark:text-white">
                {state.timeAndMaterials.timesheetRequired ? "Yes" : "No"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No cost & materials configuration set up yet.</p>
            <p className="text-sm">
              Click "Configure Cost & Materials" to get started.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">
          Configure Cost & Materials
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hourly Rate
          </label>
          <TextInput
            value={formData.hourlyRate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, hourlyRate: e.target.value })
            }
            placeholder="0.00"
            type="number"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Variable Cap
          </label>
          <TextInput
            value={formData.variableCap}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, variableCap: e.target.value })
            }
            placeholder="0.00"
            type="number"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Billing Frequency *
          </label>
          <Select
            value={formData.billingFrequency}
            onChange={(value) =>
              setFormData({
                ...formData,
                billingFrequency: value as BillingFrequency,
              })
            }
            options={[
              { value: "WEEKLY", label: "Weekly" },
              { value: "BIWEEKLY", label: "Biweekly" },
              { value: "MONTHLY", label: "Monthly" },
            ]}
            placeholder="Select billing frequency"
            required
          />
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id="timesheetRequired"
            checked={formData.timesheetRequired}
            onChange={(e) =>
              setFormData({ ...formData, timesheetRequired: e.target.checked })
            }
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="timesheetRequired"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Timesheet Required
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          color="light"
          size="sm"
          className="cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Save Configuration
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
