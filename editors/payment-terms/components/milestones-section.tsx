import { useMemo } from "react";
import {
  Milestone as MilestoneIcon,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDollarSign,
  XCircle,
} from "lucide-react";
import {
  ObjectSetTable,
  type ColumnDef,
  type ColumnAlignment,
  DatePicker,
  Checkbox,
  Select,
} from "@powerhousedao/document-engineering";
import { toast } from "@powerhousedao/design-system/connect";
import { generateId } from "document-model/core";
import type {
  Milestone,
  MilestonePayoutStatus,
  PaymentTermsAction,
} from "../../../document-models/payment-terms/gen/types.js";
import { type actions as paymentTermsActions } from "../../../document-models/payment-terms/index.js";

interface MilestonesSectionProps {
  milestones: Milestone[];
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
  currency: string;
}

const STATUS_CONFIG: Record<
  MilestonePayoutStatus,
  { label: string; icon: typeof Clock; tagClass: string; dotClass: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    tagClass: "bg-stone-100 text-slate-500",
    dotClass: "bg-slate-400",
  },
  READY_FOR_REVIEW: {
    label: "Ready for Review",
    icon: AlertCircle,
    tagClass: "bg-amber-100 text-amber-600",
    dotClass: "bg-amber-500",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    tagClass: "bg-blue-100 text-blue-600",
    dotClass: "bg-blue-500",
  },
  PAID: {
    label: "Paid",
    icon: CircleDollarSign,
    tagClass: "bg-emerald-100 text-emerald-600",
    dotClass: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    tagClass: "bg-rose-100 text-rose-600",
    dotClass: "bg-rose-500",
  },
};

