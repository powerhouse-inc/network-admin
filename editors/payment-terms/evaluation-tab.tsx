import { useState, useCallback, useMemo } from "react";
import { TextInput, Select, Textarea } from "@powerhousedao/document-engineering";
import { Button, toast } from "@powerhousedao/design-system";
import type { 
  PaymentTermsState, 
  EvaluationFrequency 
} from "../../document-models/payment-terms/gen/schema/types.js";

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

  const evaluationFrequencyOptions = useMemo(() => [
    { label: "Weekly", value: "WEEKLY" },
    { label: "Monthly", value: "MONTHLY" },
    { label: "Per Milestone", value: "PER_MILESTONE" }
  ], []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.evaluatorTeam.trim()) {
      toast("Evaluator team is required", {
        type: "error",
      });
      return;
    }
    
    if (!formData.criteria.trim()) {
      toast("Evaluation criteria are required", {
        type: "error",
      });
      return;
    }
    
    dispatch(actions.setEvaluationTerms({
      evaluationFrequency: formData.evaluationFrequency,
      evaluatorTeam: formData.evaluatorTeam,
      criteria: formData.criteria.split("\n").filter(c => c.trim()),
      impactsPayout: formData.impactsPayout,
      impactsReputation: formData.impactsReputation,
      commentsVisibleToClient: formData.commentsVisibleToClient
    }));
    
    toast("Evaluation terms saved", {
      type: "success",
    });
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
          <h2 className="text-xl font-semibold dark:text-white">Evaluation Terms</h2>
          <Button
            onClick={() => setIsEditing(true)}
            color="light"
            size="small"
            className="cursor-pointer hover:bg-blue-600 hover:text-white"
          >
            {state.evaluation ? "Edit Terms" : "Configure Evaluation"}
          </Button>
        </div>

        {state.evaluation ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evaluation Frequency</label>
              <p className="text-lg dark:text-white">{state.evaluation.evaluationFrequency}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evaluator Team</label>
              <p className="text-lg dark:text-white">{state.evaluation.evaluatorTeam}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Impacts Payout</label>
              <p className="text-lg dark:text-white">{state.evaluation.impactsPayout ? "Yes" : "No"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Impacts Reputation</label>
              <p className="text-lg dark:text-white">{state.evaluation.impactsReputation ? "Yes" : "No"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comments Visible to Client</label>
              <p className="text-lg dark:text-white">{state.evaluation.commentsVisibleToClient ? "Yes" : "No"}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evaluation Criteria</label>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border dark:border-gray-600">
                <ul className="list-disc list-inside text-sm space-y-1">
                  {state.evaluation.criteria.map((criterion, index) => (
                    <li key={index}>{criterion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
        <h2 className="text-xl font-semibold dark:text-white">Configure Evaluation Terms</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Select
          label="Evaluation Frequency *"
          options={evaluationFrequencyOptions}
          value={formData.evaluationFrequency}
          onChange={(value) => setFormData({...formData, evaluationFrequency: value as EvaluationFrequency})}
        />

        <TextInput
          label="Evaluator Team *"
          value={formData.evaluatorTeam}
          onChange={(e) => setFormData({...formData, evaluatorTeam: e.target.value})}
          className="w-full"
          placeholder="e.g., Product Team"
          required
        />

        <div className="col-span-2">
          <Textarea
            label="Evaluation Criteria * (one per line)"
            value={formData.criteria}
            onChange={(e) => setFormData({...formData, criteria: e.target.value})}
            className="w-full"
            rows={6}
            placeholder="Enter each evaluation criterion on a separate line..."
            required
          />
        </div>

        <div className="col-span-2 space-y-4">
          <h3 className="text-lg font-medium dark:text-white">Impact Settings</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="impactsPayout"
              checked={formData.impactsPayout}
              onChange={(e) => setFormData({...formData, impactsPayout: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="impactsPayout" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Evaluation results impact payout
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="impactsReputation"
              checked={formData.impactsReputation}
              onChange={(e) => setFormData({...formData, impactsReputation: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="impactsReputation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Evaluation results impact reputation
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="commentsVisibleToClient"
              checked={formData.commentsVisibleToClient}
              onChange={(e) => setFormData({...formData, commentsVisibleToClient: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="commentsVisibleToClient" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Evaluation comments visible to client
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          color="light"
          size="small"
          className="cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Save Evaluation Terms
        </Button>
        <Button
          type="button"
          onClick={handleCancel}
          color="light"
          size="small"
          className="cursor-pointer hover:bg-gray-600 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}