import { useState, useCallback, useMemo } from "react";
import {
  ObjectSetTable,
  TextInput,
  DatePicker,
} from "@powerhousedao/document-engineering";
import {
  type ColumnDef,
  type ColumnAlignment,
  Button,
} from "@powerhousedao/document-engineering";

import { Icon } from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import { generateId } from "document-model/core";
import type {
  Milestone,
  MilestonePayoutStatus,
  PaymentTermsAction,
} from "../../document-models/payment-terms/gen/types.js";
import { type actions as paymentTermsActions } from "../../document-models/payment-terms/index.js";

export interface MilestonesTabProps {
  milestones: Milestone[];
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
  currency: string;
}

export function MilestonesTab({
  milestones,
  dispatch,
  actions,
  currency = "USD",
}: MilestonesTabProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    amount: "",
    expectedCompletionDate: "",
    requiresApproval: true,
  });

  const columns = useMemo<Array<ColumnDef<Milestone>>>(
    () => [
      {
        field: "name",
        title: "Name",
        editable: true,
        align: "left" as ColumnAlignment,
        onSave: (newValue, context) => {
          if (newValue !== context.row.name) {
            dispatch(
              actions.updateMilestone({
                id: context.row.id,
                name: newValue as string,
              })
            );
            toast("Milestone name updated", {
              type: "success",
            });
            return true;
          }
          return false;
        },
      },
      {
        field: "amount",
        title: `Amount (${currency})`,
        editable: true,
        align: "right" as ColumnAlignment,
        renderCell: (value: Milestone["amount"]) => {
          return value ? `${value.value} ${value.unit}` : "";
        },
        onSave: (newValue, context) => {
          const amount = parseFloat(newValue as string);
          if (isNaN(amount)) {
            toast("Please enter a valid amount", {
              type: "error",
            });
            return false;
          }
          dispatch(
            actions.updateMilestone({
              id: context.row.id,
              amount: { value: amount, unit: currency },
            })
          );
          toast("Milestone amount updated", {
            type: "success",
          });
          return true;
        },
      },
      {
        field: "expectedCompletionDate",
        title: "Expected Completion",
        editable: true,
        align: "center" as ColumnAlignment,
        renderCell: (value: string | null) => {
          return value ? new Date(value).toLocaleDateString() : "Not set";
        },
        onSave: (newValue, context) => {
          const dateValue = newValue as string;
          dispatch(
            actions.updateMilestone({
              id: context.row.id,
              expectedCompletionDate: dateValue || undefined,
            })
          );
          toast("Expected completion date updated", {
            type: "success",
          });
          return true;
        },
      },
      {
        field: "requiresApproval",
        title: "Requires Approval",
        editable: true,
        align: "center" as ColumnAlignment,
        renderCell: (value: boolean) => (value ? "Yes" : "No"),
        onSave: (newValue, context) => {
          const approved = newValue === "true" || newValue === true;
          dispatch(
            actions.updateMilestone({
              id: context.row.id,
              requiresApproval: approved,
            })
          );
          toast("Approval requirement updated", {
            type: "success",
          });
          return true;
        },
      },
      {
        field: "payoutStatus",
        title: "Status",
        editable: true,
        align: "center" as ColumnAlignment,
        renderCell: (value: MilestonePayoutStatus) => {
          const statusMap: Record<MilestonePayoutStatus, string> = {
            PENDING: "Pending",
            READY_FOR_REVIEW: "Ready for Review",
            APPROVED: "Approved",
            PAID: "Paid",
            REJECTED: "Rejected",
          };
          return statusMap[value] || value;
        },
        onSave: (newValue, context) => {
          dispatch(
            actions.updateMilestoneStatus({
              id: context.row.id,
              payoutStatus: newValue as MilestonePayoutStatus,
            })
          );
          toast("Milestone status updated", {
            type: "success",
          });
          return true;
        },
      },
      {
        field: "actions",
        title: "Actions",
        editable: false,
        align: "center" as ColumnAlignment,
        renderCell: (_, context) => (
          <Button
            onClick={() => {
              dispatch(actions.deleteMilestone({ id: context.row.id }));
              toast("Milestone deleted", {
                type: "success",
              });
            }}
            size="sm"
            className="text-red-600 hover:text-red-800"
          >
            <Icon name="Trash" size={16} />
          </Button>
        ),
      },
    ],
    [actions, currency, dispatch]
  );

  const handleAddMilestone = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!newMilestone.name.trim()) {
        toast("Name is required", {
          type: "error",
        });
        return;
      }
      if (!newMilestone.amount || isNaN(parseFloat(newMilestone.amount))) {
        toast("Valid amount is required", {
          type: "error",
        });
        return;
      }

      const milestoneData: Milestone = {
        id: generateId(),
        name: newMilestone.name,
        amount: {
          value: parseFloat(newMilestone.amount),
          unit: currency,
        },
        requiresApproval: newMilestone.requiresApproval,
        expectedCompletionDate: null,
        payoutStatus: "PENDING",
      };

      if (newMilestone.expectedCompletionDate) {
        milestoneData.expectedCompletionDate = new Date(
          newMilestone.expectedCompletionDate
        ).toISOString();
      }

      dispatch(actions.addMilestone(milestoneData));
      toast("Milestone added successfully", {
        type: "success",
      });

      // Reset form and close edit section
      setNewMilestone({
        name: "",
        amount: "",
        expectedCompletionDate: "",
        requiresApproval: true,
      });
      setIsAddingNew(false);
    },
    [newMilestone, dispatch, actions, currency]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Milestones</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {milestones.length} milestone(s) defined
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(!isAddingNew)}
          color="light"
          size="sm"
          className="cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Add Milestone
        </Button>
      </div>

      {isAddingNew && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
          <h3 className="text-lg font-medium mb-4 dark:text-white">
            Add New Milestone
          </h3>
          <form onSubmit={handleAddMilestone} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Name *"
                value={newMilestone.name}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, name: e.target.value })
                }
                className="w-full"
                required
              />

              <TextInput
                label={`Amount (${currency}) *`}
                type="number"
                value={newMilestone.amount}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, amount: e.target.value })
                }
                className="w-full"
                placeholder="0.00"
                step="0.01"
                required
              />

              <DatePicker
                className="bg-white"
                value={
                  newMilestone.expectedCompletionDate
                    ? new Date(newMilestone.expectedCompletionDate)
                    : undefined
                }
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  setNewMilestone({
                    ...newMilestone,
                    expectedCompletionDate: date?.toISOString() || "",
                  });
                }}
                name="expected-completion-date"
                placeholder="Select expected completion date"
              />

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  checked={newMilestone.requiresApproval}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      requiresApproval: e.target.checked,
                    })
                  }
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="requiresApproval"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Requires Approval
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
                Add Milestone
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewMilestone({
                    name: "",
                    amount: "",
                    expectedCompletionDate: "",
                    requiresApproval: true,
                  });
                }}
                color="light"
                size="sm"
                className="cursor-pointer hover:bg-gray-600 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {milestones.length > 0 ? (
        <ObjectSetTable
          data={milestones}
          columns={columns}
          onAdd={() => setIsAddingNew(true)}
          onDelete={(row: Milestone[]) => {
            dispatch(
              actions.deleteMilestone({ id: (row as unknown as Milestone).id })
            );
            toast("Milestone deleted", {
              type: "success",
            });
          }}
        />
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Icon
            name="Calendar"
            size={48}
            className="mx-auto mb-4 text-gray-400"
          />
          <p className="text-lg font-medium">No milestones defined yet</p>
          <p className="text-sm">Add your first milestone to get started</p>
        </div>
      )}
    </div>
  );
}
