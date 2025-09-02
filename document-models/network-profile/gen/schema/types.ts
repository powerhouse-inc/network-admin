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

export type NetworkCategory = "CHARITY" | "CRYPTO" | "DEFI" | "NGO" | "OSS";

export type NetworkProfileState = {
  category: Array<NetworkCategory | `${NetworkCategory}`>;
  description: Scalars["String"]["output"];
  discord: Maybe<Scalars["String"]["output"]>;
  github: Maybe<Scalars["String"]["output"]>;
  icon: Scalars["String"]["output"];
  logo: Scalars["String"]["output"];
  logoBig: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  website: Maybe<Scalars["String"]["output"]>;
  x: Maybe<Scalars["String"]["output"]>;
  youtube: Maybe<Scalars["String"]["output"]>;
};

export type SetCategoryInput = {
  category: Array<NetworkCategory | `${NetworkCategory}`>;
};

export type SetDescriptionInput = {
  description: Scalars["String"]["input"];
};

export type SetDiscordInput = {
  discord?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetGithubInput = {
  github?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetIconInput = {
  icon: Scalars["String"]["input"];
};

export type SetLogoBigInput = {
  logoBig: Scalars["String"]["input"];
};

export type SetLogoInput = {
  logo: Scalars["String"]["input"];
};

export type SetProfileNameInput = {
  name: Scalars["String"]["input"];
};

export type SetWebsiteInput = {
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetXInput = {
  x?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetYoutubeInput = {
  youtube?: InputMaybe<Scalars["String"]["input"]>;
};
