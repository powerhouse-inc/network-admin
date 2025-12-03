import { useState, useMemo } from "react";
import { Scale, TrendingUp, TrendingDown, Plus } from "lucide-react";
import {
  ObjectSetTable,
  type ColumnDef,
  type ColumnAlignment,
} from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import { generateId } from "document-model/core";
import type {
  BonusClause,
  PenaltyClause,
  PaymentTermsAction,
} from "../../../document-models/payment-terms/gen/types.js";
import { type actions as paymentTermsActions } from "../../../document-models/payment-terms/index.js";

interface ClausesSectionProps {
  bonusClauses: BonusClause[];
  penaltyClauses: PenaltyClause[];
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
  currency: string;
}

type TabType = "bonus" | "penalty";

export function ClausesSection({
  bonusClauses,
  penaltyClauses,
  dispatch,
  actions,
  currency,
}: ClausesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("bonus");

  const bonusColumns = useMemo<Array<ColumnDef<BonusClause>>>(
    () => [
      {
        field: "condition",
        title: "Condition",
        type: "string",
        editable: true,
        align: "left" as ColumnAlignment,
        width: 350,
        onSave: (newValue, context) => {
          if (newValue && newValue !== context.row.condition) {
            dispatch(
              actions.updateBonusClause({
                id: context.row.id,
                condition: newValue as string,
              }),
            );
            toast("Condition updated", { type: "success" });
            return true;
          }
          return false;
        },
        renderCell: (value: string, context) => {
          // Use context.row to get the latest state value
          const condition = context.row.condition;
          if (!condition) {
            return (
              <span className="text-slate-400 italic">
                + Double-click to add bonus clause
              </span>
            );
          }
          return <span>{condition}</span>;
        },
      },
      {
        field: "bonusAmount",
        title: `Amount (${currency})`,
        type: "number",
        editable: true,
        align: "right" as ColumnAlignment,
        width: 120,
        renderCell: (value: BonusClause["bonusAmount"], context) => {
          // Hide for empty/new rows
          if (!context.row.condition) {
            return null;
          }
          // Use context.row to get the latest state value
          const numValue = context.row.bonusAmount?.value;
          if (numValue === undefined || numValue === null) {
            return <span className="text-slate-400">—</span>;
          }
          return (
            <span className="font-mono text-sm text-emerald-600">
              <span className="font-semibold">
                +{numValue.toLocaleString()}
              </span>
              <span className="text-emerald-500 ml-1">
                {context.row.bonusAmount?.unit || currency}
              </span>
            </span>
          );
        },
        renderCellEditor: (value, onChange, context) => {
          // Extract numeric value from Amount object
          const amountValue = context.row.bonusAmount?.value;
          return (
            <input
              className="w-full bg-white border border-gray-300 rounded-md p-2"
              name={`bonusAmount-${context.row.id}`}
              defaultValue={amountValue}
              step="0.01"
              type="number"
              onBlur={(e) => {
                if (
                  e.target.value !== undefined &&
                  e.target.value !== String(context.row.bonusAmount?.value)
                ) {
                  const amount = parseFloat(e.target.value);
                  if (!isNaN(amount)) {
                    dispatch(
                      actions.updateBonusClause({
                        id: context.row.id,
                        bonusAmount: {
                          value: amount,
                          unit: currency,
                        },
                      })
                    );
                    toast("Amount updated", { type: "success" });
                  }
                }
              }}
            />
          );
        },
        onSave: (newValue, context) => {
          return true;
        },
      },
      {
        field: "comment",
        title: "Comment",
        type: "string",
        editable: true,
        align: "left" as ColumnAlignment,
        width: 180,
        renderCell: (value: string | null, context) => {
          // Hide for empty/new rows
          if (!context.row.condition) {
            return null;
          }
          // Use context.row to get the latest state value
          const comment = context.row.comment;
          return comment || <span className="text-slate-400">—</span>;
        },
        onSave: (newValue, context) => {
          dispatch(
            actions.updateBonusClause({
              id: context.row.id,
              comment: (newValue as string) || undefined,
            }),
          );
          toast("Comment updated", { type: "success" });
          return true;
        },
      },
    ],
    [actions, currency, dispatch],
  );

  const penaltyColumns = useMemo<Array<ColumnDef<PenaltyClause>>>(
    () => [
      {
        field: "condition",
        title: "Condition",
        type: "string",
        editable: true,
        align: "left" as ColumnAlignment,
        width: 350,
        onSave: (newValue, context) => {
          if (newValue && newValue !== context.row.condition) {
            dispatch(
              actions.updatePenaltyClause({
                id: context.row.id,
                condition: newValue as string,
              }),
            );
            toast("Condition updated", { type: "success" });
            return true;
          }
          return false;
        },
        renderCell: (value: string, context) => {
          // Use context.row to get the latest state value
          const condition = context.row.condition;
          if (!condition) {
            return (
              <span className="text-slate-400 italic">
                + Double-click to add penalty clause
              </span>
            );
          }
          return <span>{condition}</span>;
        },
      },
      {
        field: "deductionAmount",
        title: `Deduction (${currency})`,
        type: "number",
        editable: true,
        align: "right" as ColumnAlignment,
        width: 120,
        renderCell: (value: PenaltyClause["deductionAmount"], context) => {
          // Hide for empty/new rows
          if (!context.row.condition) {
            return null;
          }
          // Use context.row to get the latest state value
          const numValue = context.row.deductionAmount?.value;
          if (numValue === undefined || numValue === null) {
            return <span className="text-slate-400">—</span>;
          }
          return (
            <span className="font-mono text-sm text-rose-600">
              <span className="font-semibold">
                -{numValue.toLocaleString()}
              </span>
              <span className="text-rose-500 ml-1">
                {context.row.deductionAmount?.unit || currency}
              </span>
            </span>
          );
        },
        renderCellEditor: (value, onChange, context) => {
          // Extract numeric value from Amount object
          const amountValue = context.row.deductionAmount?.value;
          return (
            <input
              className="w-full bg-white border border-gray-300 rounded-md p-2"
              name={`deductionAmount-${context.row.id}`}
              defaultValue={amountValue}
              step="0.01"
              type="number"
              onBlur={(e) => {
                if (
                  e.target.value !== undefined &&
                  e.target.value !== String(context.row.deductionAmount?.value)
                ) {
                  const amount = parseFloat(e.target.value);
                  if (!isNaN(amount)) {
                    dispatch(
                      actions.updatePenaltyClause({
                        id: context.row.id,
                        deductionAmount: {
                          value: amount,
                          unit: currency,
                        },
                      })
                    );
                    toast("Amount updated", { type: "success" });
                  }
                }
              }}
            />
          );
        },
        onSave: (newValue, context) => {
          return true;
        },
      },
      {
        field: "comment",
        title: "Comment",
        type: "string",
        editable: true,
        align: "left" as ColumnAlignment,
        width: 180,
        renderCell: (value: string | null, context) => {
          // Hide for empty/new rows
          if (!context.row.condition) {
            return null;
          }
          // Use context.row to get the latest state value
          const comment = context.row.comment;
          return comment || <span className="text-slate-400">—</span>;
        },
        onSave: (newValue, context) => {
          dispatch(
            actions.updatePenaltyClause({
              id: context.row.id,
              comment: (newValue as string) || undefined,
            }),
          );
          toast("Comment updated", { type: "success" });
          return true;
        },
      },
    ],
    [actions, currency, dispatch],
  );

  const currentClauses = activeTab === "bonus" ? bonusClauses : penaltyClauses;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-stone-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-slate-500">
            <Scale size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800">
              Bonus & Penalty Clauses
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              <span className="text-emerald-600">
                {bonusClauses.length} bonus
              </span>
              {" • "}
              <span className="text-rose-600">
                {penaltyClauses.length} penalty
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-4">
          <button
            type="button"
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "bonus"
                ? "text-emerald-600 border-emerald-600"
                : "text-slate-400 border-transparent hover:text-slate-800"
            }`}
            onClick={() => setActiveTab("bonus")}
          >
            <TrendingUp size={14} className="inline align-middle mr-1.5" />
            Bonus ({bonusClauses.length})
          </button>
          <button
            type="button"
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "penalty"
                ? "text-rose-600 border-rose-600"
                : "text-slate-400 border-transparent hover:text-slate-800"
            }`}
            onClick={() => setActiveTab("penalty")}
          >
            <TrendingDown size={14} className="inline align-middle mr-1.5" />
            Penalty ({penaltyClauses.length})
          </button>
        </div>

        {/* Clauses Table */}
        {currentClauses.length > 0 ? (
          activeTab === "bonus" ? (
            <ObjectSetTable
              data={bonusClauses}
              columns={bonusColumns}
              onAdd={(data) => {
                const condition = (data.condition as string) || "";
                if (condition.trim()) {
                  dispatch(
                    actions.addBonusClause({
                      id: generateId(),
                      condition: condition.trim(),
                      bonusAmount: { value: 0, unit: currency },
                      comment: undefined,
                    }),
                  );
                  toast("Bonus clause added", { type: "success" });
                }
              }}
              onDelete={(rows: BonusClause[]) => {
                if (rows.length > 0) {
                  rows.forEach((row) => {
                    dispatch(actions.deleteBonusClause({ id: row.id }));
                  });
                  toast(
                    `${rows.length} bonus clause${rows.length > 1 ? "s" : ""} deleted`,
                    { type: "success" },
                  );
                }
              }}
              allowRowSelection
            />
          ) : (
            <ObjectSetTable
              data={penaltyClauses}
              columns={penaltyColumns}
              onAdd={(data) => {
                const condition = (data.condition as string) || "";
                if (condition.trim()) {
                  dispatch(
                    actions.addPenaltyClause({
                      id: generateId(),
                      condition: condition.trim(),
                      deductionAmount: { value: 0, unit: currency },
                      comment: undefined,
                    }),
                  );
                  toast("Penalty clause added", { type: "success" });
                }
              }}
              onDelete={(rows: PenaltyClause[]) => {
                if (rows.length > 0) {
                  rows.forEach((row) => {
                    dispatch(actions.deletePenaltyClause({ id: row.id }));
                  });
                  toast(
                    `${rows.length} penalty clause${rows.length > 1 ? "s" : ""} deleted`,
                    { type: "success" },
                  );
                }
              }}
              allowRowSelection
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-200 rounded-lg bg-stone-50">
            {activeTab === "bonus" ? (
              <TrendingUp size={48} className="text-slate-400 mb-4" />
            ) : (
              <TrendingDown size={48} className="text-slate-400 mb-4" />
            )}
            <p className="text-[15px] font-semibold text-slate-800 mb-1">
              No {activeTab} clauses yet
            </p>
            <p className="text-sm text-slate-400 mb-4">
              {activeTab === "bonus"
                ? "Add bonus incentives for exceptional performance"
                : "Add penalty deductions for contract violations"}
            </p>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white border-none rounded-md cursor-pointer transition-colors ${
                activeTab === "bonus"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
              onClick={() => {
                if (activeTab === "bonus") {
                  dispatch(
                    actions.addBonusClause({
                      id: generateId(),
                      condition: "New bonus condition",
                      bonusAmount: { value: 0, unit: currency },
                      comment: undefined,
                    }),
                  );
                  toast("Bonus clause added", { type: "success" });
                } else {
                  dispatch(
                    actions.addPenaltyClause({
                      id: generateId(),
                      condition: "New penalty condition",
                      deductionAmount: { value: 0, unit: currency },
                      comment: undefined,
                    }),
                  );
                  toast("Penalty clause added", { type: "success" });
                }
              }}
            >
              <Plus size={16} />
              Add First {activeTab === "bonus" ? "Bonus" : "Penalty"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
