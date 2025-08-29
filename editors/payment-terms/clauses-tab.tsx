import { useState, useCallback, useMemo } from "react";
import { ObjectSetTable, TextInput, Textarea } from "@powerhousedao/document-engineering";
import type { ColumnDef, ColumnAlignment } from "@powerhousedao/document-engineering";
import { Button, Icon } from "@powerhousedao/design-system";
import { toast } from "react-toastify";
import { generateId } from "document-model";
import type { 
  BonusClause,
  PenaltyClause
} from "../../document-models/payment-terms/gen/types.js";

export interface ClausesTabProps {
  bonusClauses: BonusClause[];
  penaltyClauses: PenaltyClause[];
  dispatch: (action: any) => void;
  actions: any;
  currency: string;
}

export function ClausesTab({ bonusClauses, penaltyClauses, dispatch, actions, currency = "USD" }: ClausesTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"bonus" | "penalty">("bonus");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newClause, setNewClause] = useState({
    condition: "",
    amount: "",
    comment: ""
  });

  const bonusColumns = useMemo<Array<ColumnDef<BonusClause>>>(
    () => [
      {
        field: "condition",
        title: "Condition",
        editable: true,
        align: "left" as ColumnAlignment,
        onSave: (newValue, context) => {
          dispatch(actions.updateBonusClause({ 
            id: context.row.id, 
            condition: newValue as string 
          }));
          toast.success("Bonus clause condition updated");
          return true;
        },
      },
      {
        field: "bonusAmount",
        title: `Bonus Amount (${currency})`,
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
          dispatch(actions.updateBonusClause({ 
            id: context.row.id, 
            bonusAmount: { value: amount, unit: currency }
          }));
          toast.success("Bonus amount updated");
          return true;
        },
      },
      {
        field: "comment",
        title: "Comment",
        editable: true,
        align: "left" as ColumnAlignment,
        renderCell: (value: string | null) => value || "-",
        onSave: (newValue, context) => {
          dispatch(actions.updateBonusClause({ 
            id: context.row.id, 
            comment: newValue as string || undefined
          }));
          toast.success("Bonus clause comment updated");
          return true;
        },
      }
    ],
    [actions, currency, dispatch]
  );

  const penaltyColumns = useMemo<Array<ColumnDef<PenaltyClause>>>(
    () => [
      {
        field: "condition",
        title: "Condition",
        editable: true,
        align: "left" as ColumnAlignment,
        onSave: (newValue, context) => {
          dispatch(actions.updatePenaltyClause({ 
            id: context.row.id, 
            condition: newValue as string 
          }));
          toast.success("Penalty clause condition updated");
          return true;
        },
      },
      {
        field: "deductionAmount",
        title: `Deduction Amount (${currency})`,
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
          dispatch(actions.updatePenaltyClause({ 
            id: context.row.id, 
            deductionAmount: { value: amount, unit: currency }
          }));
          toast.success("Deduction amount updated");
          return true;
        },
      },
      {
        field: "comment",
        title: "Comment",
        editable: true,
        align: "left" as ColumnAlignment,
        renderCell: (value: string | null) => value || "-",
        onSave: (newValue, context) => {
          dispatch(actions.updatePenaltyClause({ 
            id: context.row.id, 
            comment: newValue as string || undefined
          }));
          toast.success("Penalty clause comment updated");
          return true;
        },
      }
    ],
    [actions, currency, dispatch]
  );

  const handleAddClause = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClause.condition.trim()) {
      toast.error('Condition is required');
      return;
    }
    if (!newClause.amount || isNaN(parseFloat(newClause.amount))) {
      toast.error('Valid amount is required');
      return;
    }

    if (activeSubTab === "bonus") {
      dispatch(actions.addBonusClause({
        id: generateId(),
        condition: newClause.condition,
        bonusAmount: {
          value: parseFloat(newClause.amount),
          unit: currency
        },
        comment: newClause.comment || undefined
      }));
      toast.success("Bonus clause added successfully");
    } else {
      dispatch(actions.addPenaltyClause({
        id: generateId(),
        condition: newClause.condition,
        deductionAmount: {
          value: parseFloat(newClause.amount),
          unit: currency
        },
        comment: newClause.comment || undefined
      }));
      toast.success("Penalty clause added successfully");
    }

    setNewClause({
      condition: "",
      amount: "",
      comment: ""
    });
    setIsAddingNew(false);
  }, [newClause, activeSubTab, dispatch, actions, currency]);

  const currentClauses = activeSubTab === "bonus" ? bonusClauses : penaltyClauses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Bonus & Penalty Clauses</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {bonusClauses.length} bonus clause(s), {penaltyClauses.length} penalty clause(s)
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(!isAddingNew)}
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Add {activeSubTab === "bonus" ? "Bonus" : "Penalty"} Clause
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setActiveSubTab("bonus")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeSubTab === "bonus"
              ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-b-2 border-blue-700 dark:border-blue-300"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          Bonus Clauses ({bonusClauses.length})
        </button>
        <button
          onClick={() => setActiveSubTab("penalty")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeSubTab === "penalty"
              ? "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border-b-2 border-red-700 dark:border-red-300"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          Penalty Clauses ({penaltyClauses.length})
        </button>
      </div>

      {isAddingNew && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
          <h3 className="text-lg font-medium mb-4 dark:text-white">
            Add New {activeSubTab === "bonus" ? "Bonus" : "Penalty"} Clause
          </h3>
          <form onSubmit={handleAddClause} className="space-y-4">
            <TextInput
              label="Condition *"
              value={newClause.condition}
              onChange={(e) => setNewClause({...newClause, condition: e.target.value})}
              className="w-full"
              required
            />

            <TextInput
              label={`${activeSubTab === "bonus" ? "Bonus" : "Deduction"} Amount (${currency}) *`}
              type="number"
              value={newClause.amount}
              onChange={(e) => setNewClause({...newClause, amount: e.target.value})}
              className="w-full"
              placeholder="0.00"
              step="0.01"
              required
            />

            <Textarea
              label="Comment"
              value={newClause.comment}
              onChange={(e) => setNewClause({...newClause, comment: e.target.value})}
              className="w-full"
              rows={3}
              placeholder="Optional comment or additional details..."
            />

            <div className="flex gap-3">
              <Button type="submit">
                Add {activeSubTab === "bonus" ? "Bonus" : "Penalty"} Clause
              </Button>
              <Button 
                type="button" 
                onClick={() => {
                  setIsAddingNew(false);
                  setNewClause({
                    condition: "",
                    amount: "",
                    comment: ""
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {currentClauses.length > 0 ? (
        activeSubTab === "bonus" ? (
          <ObjectSetTable
            data={bonusClauses}
            columns={bonusColumns}
            onAdd={() => setIsAddingNew(true)}
            onDelete={(row) => {
              dispatch(actions.deleteBonusClause({ id: (row as any).id }));
              toast.success("Bonus clause deleted");
            }}
          />
        ) : (
          <ObjectSetTable
            data={penaltyClauses}
            columns={penaltyColumns}
            onAdd={() => setIsAddingNew(true)}
            onDelete={(row) => {
              dispatch(actions.deletePenaltyClause({ id: (row as any).id }));
              toast.success("Penalty clause deleted");
            }}
          />
        )
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Icon name="Checkmark" size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">
            No {activeSubTab} clauses defined yet
          </p>
          <p className="text-sm">
            Add your first {activeSubTab} clause to get started
          </p>
        </div>
      )}
    </div>
  );
}