import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

interface Clause {
  id: string;
  condition: string;
  bonusAmount?: { value?: number; unit?: string };
  deductionAmount?: { value?: number; unit?: string };
  comment?: string | null;
}

export interface ClausesTabProps {
  bonusClauses: Clause[];
  penaltyClauses: Clause[];
  dispatch: (action: any) => void;
  actions: any;
  currency?: string;
}

export function ClausesTab({ bonusClauses, penaltyClauses, dispatch, actions, currency = "USD" }: ClausesTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"bonus" | "penalty">("bonus");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newClause, setNewClause] = useState({
    id: "",
    condition: "",
    amount: "",
    comment: ""
  });
  const [editForm, setEditForm] = useState<{condition?: string; amount?: string; comment?: string}>({});

  const handleAddClause = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeSubTab === "bonus") {
      dispatch(actions.addBonusClause({
        id: newClause.id,
        condition: newClause.condition,
        bonusAmount: {
          value: parseFloat(newClause.amount),
          unit: currency
        },
        comment: newClause.comment || undefined
      }));
    } else {
      dispatch(actions.addPenaltyClause({
        id: newClause.id,
        condition: newClause.condition,
        deductionAmount: {
          value: parseFloat(newClause.amount),
          unit: currency
        },
        comment: newClause.comment || undefined
      }));
    }

    setNewClause({ id: "", condition: "", amount: "", comment: "" });
    setIsAddingNew(false);
  }, [newClause, activeSubTab, dispatch, actions]);

  const handleUpdateClause = useCallback((id: string, type: "bonus" | "penalty") => {
    if (type === "bonus") {
      dispatch(actions.updateBonusClause({
        id,
        condition: editForm.condition || undefined,
        bonusAmount: editForm.amount ? {
          value: parseFloat(editForm.amount),
          unit: currency
        } : undefined,
        comment: editForm.comment || undefined
      }));
    } else {
      dispatch(actions.updatePenaltyClause({
        id,
        condition: editForm.condition || undefined,
        deductionAmount: editForm.amount ? {
          value: parseFloat(editForm.amount),
          unit: currency
        } : undefined,
        comment: editForm.comment || undefined
      }));
    }
    setEditingId(null);
    setEditForm({});
  }, [editForm, dispatch, actions]);

  const handleDeleteClause = useCallback((id: string, type: "bonus" | "penalty") => {
    if (confirm(`Are you sure you want to delete this ${type} clause?`)) {
      if (type === "bonus") {
        dispatch(actions.deleteBonusClause({ id }));
      } else {
        dispatch(actions.deletePenaltyClause({ id }));
      }
    }
  }, [dispatch, actions]);

  const startEditing = useCallback((clause: Clause) => {
    setEditingId(clause.id);
    setEditForm({
      condition: clause.condition,
      amount: (clause.bonusAmount?.value || clause.deductionAmount?.value || "").toString(),
      comment: clause.comment || ""
    });
  }, []);

  const renderClauseList = (clauses: Clause[], type: "bonus" | "penalty") => {
    if (clauses.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {type} clauses defined yet. Add your first clause to get started.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {clauses.map((clause) => (
          <div key={clause.id} className={`bg-white border rounded-lg p-4 ${
            type === "bonus" ? "border-green-200" : "border-red-200"
          }`}>
            {editingId === clause.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <textarea
                    value={editForm.condition}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                      setEditForm({...editForm, condition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {type === "bonus" ? "Bonus Amount" : "Deduction Amount"}
                    </label>
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setEditForm({...editForm, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <input
                      type="text"
                      value={editForm.comment}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setEditForm({...editForm, comment: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateClause(clause.id, type)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900 mb-2">{clause.condition}</p>
                    <div className="flex gap-4 text-sm">
                      <span className={`font-semibold ${
                        type === "bonus" ? "text-green-600" : "text-red-600"
                      }`}>
                        {type === "bonus" ? "Bonus: " : "Penalty: "}
                        {(clause.bonusAmount?.value || clause.deductionAmount?.value || 0)} USD
                      </span>
                      {clause.comment && (
                        <span className="text-gray-600">Note: {clause.comment}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(clause)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClause(clause.id, type)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Sub-tabs for Bonus/Penalty */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab("bonus")}
          className={`pb-2 px-1 font-medium transition-colors border-b-2 ${
            activeSubTab === "bonus"
              ? "text-green-600 border-green-600"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          Bonus Clauses ({bonusClauses.length})
        </button>
        <button
          onClick={() => setActiveSubTab("penalty")}
          className={`pb-2 px-1 font-medium transition-colors border-b-2 ${
            activeSubTab === "penalty"
              ? "text-red-600 border-red-600"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          Penalty Clauses ({penaltyClauses.length})
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {activeSubTab === "bonus" ? "Bonus Clauses" : "Penalty Clauses"}
        </h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className={`px-4 py-2 rounded-md transition-colors text-white ${
            activeSubTab === "bonus"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Add {activeSubTab === "bonus" ? "Bonus" : "Penalty"} Clause
        </button>
      </div>

      {/* Add New Clause Form */}
      {isAddingNew && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-4">
            New {activeSubTab === "bonus" ? "Bonus" : "Penalty"} Clause
          </h3>
          <form onSubmit={handleAddClause} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
              <input
                type="text"
                value={newClause.id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setNewClause({...newClause, id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="clause-1, bonus-1, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
              <textarea
                value={newClause.condition}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                  setNewClause({...newClause, condition: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeSubTab === "bonus" ? "Bonus Amount" : "Deduction Amount"} *
                </label>
                <input
                  type="number"
                  value={newClause.amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setNewClause({...newClause, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <input
                  type="text"
                  value={newClause.comment}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setNewClause({...newClause, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md transition-colors text-white ${
                  activeSubTab === "bonus"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Add Clause
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clauses List */}
      {activeSubTab === "bonus" 
        ? renderClauseList(bonusClauses, "bonus")
        : renderClauseList(penaltyClauses, "penalty")
      }
    </div>
  );
}