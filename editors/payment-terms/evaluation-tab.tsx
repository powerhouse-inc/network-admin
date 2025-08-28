import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";

import type { PaymentTermsState, EvaluationFrequency } from "../../document-models/payment-terms/gen/schema/types.js";

export interface EvaluationTabProps {
  state: PaymentTermsState;
  dispatch: (action: any) => void;
  actions: any;
}

export function EvaluationTab({ state, dispatch, actions }: EvaluationTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    evaluationFrequency: state.evaluation?.evaluationFrequency || "MONTHLY",
    evaluatorTeam: state.evaluation?.evaluatorTeam || "",
    criteria: state.evaluation?.criteria?.join("\n") || "",
    impactsPayout: state.evaluation?.impactsPayout || false,
    impactsReputation: state.evaluation?.impactsReputation || false,
    commentsVisibleToClient: state.evaluation?.commentsVisibleToClient || false
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(actions.setEvaluationTerms({
      evaluationFrequency: formData.evaluationFrequency,
      evaluatorTeam: formData.evaluatorTeam,
      criteria: formData.criteria.split("\n").filter(c => c.trim()),
      impactsPayout: formData.impactsPayout,
      impactsReputation: formData.impactsReputation,
      commentsVisibleToClient: formData.commentsVisibleToClient
    }));
    
    setIsEditing(false);
  }, [formData, dispatch, actions]);

  const handleCancel = useCallback(() => {
    setFormData({
      evaluationFrequency: state.evaluation?.evaluationFrequency || "MONTHLY",
      evaluatorTeam: state.evaluation?.evaluatorTeam || "",
      criteria: state.evaluation?.criteria?.join("\n") || "",
      impactsPayout: state.evaluation?.impactsPayout || false,
      impactsReputation: state.evaluation?.impactsReputation || false,
      commentsVisibleToClient: state.evaluation?.commentsVisibleToClient || false
    });
    setIsEditing(false);
  }, [state.evaluation]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Evaluation Terms</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {state.evaluation ? "Edit Terms" : "Configure Evaluation"}
          </button>
        </div>

        {state.evaluation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Frequency</label>
                <p className="text-lg">{state.evaluation.evaluationFrequency}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluator Team</label>
                <p className="text-lg">{state.evaluation.evaluatorTeam}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Criteria</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-1">
                  {state.evaluation.criteria.map((criterion, index) => (
                    <li key={index}>{criterion}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Impacts Payout</label>
                <p className="text-lg">{state.evaluation.impactsPayout ? "Yes" : "No"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Impacts Reputation</label>
                <p className="text-lg">{state.evaluation.impactsReputation ? "Yes" : "No"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments Visible to Client</label>
                <p className="text-lg">{state.evaluation.commentsVisibleToClient ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No evaluation terms configured yet.</p>
            <p className="text-sm">Click "Configure Evaluation" to get started.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Configure Evaluation Terms</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evaluation Frequency *
            </label>
            <select
              value={formData.evaluationFrequency}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({...formData, evaluationFrequency: e.target.value as EvaluationFrequency})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="PER_MILESTONE">Per Milestone</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evaluator Team *
            </label>
            <input
              type="text"
              value={formData.evaluatorTeam}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, evaluatorTeam: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Team or individual responsible for evaluation"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evaluation Criteria *
          </label>
          <textarea
            value={formData.criteria}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, criteria: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter each criterion on a separate line..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">Enter each evaluation criterion on a separate line.</p>
        </div>

        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700">Evaluation Impact Settings</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="impactsPayout"
              checked={formData.impactsPayout}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, impactsPayout: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="impactsPayout" className="text-sm font-medium text-gray-700">
              Evaluation results impact payout
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="impactsReputation"
              checked={formData.impactsReputation}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, impactsReputation: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="impactsReputation" className="text-sm font-medium text-gray-700">
              Evaluation results impact reputation
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="commentsVisibleToClient"
              checked={formData.commentsVisibleToClient}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, commentsVisibleToClient: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="commentsVisibleToClient" className="text-sm font-medium text-gray-700">
              Evaluation comments visible to client
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Terms
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