export function MilestonesSection({
  milestones,
  dispatch,
  actions,
  currency,
}: MilestonesSectionProps) {
  const columns = useMemo<Array<ColumnDef<Milestone>>>(
    () => [
      {
        field: "name",
        title: "Milestone",
        type: "string",
        editable: true,
        align: "left" as ColumnAlignment,
        width: 280,
        onSave: (newValue, context) => {
          if (newValue !== context.row.name && newValue) {
            dispatch(
              actions.updateMilestone({
                id: context.row.id,
                name: newValue as string,
              }),
            );
            return true;
          }
          return false;
        },
        renderCell: (value: string, context) => {
          // Use value from row data, fallback to context.row.name for empty rows
          const displayValue = value || context.row.name || "";
          if (!displayValue) {
            return (
              <span className="text-slate-400 italic">
                + Double-click to add milestone
              </span>
            );
          }
          return <span className="font-medium">{displayValue}</span>;
        },
      },
      {
        field: "amount",
        title: `Amount (${currency})`,
        type: "number",
        editable: true,
        align: "right" as ColumnAlignment,
        width: 120,
        renderCell: (value: Milestone["amount"], context) => {
          // Hide for empty/new rows
          if (!context.row.name) {
            return null;
          }
          const numValue = context.row.amount?.value;
          if (numValue === undefined || numValue === null) {
            return <span className="text-slate-400">—</span>;
          }
          return (
            <span className="font-mono text-sm text-slate-700">
              <span>{numValue.toLocaleString()}</span>
            </span>
          );
        },
        renderCellEditor: (value, onChange, context) => {
          // Extract numeric value from Amount object
          const amountValue = context.row.amount?.value;
          return (
            <input
              className="w-full bg-white border border-gray-300 rounded-md p-2"
              name={`amount-${context.row.id}`}
              defaultValue={amountValue}
              step="0.01"
              type="number"
              onBlur={(e) => {
                if (
                  e.target.value !== undefined &&
                  e.target.value !== String(context.row.amount?.value)
                ) {
                  dispatch(
                    actions.updateMilestone({
                      id: context.row.id,
                      amount: {
                        value: parseFloat(e.target.value),
                        unit: currency,
                      },
                    }),
                  );
                  toast("Amount updated", { type: "success" });
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
        field: "expectedCompletionDate",
        title: "Due Date",
        type: "date",
        editable: true,
        align: "center" as ColumnAlignment,
        width: 160,
        className: "bg-white ",
        style: {
          backgroundColor: "white",
        },
        renderCell: (value: Milestone["expectedCompletionDate"]) => {
          if (!value) {
            return (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-slate-400"></span>
              </div>
            );
          }
          try {
            // Extract date parts using UTC methods to avoid timezone conversion
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              return (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-slate-400">—</span>
                </div>
              );
            }
            const year = date.getUTCFullYear();
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            const month = monthNames[date.getUTCMonth()];
            const day = date.getUTCDate();
            return (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-slate-500">{`${day} ${month} ${year}`}</span>
              </div>
            );
          } catch {
            return (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-slate-400">—</span>
              </div>
            );
          }
        },
        renderCellEditor: (value, onChange, context) => {
          const dateValue = value
            ? typeof value === "string"
              ? new Date(value)
              : value
            : undefined;
          return (
            <DatePicker
              className="bg-white min-w-[160px]"
              name={`date-${context.row.id}`}
              value={dateValue instanceof Date ? dateValue : undefined}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                dispatch(
                  actions.updateMilestone({
                    id: context.row.id,
                    expectedCompletionDate: date?.toISOString() || null,
                  }),
                );
              }}
            />
          );
        },
        onSave: (newValue, context) => {
          return true;
        },
      },
      {
        field: "requiresApproval",
        title: "Approval",
        type: "boolean",
        editable: true,
        align: "center" as ColumnAlignment,
        width: 90,
        onSave: (newValue, context) => {
          return true;
        },
        renderCell: (value: Milestone["requiresApproval"], context) => {
          // Use context.row to get the latest state value
          const requiresApproval = context.row.requiresApproval;
          if (requiresApproval === undefined || requiresApproval === null) {
            return (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-slate-400"></span>
              </div>
            );
          }
          return (
            <div className="flex items-center justify-center w-full h-full">
              {requiresApproval === true ? (
                <span className="text-emerald-600 font-medium">Yes</span>
              ) : (
                <span className="text-slate-400">No</span>
              )}
            </div>
          );
        },
        renderCellEditor: (value, onChange, context) => {
          const currentValue = context.row.requiresApproval ?? false;
          return (
            <Checkbox
              className="bg-white"
              name={`requiresApproval-${context.row.id}`}
              value={currentValue}
              onChange={(checked: boolean) => {
                dispatch(
                  actions.updateMilestone({
                    id: context.row.id,
                    requiresApproval: checked,
                  }),
                );
                toast("Approval requirement updated", { type: "success" });
              }}
            />
          );
        },
      },
      {
        field: "payoutStatus",
        title: "Status",
        type: "enum",
        getCellValue: (row: Milestone) => row.payoutStatus,
        editable: true,
        align: "center" as ColumnAlignment,
        width: 140,
        onSave: (newValue, context) => {
          return true;
        },
        renderCell: (value: Milestone["payoutStatus"], context) => {
          const status = {
            APPROVED: "Approved",
            PAID: "Paid",
            PENDING: "Pending",
            READY_FOR_REVIEW: "Ready for Review",
            REJECTED: "Rejected",
          };
          return (
            <div className="flex items-center justify-center w-full h-full text-center">
              <span className="text-slate-500">{status[value]}</span>
            </div>
          );
        },
        renderCellEditor: (value, onChange, context) => {
          return (
            <Select
              className="bg-white min-w-[160px]"
              name={`payoutStatus-${context.row.id}`}
              value={value as string}
              options={[
                { value: "APPROVED", label: "Approved" },
                { value: "PAID", label: "Paid" },
                { value: "PENDING", label: "Pending" },
                { value: "READY_FOR_REVIEW", label: "Ready for Review" },
                { value: "REJECTED", label: "Rejected" },
              ]}
              onChange={(e) => {
                dispatch(
                  actions.updateMilestoneStatus({
                    id: context.row.id,
                    payoutStatus: e as MilestonePayoutStatus,
                  }),
                );
              }}
            />
          );
        },
      },
    ],
    [actions, currency, dispatch],
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-stone-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100">
            <MilestoneIcon size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800">
              Milestones
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              {milestones.length} milestone{milestones.length !== 1 ? "s" : ""}{" "}
              defined
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {milestones.length > 0 ? (
          <ObjectSetTable
            data={milestones}
            columns={columns}
            onAdd={(data) => {
              const name = (data.name as string) || "";
              if (name.trim()) {
                const milestoneData: Milestone = {
                  id: generateId(),
                  name: name.trim(),
                  amount: { value: 0, unit: currency },
                  requiresApproval: true,
                  expectedCompletionDate: null,
                  payoutStatus: "PENDING",
                };
                dispatch(actions.addMilestone(milestoneData));
                toast("Milestone added", { type: "success" });
              }
            }}
            onDelete={(rows: Milestone[]) => {
              if (rows.length > 0) {
                rows.forEach((row) => {
                  dispatch(actions.deleteMilestone({ id: row.id }));
                });
                toast(
                  `${rows.length} milestone${rows.length > 1 ? "s" : ""} deleted`,
                  { type: "success" },
                );
              }
            }}
            allowRowSelection
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-200 rounded-lg bg-stone-50">
            <MilestoneIcon size={48} className="text-slate-400 mb-4" />
            <p className="text-[15px] font-semibold text-slate-800 mb-1">
              No milestones yet
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Add milestones to define your payment schedule
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-slate-800 border-none rounded-md cursor-pointer transition-colors hover:bg-slate-700"
              onClick={() => {
                const milestoneData: Milestone = {
                  id: generateId(),
                  name: "New Milestone",
                  amount: { value: 0, unit: currency },
                  requiresApproval: true,
                  expectedCompletionDate: null,
                  payoutStatus: "PENDING",
                };
                dispatch(actions.addMilestone(milestoneData));
                toast("Milestone added", { type: "success" });
              }}
            >
              <Plus size={16} />
              Add First Milestone
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
