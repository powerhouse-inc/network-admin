import { useState, useCallback } from "react";
import {
  ClipboardCheck,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Eye,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import { TextInput, Select } from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import type {
  PaymentTermsState,
  EvaluationFrequency,
} from "../../../document-models/payment-terms/gen/types.js";
import type { PaymentTermsAction } from "../../../document-models/payment-terms/gen/actions.js";
import { type actions as paymentTermsActions } from "../../../document-models/payment-terms/index.js";

interface EvaluationSectionProps {
  state: PaymentTermsState;
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "PER_MILESTONE", label: "Per Milestone" },
];

export function EvaluationSection({
  state,
  dispatch,
  actions,
  isExpanded,
  onToggleExpand,
}: EvaluationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    evaluationFrequency: state.evaluation?.evaluationFrequency || "MONTHLY",
    evaluatorTeam: state.evaluation?.evaluatorTeam || "",
    criteria: state.evaluation?.criteria || [],
    impactsPayout: state.evaluation?.impactsPayout ?? false,
    impactsReputation: state.evaluation?.impactsReputation ?? false,
    commentsVisibleToClient: state.evaluation?.commentsVisibleToClient ?? true,
  });
  const [newCriterion, setNewCriterion] = useState("");

  const hasEvaluation = !!state.evaluation;

  const handleAddCriterion = useCallback(() => {
    if (newCriterion.trim()) {
      setFormData({
        ...formData,
        criteria: [...formData.criteria, newCriterion.trim()],
      });
      setNewCriterion("");
    }
  }, [newCriterion, formData]);

  const handleRemoveCriterion = useCallback(
    (index: number) => {
      setFormData({
        ...formData,
        criteria: formData.criteria.filter((_, i) => i !== index),
      });
    },
    [formData],
  );

  const handleSave = useCallback(() => {
    if (!formData.evaluatorTeam.trim()) {
      toast("Evaluator team is required", { type: "error" });
      return;
    }

    if (formData.criteria.length === 0) {
      toast("At least one evaluation criterion is required", { type: "error" });
      return;
    }

    dispatch(
      actions.setEvaluationTerms({
        evaluationFrequency: formData.evaluationFrequency,
        evaluatorTeam: formData.evaluatorTeam,
        criteria: formData.criteria,
        impactsPayout: formData.impactsPayout,
        impactsReputation: formData.impactsReputation,
        commentsVisibleToClient: formData.commentsVisibleToClient,
      }),
    );

    toast("Evaluation terms saved", { type: "success" });
    setIsEditing(false);
  }, [formData, dispatch, actions]);

  const handleCancel = useCallback(() => {
    setFormData({
      evaluationFrequency: state.evaluation?.evaluationFrequency || "MONTHLY",
      evaluatorTeam: state.evaluation?.evaluatorTeam || "",
      criteria: state.evaluation?.criteria || [],
      impactsPayout: state.evaluation?.impactsPayout ?? false,
      impactsReputation: state.evaluation?.impactsReputation ?? false,
      commentsVisibleToClient:
        state.evaluation?.commentsVisibleToClient ?? true,
    });
    setNewCriterion("");
    setIsEditing(false);
  }, [state.evaluation]);

  const frequencyLabel =
    FREQUENCY_OPTIONS.find(
      (o) => o.value === state.evaluation?.evaluationFrequency,
    )?.label || "Monthly";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md self-start">
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-stone-50 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-lg ${hasEvaluation ? "bg-blue-100" : "bg-white"}`}
          >
            <ClipboardCheck
              size={18}
              className={hasEvaluation ? "text-blue-600" : "text-slate-500"}
            />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800">
              Evaluation
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              {hasEvaluation
                ? `${frequencyLabel} reviews`
                : "Performance tracking"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasEvaluation && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
              {state.evaluation?.criteria.length} criteria
            </span>
          )}
          {isExpanded ? (
            <ChevronUp size={20} className="text-slate-400" />
          ) : (
            <ChevronDown size={20} className="text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500">
                  <Calendar size={14} className="inline align-middle mr-1.5" />
                  Evaluation Frequency
                </label>
                <Select
                  value={formData.evaluationFrequency}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      evaluationFrequency: value as EvaluationFrequency,
                    })
                  }
                  options={FREQUENCY_OPTIONS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500 after:content-['_*'] after:text-rose-500">
                  <Users size={14} className="inline align-middle mr-1.5" />
                  Evaluator Team
                </label>
                <TextInput
                  value={formData.evaluatorTeam}
                  onChange={(e) =>
                    setFormData({ ...formData, evaluatorTeam: e.target.value })
                  }
                  placeholder="e.g., Product Team"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500 after:content-['_*'] after:text-rose-500">
                  Evaluation Criteria
                </label>
                <div className="flex gap-2 mb-3">
                  <TextInput
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    placeholder="Add a criterion..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCriterion();
                      }
                    }}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-9 h-9 text-slate-500 bg-stone-100 border border-gray-200 rounded-md cursor-pointer transition-colors hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddCriterion}
                    disabled={!newCriterion.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {formData.criteria.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {formData.criteria.map((criterion, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-md"
                      >
                        <span className="flex-1 text-sm">{criterion}</span>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-6 h-6 text-slate-400 bg-transparent border-none rounded cursor-pointer transition-colors hover:bg-rose-100 hover:text-rose-600"
                          onClick={() => handleRemoveCriterion(index)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-3">
                    No criteria added yet
                  </p>
                )}
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-500 mb-3">
                  Impact Settings
                </label>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="impactsPayout"
                      className="w-4.5 h-4.5 border-2 border-gray-200 rounded cursor-pointer accent-blue-600"
                      checked={formData.impactsPayout}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          impactsPayout: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="impactsPayout"
                      className="text-sm text-slate-800 cursor-pointer"
                    >
                      <TrendingUp
                        size={14}
                        className="inline align-middle mr-1.5"
                      />
                      Evaluations impact payout amounts
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="impactsReputation"
                      className="w-4.5 h-4.5 border-2 border-gray-200 rounded cursor-pointer accent-blue-600"
                      checked={formData.impactsReputation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          impactsReputation: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="impactsReputation"
                      className="text-sm text-slate-800 cursor-pointer"
                    >
                      <Star size={14} className="inline align-middle mr-1.5" />
                      Evaluations impact reputation score
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="commentsVisible"
                      className="w-4.5 h-4.5 border-2 border-gray-200 rounded cursor-pointer accent-blue-600"
                      checked={formData.commentsVisibleToClient}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commentsVisibleToClient: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="commentsVisible"
                      className="text-sm text-slate-800 cursor-pointer"
                    >
                      <Eye size={14} className="inline align-middle mr-1.5" />
                      Evaluation comments visible to client
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-white bg-slate-800 border-none rounded-md cursor-pointer transition-colors hover:bg-slate-700"
                  onClick={handleSave}
                >
                  <Check size={14} />
                  Save
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-500 bg-stone-100 border border-gray-200 rounded-md cursor-pointer transition-colors hover:bg-stone-200"
                  onClick={handleCancel}
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : hasEvaluation ? (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">
                    <Calendar
                      size={14}
                      className="inline align-middle mr-1.5"
                    />
                    Frequency
                  </label>
                  <p className="text-[15px] py-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                      {frequencyLabel}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">
                    <Users size={14} className="inline align-middle mr-1.5" />
                    Evaluator Team
                  </label>
                  <p className="text-[15px] py-2.5 text-slate-800">
                    {state.evaluation?.evaluatorTeam}
                  </p>
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">
                    Criteria
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {state.evaluation?.criteria.map((criterion, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-stone-100 text-slate-500"
                      >
                        {criterion}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-500">
                    Impact Settings
                  </label>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${state.evaluation?.impactsPayout ? "bg-amber-100 text-amber-600" : "bg-stone-100 text-slate-500"}`}
                    >
                      <TrendingUp size={12} />
                      Payout: {state.evaluation?.impactsPayout ? "Yes" : "No"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${state.evaluation?.impactsReputation ? "bg-amber-100 text-amber-600" : "bg-stone-100 text-slate-500"}`}
                    >
                      <Star size={12} />
                      Reputation:{" "}
                      {state.evaluation?.impactsReputation ? "Yes" : "No"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${state.evaluation?.commentsVisibleToClient ? "bg-blue-100 text-blue-600" : "bg-stone-100 text-slate-500"}`}
                    >
                      <Eye size={12} />
                      Comments:{" "}
                      {state.evaluation?.commentsVisibleToClient
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-500 bg-transparent border-none rounded-md cursor-pointer transition-colors hover:bg-stone-100 hover:text-slate-800"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={14} />
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-gray-200 rounded-lg bg-stone-50">
              <ClipboardCheck size={32} className="text-slate-400 mb-3" />
              <p className="text-[15px] font-semibold text-slate-800 mb-1">
                No evaluation terms
              </p>
              <p className="text-sm text-slate-400 mb-4">
                Set up performance evaluation criteria
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-slate-800 border-none rounded-md cursor-pointer transition-colors hover:bg-slate-700"
                onClick={() => setIsEditing(true)}
              >
                Configure Evaluation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
