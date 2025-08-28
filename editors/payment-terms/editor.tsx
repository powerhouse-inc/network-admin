import { useDocumentById } from "@powerhousedao/reactor-browser";
import { useState, useCallback } from "react";
import type { EditorProps } from "document-model";
import {
  type PaymentTermsDocument,
  actions,
} from "../../document-models/payment-terms/index.js";
import { BasicTermsTab } from "./basic-terms-tab.js";
import { MilestonesTab } from "./milestones-tab.js";
import { ClausesTab } from "./clauses-tab.js";
import { TimeMaterialsTab } from "./time-materials-tab.js";
import { EscrowTab } from "./escrow-tab.js";
import { EvaluationTab } from "./evaluation-tab.js";

export type IProps = EditorProps;

export default function Editor(props: IProps) {
  const { document: initialDocument } = props;
  const [document, dispatch] = useDocumentById(initialDocument.header.id);
  const typedDocument = document as PaymentTermsDocument;
  
  const globalState = typedDocument.state.global;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "SUBMITTED": return "bg-blue-100 text-blue-800";
      case "ACCEPTED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalMilestones = globalState.milestoneSchedule?.length || 0;
  const completedMilestones = globalState.milestoneSchedule?.filter(
    m => m.payoutStatus === "PAID"
  ).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Terms Document
              </h1>
              <p className="text-gray-600">
                Manage payment terms, milestones, and contract clauses
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full font-medium ${getStatusColor(globalState.status)}`}>
              {globalState.status}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Payment Model</p>
              <p className="text-lg font-semibold">{globalState.paymentModel}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Currency</p>
              <p className="text-lg font-semibold">{globalState.currency}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-lg font-semibold">
                {globalState.totalAmount ? `${globalState.totalAmount.value} ${globalState.totalAmount.unit}` : "Not set"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <p className="text-lg font-semibold">
                {globalState.paymentModel === "MILESTONE" ? `${completedMilestones} / ${totalMilestones}` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Terms Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Basic Terms</h2>
              <p className="text-sm text-gray-600 mt-1">Configure the basic payment terms and details</p>
            </div>
            <div className="p-6">
              <BasicTermsTab 
                state={globalState} 
                dispatch={dispatch}
                actions={actions}
              />
            </div>
          </div>

          {/* Payment Structure Section - Conditional based on payment model */}
          {globalState.paymentModel === "MILESTONE" && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Milestone Schedule</h2>
                <p className="text-sm text-gray-600 mt-1">Define project milestones and payment amounts</p>
              </div>
              <div className="p-6">
                <MilestonesTab 
                  milestones={globalState.milestoneSchedule}
                  dispatch={dispatch}
                  actions={actions}
                  currency={globalState.currency}
                />
              </div>
            </div>
          )}

          {globalState.paymentModel === "TIME_AND_MATERIALS" && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Time & Materials</h2>
                <p className="text-sm text-gray-600 mt-1">Configure hourly rates, billing frequency, and caps</p>
              </div>
              <div className="p-6">
                <TimeMaterialsTab 
                  state={globalState} 
                  dispatch={dispatch}
                  actions={actions}
                />
              </div>
            </div>
          )}

          {/* Escrow Section - Optional for MILESTONE and TIME_AND_MATERIALS */}
          {globalState.escrowDetails && globalState.escrowDetails.releaseConditions && (globalState.paymentModel === "MILESTONE" || globalState.paymentModel === "TIME_AND_MATERIALS") && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Escrow Details</h2>
                <p className="text-sm text-gray-600 mt-1">Configure escrow payment arrangements</p>
              </div>
              <div className="p-6">
                <EscrowTab 
                  state={globalState} 
                  dispatch={dispatch}
                  actions={actions}
                />
              </div>
            </div>
          )}

          {/* Clauses Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Bonus & Penalty Clauses</h2>
              <p className="text-sm text-gray-600 mt-1">Add performance-based bonus and penalty conditions</p>
            </div>
            <div className="p-6">
              <ClausesTab 
                bonusClauses={globalState.bonusClauses}
                penaltyClauses={globalState.penaltyClauses}
                dispatch={dispatch}
                actions={actions}
                currency={globalState.currency}
              />
            </div>
          </div>

          {/* Evaluation Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Evaluation Terms</h2>
              <p className="text-sm text-gray-600 mt-1">Define performance evaluation criteria and processes</p>
            </div>
            <div className="p-6">
              <EvaluationTab 
                state={globalState} 
                dispatch={dispatch}
                actions={actions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
