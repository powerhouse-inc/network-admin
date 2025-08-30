import { useSelectedDocument } from "@powerhousedao/reactor-browser";
import { Button, Icon, toast, ToastContainer } from "@powerhousedao/design-system";
import type { EditorProps } from "document-model";
import {
  type PaymentTermsDocument,
  actions,
} from "../../document-models/payment-terms/index.js";
import { BasicTermsTab } from "./basic-terms-tab.js";
import { MilestonesTab } from "./milestones-tab.js";
import { ClausesTab } from "./clauses-tab.js";
import { CostMaterialsTab } from "./cost-materials-tab.js";
import { RetainerTab } from "./retainer-tab.js";
import { EscrowTab } from "./escrow-tab.js";
import { EvaluationTab } from "./evaluation-tab.js";

export type IProps = EditorProps;

export default function Editor(props: any) {
  // Getting dispatch from props or selected document
  let dispatch: any;
  const { document } = props;
  if (props.dispatch) {
    dispatch = props.dispatch;
  } else {
    const selectedDocument = useSelectedDocument();
    dispatch = selectedDocument[1];
  }
  
  const state = document.state.global as any;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "SUBMITTED": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ACCEPTED": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "CANCELLED": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT": return "CalendarTime";
      case "SUBMITTED": return "ArrowUp";
      case "ACCEPTED": return "CheckCircle";
      case "CANCELLED": return "ArrowLeft";
      default: return "CalendarTime";
    }
  };

  const totalMilestones = state.milestoneSchedule?.length || 0;
  const completedMilestones = state.milestoneSchedule?.filter(
    (m: any) => m.payoutStatus === "PAID"
  ).length || 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Icon name="CalendarTime" size={32} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Terms Document
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage payment terms, milestones, and contract clauses
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium ${getStatusColor(state.status)}`}>
                <Icon name={getStatusIcon(state.status)} size={16} />
                {state.status}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="BarChart" size={16} className="text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Payment Model</p>
                </div>
                <p className="text-lg font-semibold dark:text-white">{state.paymentModel.replace(/_/g, ' ')}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="BarChart" size={16} className="text-green-600 dark:text-green-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Currency</p>
                </div>
                <p className="text-lg font-semibold dark:text-white">{state.currency}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="BarChart" size={16} className="text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Amount</p>
                </div>
                <p className="text-lg font-semibold dark:text-white">
                  {state.totalAmount ? `${state.totalAmount.value} ${state.totalAmount.unit}` : "Not set"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="BarChart" size={16} className="text-purple-600 dark:text-purple-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Progress</p>
                </div>
                <p className="text-lg font-semibold dark:text-white">
                  {state.paymentModel === "MILESTONE" ? `${completedMilestones} / ${totalMilestones}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Terms Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Icon name="CalendarTime" size={20} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Terms</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Configure the basic payment terms and details</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <BasicTermsTab 
                  state={state} 
                  dispatch={dispatch}
                  actions={actions}
                />
              </div>
            </div>

            {/* Payment Structure Section - Conditional based on payment model */}
            {state.paymentModel === "MILESTONE" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Icon name="BarChart" size={20} className="text-green-600 dark:text-green-400" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Milestone Schedule</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Define project milestones and payment amounts</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <MilestonesTab 
                    milestones={state.milestoneSchedule}
                    dispatch={dispatch}
                    actions={actions}
                    currency={state.currency}
                  />
                </div>
              </div>
            )}

            {state.paymentModel === "COST_AND_MATERIALS" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Icon name="BarChart" size={20} className="text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cost & Materials</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Configure hourly rates, billing frequency, and caps</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <CostMaterialsTab 
                    state={state} 
                    dispatch={dispatch}
                    actions={actions}
                  />
                </div>
              </div>
            )}

            {state.paymentModel === "RETAINER" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Icon name="BarChart" size={20} className="text-purple-600 dark:text-purple-400" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Retainer Details</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Configure retainer amount, frequency, and services</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <RetainerTab 
                    state={state} 
                    dispatch={dispatch}
                    actions={actions}
                  />
                </div>
              </div>
            )}

            {/* Escrow Section - Optional for all payment models */}
            {state.escrowDetails && state.escrowDetails.releaseConditions && (state.paymentModel === "MILESTONE" || state.paymentModel === "COST_AND_MATERIALS" || state.paymentModel === "RETAINER") && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Icon name="BarChart" size={20} className="text-orange-600 dark:text-orange-400" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Escrow Details</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Configure escrow payment arrangements</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <EscrowTab 
                    state={state} 
                    dispatch={dispatch}
                    actions={actions}
                  />
                </div>
              </div>
            )}

            {/* Clauses Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Icon name="BarChart" size={20} className="text-red-600 dark:text-red-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bonus & Penalty Clauses</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Add performance-based bonus and penalty conditions</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ClausesTab 
                  bonusClauses={state.bonusClauses}
                  penaltyClauses={state.penaltyClauses}
                  dispatch={dispatch}
                  actions={actions}
                  currency={state.currency}
                />
              </div>
            </div>

            {/* Evaluation Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Icon name="BarChart" size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Evaluation Terms</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Define performance evaluation criteria and processes</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <EvaluationTab 
                  state={state} 
                  dispatch={dispatch}
                  actions={actions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}