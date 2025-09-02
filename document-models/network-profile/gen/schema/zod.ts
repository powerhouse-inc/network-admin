import { z } from "zod";
import type {
  NetworkCategory,
  NetworkProfileState,
  SetCategoryInput,
  SetDescriptionInput,
  SetDiscordInput,
  SetGithubInput,
  SetIconInput,
  SetLogoBigInput,
  SetLogoInput,
  SetProfileNameInput,
  SetWebsiteInput,
  SetXInput,
  SetYoutubeInput,
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

export const NetworkCategorySchema = z.enum([
  "CHARITY",
  "CRYPTO",
  "DEFI",
  "NGO",
  "OSS",
]);

export function NetworkProfileStateSchema(): z.ZodObject<
  Properties<NetworkProfileState>
> {
  return z.object({
    __typename: z.literal("NetworkProfileState").optional(),
    category: z.array(NetworkCategorySchema),
    description: z.string(),
    discord: z.string().nullable(),
    github: z.string().nullable(),
    icon: z.string(),
    logo: z.string(),
    logoBig: z.string(),
    name: z.string(),
    website: z.string().nullable(),
    x: z.string().nullable(),
    youtube: z.string().nullable(),
  });
}

export function SetCategoryInputSchema(): z.ZodObject<
  Properties<SetCategoryInput>
> {
  return z.object({
    category: z.array(NetworkCategorySchema),
  });
}

export function SetDescriptionInputSchema(): z.ZodObject<
  Properties<SetDescriptionInput>
> {
  return z.object({
    description: z.string(),
  });
}

export function SetDiscordInputSchema(): z.ZodObject<
  Properties<SetDiscordInput>
> {
  return z.object({
    discord: z.string().nullish(),
  });
}

export function SetGithubInputSchema(): z.ZodObject<
  Properties<SetGithubInput>
> {
  return z.object({
    github: z.string().nullish(),
  });
}

export function SetIconInputSchema(): z.ZodObject<Properties<SetIconInput>> {
  return z.object({
    icon: z.string(),
  });
}

export function SetLogoBigInputSchema(): z.ZodObject<
  Properties<SetLogoBigInput>
> {
  return z.object({
    logoBig: z.string(),
  });
}

export function SetLogoInputSchema(): z.ZodObject<Properties<SetLogoInput>> {
  return z.object({
    logo: z.string(),
  });
}

export function SetProfileNameInputSchema(): z.ZodObject<
  Properties<SetProfileNameInput>
> {
  return z.object({
    name: z.string(),
  });
}

export function SetWebsiteInputSchema(): z.ZodObject<
  Properties<SetWebsiteInput>
> {
  return z.object({
    website: z.string().nullish(),
  });
}

export function SetXInputSchema(): z.ZodObject<Properties<SetXInput>> {
  return z.object({
    x: z.string().nullish(),
  });
}

export function SetYoutubeInputSchema(): z.ZodObject<
  Properties<SetYoutubeInput>
> {
  return z.object({
    youtube: z.string().nullish(),
  });
}
