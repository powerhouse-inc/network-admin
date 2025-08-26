export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Amount: {
    input: { unit?: string; value?: number };
    output: { unit?: string; value?: number };
  };
  Amount_Crypto: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Currency: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Fiat: {
    input: { unit: string; value: number };
    output: { unit: string; value: number };
  };
  Amount_Money: { input: number; output: number };
  Amount_Percentage: { input: number; output: number };
  Amount_Tokens: { input: number; output: number };
  Currency: { input: string; output: string };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  EmailAddress: { input: string; output: string };
  EthereumAddress: { input: string; output: string };
  OID: { input: string; output: string };
  OLabel: { input: string; output: string };
  PHID: { input: string; output: string };
  URL: { input: string; output: string };
  Upload: { input: File; output: File };
};

export type AddContextDocumentInput = {
  name: Scalars["String"]["input"];
  rfpId: Scalars["OID"]["input"];
  url: Scalars["URL"]["input"];
};

export type AddProposalInput = {
  budgetEstimate: Scalars["String"]["input"];
  id: Scalars["OID"]["input"];
  paymentTerms: PaymentTermInput | `${PaymentTermInput}`;
  proposalStatus: ProposalStatusInput | `${ProposalStatusInput}`;
  rfpId: Scalars["OID"]["input"];
  submittedby?: InputMaybe<Scalars["OID"]["input"]>;
  summary: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type AgentType = "AI" | "GROUP" | "HUMAN";

export type BudgetRange = {
  currency: Maybe<Scalars["String"]["output"]>;
  max: Maybe<Scalars["Float"]["output"]>;
  min: Maybe<Scalars["Float"]["output"]>;
};

export type BudgetRangeInput = {
  currency?: InputMaybe<Scalars["String"]["input"]>;
  max?: InputMaybe<Scalars["Float"]["input"]>;
  min?: InputMaybe<Scalars["Float"]["input"]>;
};

export type ChangeProposalStatusInput = {
  proposalId: Scalars["OID"]["input"];
  status: ProposalStatusInput | `${ProposalStatusInput}`;
};

export type ContextDocument = {
  name: Scalars["String"]["output"];
  url: Scalars["URL"]["output"];
};

export type EditRfpInput = {
  budgetRange?: InputMaybe<BudgetRangeInput>;
  deadline?: InputMaybe<Scalars["DateTime"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  eligibilityCriteria?: InputMaybe<Array<Scalars["String"]["input"]>>;
  evaluationCriteria?: InputMaybe<Array<Scalars["String"]["input"]>>;
  rfpId: Scalars["OID"]["input"];
  status: RfpStatusInput | `${RfpStatusInput}`;
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type PaymentTerm =
  | "ESCROW"
  | "MILESTONE_BASED_ADVANCE_PAYMENT"
  | "MILESTONE_BASED_FIXED_PRICE"
  | "RETAINER_BASED"
  | "VARIABLE_COST";

export type PaymentTermInput =
  | "ESCROW"
  | "MILESTONE_BASED_ADVANCE_PAYMENT"
  | "MILESTONE_BASED_FIXED_PRICE"
  | "RETAINER_BASED"
  | "VARIABLE_COST";

export type Proposal = {
  budgetEstimate: Scalars["String"]["output"];
  id: Scalars["OID"]["output"];
  paymentTerms: PaymentTerm | `${PaymentTerm}`;
  proposalStatus: ProposalStatus | `${ProposalStatus}`;
  submittedby: Maybe<Scalars["OID"]["output"]>;
  summary: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type ProposalStatus =
  | "APPROVED"
  | "CONDITIONALLY_APPROVED"
  | "NEEDS_REVISION"
  | "OPENED"
  | "REJECTED"
  | "REVISED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "WITHDRAWN";

export type ProposalStatusInput =
  | "APPROVED"
  | "CONDITIONALLY_APPROVED"
  | "NEEDS_REVISION"
  | "OPENED"
  | "REJECTED"
  | "REVISED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "WITHDRAWN";

export type RfpCommentatorType = "EXTERNAL" | "INTERNAL";

export type RfpStatus =
  | "AWARDED"
  | "CANCELED"
  | "CLOSED"
  | "DRAFT"
  | "NOT_AWARDED"
  | "OPEN_FOR_PROPOSALS"
  | "REQUEST_FOR_COMMMENTS";

export type RfpStatusInput =
  | "AWARDED"
  | "CANCELED"
  | "CLOSED"
  | "DRAFT"
  | "NOT_AWARDED"
  | "OPEN_FOR_PROPOSALS"
  | "REQUEST_FOR_COMMMENTS";

export type RemoveContextDocumentInput = {
  name: Scalars["String"]["input"];
  rfpId: Scalars["OID"]["input"];
};

export type RemoveProposalInput = {
  id: Scalars["OID"]["input"];
  rfpId: Scalars["OID"]["input"];
};

export type RequestForProposalsState = {
  budgetRange: BudgetRange;
  contextDocuments: Array<ContextDocument>;
  deadline: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  eligibilityCriteria: Array<Scalars["String"]["output"]>;
  evaluationCriteria: Array<Scalars["String"]["output"]>;
  id: Scalars["OID"]["output"];
  issuer: Scalars["ID"]["output"];
  proposals: Array<Proposal>;
  rfpCommenter: Array<RfpCommenter>;
  status: RfpStatus | `${RfpStatus}`;
  tags: Maybe<Array<Scalars["String"]["output"]>>;
  title: Scalars["String"]["output"];
};

export type RfpCommenter = {
  agentType: AgentType | `${AgentType}`;
  code: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  imageUrl: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  rfpCommentatorType: RfpCommentatorType | `${RfpCommentatorType}`;
};
