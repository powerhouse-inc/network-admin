import { useState, useRef, useEffect } from "react";
import {
  FileText,
  ChevronDown,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  DollarSign,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "@powerhousedao/design-system/connect";
import type {
  PaymentTermsState,
  PaymentTermsStatus,
} from "../../../document-models/payment-terms/gen/types.js";
import type { PaymentTermsAction } from "../../../document-models/payment-terms/gen/actions.js";
import { type actions as paymentTermsActions } from "../../../document-models/payment-terms/index.js";

interface HeaderSectionProps {
  state: PaymentTermsState;
  dispatch: (action: PaymentTermsAction) => void;
  actions: typeof paymentTermsActions;
  progressPercentage: number;
  completedMilestones: number;
  totalMilestones: number;
  totalValue: number;
  paidValue: number;
}

const STATUS_CONFIG: Record<
  PaymentTermsStatus,
  {
    label: string;
    icon: typeof Clock;
    badgeClass: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    icon: Clock,
    badgeClass: "bg-slate-100 text-slate-600",
  },
  SUBMITTED: {
    label: "Submitted",
    icon: Send,
    badgeClass: "bg-blue-100 text-blue-600",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle,
    badgeClass: "bg-emerald-100 text-emerald-600",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    badgeClass: "bg-rose-100 text-rose-600",
  },
};

export function HeaderSection({
  state,
  dispatch,
  actions,
  progressPercentage,
  completedMilestones,
  totalMilestones,
  totalValue,
  paidValue,
}: HeaderSectionProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusConfig = STATUS_CONFIG[state.status];
  const StatusIcon = statusConfig.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = (newStatus: PaymentTermsStatus) => {
    if (newStatus !== state.status) {
      dispatch(actions.updateStatus({ status: newStatus }));
      toast(`Status updated to ${STATUS_CONFIG[newStatus].label}`, {
        type: "success",
      });
    }
    setIsStatusDropdownOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const remainingValue = totalValue - paidValue;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm relative">
      {/* Main Header */}
      <div className="flex items-start justify-between p-6 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Payment Terms
              </h1>
              <p className="text-sm text-slate-500">
                {state.paymentModel === "MILESTONE"
                  ? "Milestone-based payment schedule"
                  : "Time & Materials billing"}
                {" • "}
                {state.currency}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer border-none hover:-translate-y-0.5 hover:shadow-md ${statusConfig.badgeClass}`}
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              type="button"
            >
              <StatusIcon size={14} />
              {statusConfig.label}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {(
                  Object.entries(STATUS_CONFIG) as [
                    PaymentTermsStatus,
                    (typeof STATUS_CONFIG)[PaymentTermsStatus],
                  ][]
                ).map(([statusKey, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={statusKey}
                      type="button"
                      className={`flex items-center gap-2.5 px-4 py-3 text-sm text-slate-800 bg-transparent border-none w-full text-left cursor-pointer transition-colors hover:bg-stone-100 ${state.status === statusKey ? "bg-stone-50" : ""}`}
                      onClick={() => handleStatusChange(statusKey)}
                    >
                      <Icon size={16} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-px bg-gray-200 border-t border-gray-200">
        <div className="flex flex-col items-center justify-center p-4 bg-white text-center">
          <div className="text-xl font-bold text-slate-800">
            <DollarSign
              size={16}
              className="inline align-middle mr-0.5 opacity-50"
            />
            {formatCurrency(totalValue)}
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Total Value
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-white text-center">
          <div className="text-xl font-bold text-emerald-600">
            <Wallet size={16} className="inline align-middle mr-1 opacity-70" />
            {formatCurrency(paidValue)}
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Paid Out
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-white text-center">
          <div className="text-xl font-bold text-amber-600">
            <TrendingUp
              size={16}
              className="inline align-middle mr-1 opacity-70"
            />
            {formatCurrency(remainingValue)}
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Remaining
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-white text-center">
          <div className="text-xl font-bold text-slate-800">
            <Target size={16} className="inline align-middle mr-1 opacity-50" />
            {completedMilestones} / {totalMilestones}
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Milestones
          </div>
        </div>
      </div>

      {/* Progress Bar (only for milestone-based payments) */}
      {state.paymentModel === "MILESTONE" && totalMilestones > 0 && (
        <div className="p-4 px-6 bg-stone-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">
              Payment Progress
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
