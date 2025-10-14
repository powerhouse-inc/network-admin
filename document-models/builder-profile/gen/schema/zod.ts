import { z } from "zod";
import type { BuilderProfileState, UpdateProfileInput } from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export function BuilderProfileStateSchema(): z.ZodObject<
  Properties<BuilderProfileState>
> {
  return z.object({
    __typename: z.literal("BuilderProfileState").optional(),
    description: z.string().nullable(),
    icon: z.string().url().nullable(),
    id: z.string().nullable(),
    name: z.string().nullable(),
    slug: z.string().nullable(),
  });
}

export function UpdateProfileInputSchema(): z.ZodObject<
  Properties<UpdateProfileInput>
> {
  return z.object({
    description: z.string().nullish(),
    icon: z.string().url().nullish(),
    id: z.string().nullish(),
    name: z.string().nullish(),
    slug: z.string().nullish(),
  });
}
