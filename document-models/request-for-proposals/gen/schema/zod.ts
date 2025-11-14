import { z } from "zod";
import type {
  AddContextDocumentInput,
  AddProposalInput,
  BudgetRange,
  BudgetRangeInput,
  ChangeProposalStatusInput,
  ContextDocument,
  EditRfpInput,
  RemoveContextDocumentInput,
  RemoveProposalInput,
  RequestForProposalsState,
  RfpCommenter,
  RfpProposal,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const RfpCommentatorTypeSchema = z.enum(["EXTERNAL", "INTERNAL"]);

export const RfpStatusSchema = z.enum([
  "AWARDED",
  "CANCELED",
  "CLOSED",
  "DRAFT",
  "NOT_AWARDED",
  "OPEN_FOR_PROPOSALS",
  "REQUEST_FOR_COMMMENTS",
]);

export const RfpStatusInputSchema = z.enum([
  "AWARDED",
  "CANCELED",
  "CLOSED",
  "DRAFT",
  "NOT_AWARDED",
  "OPEN_FOR_PROPOSALS",
  "REQUEST_FOR_COMMMENTS",
]);

export const RfpAgentTypeSchema = z.enum(["AI", "GROUP", "HUMAN"]);

export const RfpPaymentTermSchema = z.enum([
  "ESCROW",
  "MILESTONE_BASED_ADVANCE_PAYMENT",
  "MILESTONE_BASED_FIXED_PRICE",
  "RETAINER_BASED",
  "VARIABLE_COST",
]);

export const RfpPaymentTermInputSchema = z.enum([
  "ESCROW",
  "MILESTONE_BASED_ADVANCE_PAYMENT",
  "MILESTONE_BASED_FIXED_PRICE",
  "RETAINER_BASED",
  "VARIABLE_COST",
]);

export const RfpProposalStatusSchema = z.enum([
  "APPROVED",
  "CONDITIONALLY_APPROVED",
  "NEEDS_REVISION",
  "OPENED",
  "REJECTED",
  "REVISED",
  "SUBMITTED",
  "UNDER_REVIEW",
  "WITHDRAWN",
]);

export const RfpProposalStatusInputSchema = z.enum([
  "APPROVED",
  "CONDITIONALLY_APPROVED",
  "NEEDS_REVISION",
  "OPENED",
  "REJECTED",
  "REVISED",
  "SUBMITTED",
  "UNDER_REVIEW",
  "WITHDRAWN",
]);

export function AddContextDocumentInputSchema(): z.ZodObject<
  Properties<AddContextDocumentInput>
> {
  return z.object({
    name: z.string(),
    rfpId: z.string(),
    url: z.string().url(),
  });
}

export function AddProposalInputSchema(): z.ZodObject<
  Properties<AddProposalInput>
> {
  return z.object({
    budgetEstimate: z.string(),
    id: z.string(),
    paymentTerms: z.lazy(() => RfpPaymentTermInputSchema),
    proposalStatus: z.lazy(() => RfpProposalStatusInputSchema),
    rfpId: z.string(),
    submittedby: z.string().nullish(),
    summary: z.string(),
    title: z.string(),
  });
}

export function BudgetRangeSchema(): z.ZodObject<Properties<BudgetRange>> {
  return z.object({
    __typename: z.literal("BudgetRange").optional(),
    currency: z.string().nullable(),
    max: z.number().nullable(),
    min: z.number().nullable(),
  });
}

export function BudgetRangeInputSchema(): z.ZodObject<
  Properties<BudgetRangeInput>
> {
  return z.object({
    currency: z.string().nullish(),
    max: z.number().nullish(),
    min: z.number().nullish(),
  });
}

export function ChangeProposalStatusInputSchema(): z.ZodObject<
  Properties<ChangeProposalStatusInput>
> {
  return z.object({
    proposalId: z.string(),
    status: z.lazy(() => RfpProposalStatusInputSchema),
  });
}

export function ContextDocumentSchema(): z.ZodObject<
  Properties<ContextDocument>
> {
  return z.object({
    __typename: z.literal("ContextDocument").optional(),
    name: z.string(),
    url: z.string().url(),
  });
}

export function EditRfpInputSchema(): z.ZodObject<Properties<EditRfpInput>> {
  return z.object({
    briefing: z.string().nullish(),
    budgetRange: z.lazy(() => BudgetRangeInputSchema().nullish()),
    code: z.string().nullish(),
    deadline: z.string().datetime().nullish(),
    eligibilityCriteria: z.string().nullish(),
    evaluationCriteria: z.string().nullish(),
    status: z.lazy(() => RfpStatusInputSchema.nullish()),
    summary: z.string().nullish(),
    tags: z.array(z.string()).nullish(),
    title: z.string().nullish(),
  });
}

export function RemoveContextDocumentInputSchema(): z.ZodObject<
  Properties<RemoveContextDocumentInput>
> {
  return z.object({
    name: z.string(),
    rfpId: z.string(),
  });
}

export function RemoveProposalInputSchema(): z.ZodObject<
  Properties<RemoveProposalInput>
> {
  return z.object({
    id: z.string(),
    rfpId: z.string(),
  });
}

export function RequestForProposalsStateSchema(): z.ZodObject<
  Properties<RequestForProposalsState>
> {
  return z.object({
    __typename: z.literal("RequestForProposalsState").optional(),
    briefing: z.string(),
    budgetRange: BudgetRangeSchema(),
    code: z.string().nullable(),
    contextDocuments: z.array(ContextDocumentSchema()),
    deadline: z.string().datetime().nullable(),
    eligibilityCriteria: z.string(),
    evaluationCriteria: z.string(),
    issuer: z.string(),
    proposals: z.array(RfpProposalSchema()),
    rfpCommenter: z.array(RfpCommenterSchema()),
    status: RfpStatusSchema,
    summary: z.string(),
    tags: z.array(z.string()).nullable(),
    title: z.string(),
  });
}

export function RfpCommenterSchema(): z.ZodObject<Properties<RfpCommenter>> {
  return z.object({
    __typename: z.literal("RfpCommenter").optional(),
    agentType: RfpAgentTypeSchema,
    code: z.string(),
    id: z.string(),
    imageUrl: z.string().nullable(),
    name: z.string(),
    rfpCommentatorType: RfpCommentatorTypeSchema,
  });
}

export function RfpProposalSchema(): z.ZodObject<Properties<RfpProposal>> {
  return z.object({
    __typename: z.literal("RfpProposal").optional(),
    budgetEstimate: z.string(),
    id: z.string(),
    paymentTerms: RfpPaymentTermSchema,
    proposalStatus: RfpProposalStatusSchema,
    submittedby: z.string().nullable(),
    summary: z.string(),
    title: z.string(),
  });
}
