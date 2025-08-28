import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

interface Milestone {
  id: string;
  name: string;
  amount: { value?: number; unit?: string };
  expectedCompletionDate?: string | null;
  requiresApproval: boolean;
  payoutStatus: string;
}

export interface MilestonesTabProps {
  milestones: Milestone[];
  dispatch: (action: any) => void;
  actions: any;
  currency?: string;
}

export function MilestonesTab({ milestones, dispatch, actions, currency = "USD" }: MilestonesTabProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    id: "",
    name: "",
    amount: "",
    expectedCompletionDate: "",
    requiresApproval: true
  });
  const [editForm, setEditForm] = useState<{name?: string; amount?: string; expectedCompletionDate?: string; requiresApproval?: boolean}>({});

  const handleAddMilestone = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newMilestone.id.trim()) {
      alert('ID is required');
      return;
    }
    if (!newMilestone.name.trim()) {
      alert('Name is required');
      return;
    }
    if (!newMilestone.amount || isNaN(parseFloat(newMilestone.amount))) {
      alert('Valid amount is required');
      return;
    }
    
    const milestoneData: any = {
      id: newMilestone.id,
      name: newMilestone.name,
      amount: {
        value: parseFloat(newMilestone.amount),
        unit: currency
      },
      requiresApproval: newMilestone.requiresApproval
    };

    // Only include expectedCompletionDate if it has a value
    if (newMilestone.expectedCompletionDate) {
      // Convert date to ISO datetime string for validation
      milestoneData.expectedCompletionDate = new Date(newMilestone.expectedCompletionDate + 'T00:00:00.000Z').toISOString();
    }

    dispatch(actions.addMilestone(milestoneData));

    setNewMilestone({
      id: "",
      name: "",
      amount: "",
      expectedCompletionDate: "",
      requiresApproval: true
    });
    setIsAddingNew(false);
  }, [newMilestone, dispatch, actions]);

  const handleUpdateMilestone = useCallback((id: string) => {
    const updateData: any = { id };
    
    // Only include fields that have values
    if (editForm.name) {
      updateData.name = editForm.name;
    }
    
    if (editForm.amount) {
      updateData.amount = {
        value: parseFloat(editForm.amount),
        unit: currency
      };
    }
    
    if (editForm.expectedCompletionDate) {
      // Convert date to ISO datetime string for validation
      updateData.expectedCompletionDate = new Date(editForm.expectedCompletionDate + 'T00:00:00.000Z').toISOString();
    }
    
    if (editForm.requiresApproval !== undefined) {
      updateData.requiresApproval = editForm.requiresApproval;
    }

    dispatch(actions.updateMilestone(updateData));
    setEditingId(null);
    setEditForm({});
  }, [editForm, dispatch, actions, currency]);

  const handleStatusUpdate = useCallback((id: string, status: string) => {
    dispatch(actions.updateMilestoneStatus({
      id,
      payoutStatus: status
    }));
  }, [dispatch, actions]);

  const handleDeleteMilestone = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      dispatch(actions.deleteMilestone({ id }));
    }
  }, [dispatch, actions]);

  const startEditing = useCallback((milestone: Milestone) => {
    setEditingId(milestone.id);
    setEditForm({
      name: milestone.name,
      amount: milestone.amount?.value?.toString() || "",
      expectedCompletionDate: milestone.expectedCompletionDate || "",
      requiresApproval: milestone.requiresApproval
    });
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    const reorderedIds = milestones.map(m => m.id);
    [reorderedIds[index - 1], reorderedIds[index]] = [reorderedIds[index], reorderedIds[index - 1]];
    
    dispatch(actions.reorderMilestones({
      order: reorderedIds
    }));
  }, [milestones, dispatch, actions]);

  const handleMoveDown = useCallback((index: number) => {
    if (index === milestones.length - 1) return;
    const reorderedIds = milestones.map(m => m.id);
    [reorderedIds[index], reorderedIds[index + 1]] = [reorderedIds[index + 1], reorderedIds[index]];
    
    dispatch(actions.reorderMilestones({
      order: reorderedIds
    }));
  }, [milestones, dispatch, actions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-gray-100 text-gray-800";
      case "READY_FOR_REVIEW": return "bg-yellow-100 text-yellow-800";
      case "APPROVED": return "bg-blue-100 text-blue-800";
      case "PAID": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Milestone Schedule</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Milestone
        </button>
      </div>

      {/* Add New Milestone Form */}
      {isAddingNew && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-4">New Milestone</h3>
          <form onSubmit={handleAddMilestone} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
              <input
                type="text"
                value={newMilestone.id}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setNewMilestone({...newMilestone, id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="milestone-1, milestone-2, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={newMilestone.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setNewMilestone({...newMilestone, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input
                type="number"
                value={newMilestone.amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setNewMilestone({...newMilestone, amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion</label>
              <input
                type="date"
                value={newMilestone.expectedCompletionDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setNewMilestone({...newMilestone, expectedCompletionDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newMilestone.requiresApproval}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setNewMilestone({...newMilestone, requiresApproval: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Requires Approval</span>
              </label>
            </div>
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Milestone
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

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No milestones defined yet. Add your first milestone to get started.
          </div>
        ) : (
          milestones.map((milestone, index) => (
            <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-4">
              {editingId === milestone.id ? (
                // Edit Mode
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion</label>
                    <input
                      type="date"
                      value={editForm.expectedCompletionDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        setEditForm({...editForm, expectedCompletionDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.requiresApproval}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          setEditForm({...editForm, requiresApproval: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Requires Approval</span>
                    </label>
                  </div>
                  <div className="col-span-2 flex gap-3">
                    <button
                      onClick={() => handleUpdateMilestone(milestone.id)}
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
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{milestone.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.payoutStatus)}`}>
                          {milestone.payoutStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Amount: </span>
                          <span className="font-medium">{milestone.amount?.value} {milestone.amount?.unit}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Expected: </span>
                          <span className="font-medium">
                            {milestone.expectedCompletionDate || "Not set"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Approval: </span>
                          <span className="font-medium">
                            {milestone.requiresApproval ? "Required" : "Not required"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={milestone.payoutStatus}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          handleStatusUpdate(milestone.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="READY_FOR_REVIEW">Ready for Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PAID">Paid</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      {milestones.length > 1 && (
                        <>
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === milestones.length - 1}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            ↓
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => startEditing(milestone)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}