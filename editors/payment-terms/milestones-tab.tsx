import { useState, useCallback, useMemo } from "react";
import { ObjectSetTable, TextInput } from "@powerhousedao/document-engineering";
import type { ColumnDef, ColumnAlignment } from "@powerhousedao/document-engineering";
import { Button, Icon } from "@powerhousedao/design-system";
import { toast } from "react-toastify";
import { generateId } from "document-model";
import type { 
  Milestone,
  MilestonePayoutStatus
} from "../../document-models/payment-terms/gen/types.js";

export interface MilestonesTabProps {
  milestones: Milestone[];
  dispatch: (action: any) => void;
  actions: any;
  currency: string;
}

export function MilestonesTab({ milestones, dispatch, actions, currency = "USD" }: MilestonesTabProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    amount: "",
    expectedCompletionDate: "",
    requiresApproval: true
  });

  const columns = useMemo<Array<ColumnDef<Milestone>>>(
    () => [
      {
        field: "name",
        title: "Name",
        editable: true,
        align: "left" as ColumnAlignment,
        onSave: (newValue, context) => {
          dispatch(actions.updateMilestone({ 
            id: context.row.id, 
            name: newValue as string 
          }));
          toast.success("Milestone name updated");
          return true;
        },
      },
      {
        field: "amount",
        title: `Amount (${currency})`,
        editable: true,
        align: "right" as ColumnAlignment,
        renderCell: (value: any) => {
          return value ? `${value.value} ${value.unit}` : "";
        },
        onSave: (newValue, context) => {
          const amount = parseFloat(newValue as string);
          if (isNaN(amount)) {
            toast.error("Please enter a valid amount");
            return false;
          }
          dispatch(actions.updateMilestone({ 
            id: context.row.id, 
            amount: { value: amount, unit: currency }
          }));
          toast.success("Milestone amount updated");
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
          dispatch(actions.updateMilestone({ 
            id: context.row.id, 
            expectedCompletionDate: dateValue || undefined
          }));
          toast.success("Expected completion date updated");
          return true;
        },
      },
      {
        field: "requiresApproval",
        title: "Requires Approval",
        editable: true,
        align: "center" as ColumnAlignment,
        renderCell: (value: boolean) => value ? "Yes" : "No",
        onSave: (newValue, context) => {
          const approved = newValue === "true" || newValue === true;
          dispatch(actions.updateMilestone({ 
            id: context.row.id, 
            requiresApproval: approved 
          }));
          toast.success("Approval requirement updated");
          return true;
        },
      },
      {
        field: "payoutStatus",
        title: "Status",
        editable: true,
        align: "center" as ColumnAlignment,
        renderCell: (value: string) => {
          const statusColors = {
            PENDING: "bg-yellow-100 text-yellow-800",
            READY_FOR_REVIEW: "bg-blue-100 text-blue-800",
            APPROVED: "bg-green-100 text-green-800",
            PAID: "bg-green-200 text-green-900",
            REJECTED: "bg-red-100 text-red-800"
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
              {value.replace(/_/g, ' ')}
            </span>
          );
        },
        onSave: (newValue, context) => {
          dispatch(actions.updateMilestoneStatus({ 
            id: context.row.id, 
            payoutStatus: newValue as MilestonePayoutStatus 
          }));
          toast.success("Milestone status updated");
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
              toast.success("Milestone deleted");
            }}
            size="small"
            className="text-red-600 hover:text-red-800"
          >
            <Icon name="Trash" size={16} />
          </Button>
        ),
      }
    ],
    [actions, currency, dispatch]
  );

  const handleAddMilestone = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMilestone.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!newMilestone.amount || isNaN(parseFloat(newMilestone.amount))) {
      toast.error('Valid amount is required');
      return;
    }
    
    const milestoneData: any = {
      id: generateId(),
      name: newMilestone.name,
      amount: {
        value: parseFloat(newMilestone.amount),
        unit: currency
      },
      requiresApproval: newMilestone.requiresApproval
    };

    if (newMilestone.expectedCompletionDate) {
      milestoneData.expectedCompletionDate = newMilestone.expectedCompletionDate;
    }

    dispatch(actions.addMilestone(milestoneData));
    toast.success("Milestone added successfully");

    setNewMilestone({
      name: "",
      amount: "",
      expectedCompletionDate: "",
      requiresApproval: true
    });
    setIsAddingNew(false);
  }, [newMilestone, dispatch, actions, currency]);

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
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Add Milestone
        </Button>
      </div>

      {isAddingNew && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Add New Milestone</h3>
          <form onSubmit={handleAddMilestone} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Name *"
                value={newMilestone.name}
                onChange={(e) => setNewMilestone({...newMilestone, name: e.target.value})}
                className="w-full"
                required
              />

              <TextInput
                label={`Amount (${currency}) *`}
                type="number"
                value={newMilestone.amount}
                onChange={(e) => setNewMilestone({...newMilestone, amount: e.target.value})}
                className="w-full"
                placeholder="0.00"
                step="0.01"
                required
              />

              <TextInput
                label="Expected Completion Date"
                type="date"
                value={newMilestone.expectedCompletionDate}
                onChange={(e) => setNewMilestone({...newMilestone, expectedCompletionDate: e.target.value})}
                className="w-full"
              />

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  checked={newMilestone.requiresApproval}
                  onChange={(e) => setNewMilestone({...newMilestone, requiresApproval: e.target.checked})}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requiresApproval" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requires Approval
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit">
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
                    requiresApproval: true
                  });
                }}
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
          onDelete={(row) => {
            dispatch(actions.deleteMilestone({ id: (row as any).id }));
            toast.success("Milestone deleted");
          }}
        />
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No milestones defined yet</p>
          <p className="text-sm">Add your first milestone to get started</p>
        </div>
      )}
    </div>
  );
}