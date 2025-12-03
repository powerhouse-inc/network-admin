import { useState, useRef, useEffect } from "react";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";
import {
  ToastContainer,
  DocumentToolbar,
} from "@powerhousedao/design-system/connect";
import type { Action } from "document-model";
import {
  type PaymentTermsDocument,
  actions,
} from "../../document-models/payment-terms/index.js";
import { useSelectedPaymentTermsDocument } from "../../document-models/payment-terms/hooks.js";
import { HeaderSection } from "./components/header-section.js";
import { PartiesSection } from "./components/parties-section.js";
import { PaymentConfigSection } from "./components/payment-config-section.js";
import { MilestonesSection } from "./components/milestones-section.js";
import { TimeAndMaterialsSection } from "./components/time-materials-section.js";
import { EscrowSection } from "./components/escrow-section.js";
import { EvaluationSection } from "./components/evaluation-section.js";
import { ClausesSection } from "./components/clauses-section.js";

export default function Editor() {
  const [doc, dispatch] = useSelectedPaymentTermsDocument() as [
    PaymentTermsDocument,
    (actionOrActions: Action | Action[] | undefined) => void,
  ];

  const parentFolder = useParentFolderForSelectedNode();
  const [escrowExpanded, setEscrowExpanded] = useState(false);
  const [evaluationExpanded, setEvaluationExpanded] = useState(false);

  // Cache the last valid document to prevent loading flash when switching views
  const lastDocRef = useRef<PaymentTermsDocument | null>(null);
  useEffect(() => {
    if (doc) {
      lastDocRef.current = doc;
    }
  }, [doc]);

  const displayDoc = doc || lastDocRef.current;
  const displayState = displayDoc?.state.global;

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  if (!displayDoc || !displayState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-gray-500">
        <div className="w-8 h-8 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <p>Loading payment terms...</p>
      </div>
    );
  }

  // Calculate progress for milestone-based payments
  const totalMilestones = displayState.milestoneSchedule?.length || 0;
  const completedMilestones =
    displayState.milestoneSchedule?.filter((m) => m.payoutStatus === "PAID")
      .length || 0;
  const progressPercentage =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  // Calculate total milestone value and paid amount
  const totalMilestoneValue =
    displayState.milestoneSchedule?.reduce(
      (sum, m) => sum + (m.amount?.value || 0),
      0,
    ) || 0;
  const paidMilestoneValue =
    displayState.milestoneSchedule
      ?.filter((m) => m.payoutStatus === "PAID")
      .reduce((sum, m) => sum + (m.amount?.value || 0), 0) || 0;

  return (
    <>
      <DocumentToolbar document={displayDoc} onClose={handleClose} />
      <div className="min-h-screen bg-stone-50 font-sans text-slate-800">
        <div className="max-w-[1400px] mx-auto p-6">
          {/* Header with status and key metrics */}
          <HeaderSection
            state={displayState}
            dispatch={dispatch}
            actions={actions}
            progressPercentage={progressPercentage}
            completedMilestones={completedMilestones}
            totalMilestones={totalMilestones}
            totalValue={displayState.totalAmount?.value || totalMilestoneValue}
            paidValue={paidMilestoneValue}
          />

          {/* Configuration row - Parties, Payment Config, Escrow, Evaluation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 items-start">
            {/* Parties involved */}
            <PartiesSection
              state={displayState}
              dispatch={dispatch}
              actions={actions}
            />

            {/* Payment Configuration */}
            <PaymentConfigSection
              state={displayState}
              dispatch={dispatch}
              actions={actions}
            />

            {/* Escrow Configuration */}
            <EscrowSection
              state={displayState}
              dispatch={dispatch}
              actions={actions}
              isExpanded={escrowExpanded}
              onToggleExpand={() => setEscrowExpanded(!escrowExpanded)}
            />

            {/* Evaluation Terms */}
            <EvaluationSection
              state={displayState}
              dispatch={dispatch}
              actions={actions}
              isExpanded={evaluationExpanded}
              onToggleExpand={() => setEvaluationExpanded(!evaluationExpanded)}
            />
          </div>

          {/* Full width sections */}
          <div className="flex flex-col gap-5 mt-5">
            {/* Payment Model Specific Sections */}
            {displayState.paymentModel === "MILESTONE" && (
              <MilestonesSection
                milestones={displayState.milestoneSchedule}
                dispatch={dispatch}
                actions={actions}
                currency={displayState.currency}
              />
            )}

            {displayState.paymentModel === "TIME_AND_MATERIALS" && (
              <TimeAndMaterialsSection
                state={displayState}
                dispatch={dispatch}
                actions={actions}
              />
            )}

            {/* Bonus & Penalty Clauses */}
            <ClausesSection
              bonusClauses={displayState.bonusClauses}
              penaltyClauses={displayState.penaltyClauses}
              dispatch={dispatch}
              actions={actions}
              currency={displayState.currency}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
