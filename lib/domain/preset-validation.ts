import { isValidPreset } from "shadcn/preset";
import { z } from "zod";

export function isValidCode(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return isValidPreset(code);
}

export const submitPresetSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Preset code is required")
    .refine(isValidCode, "Invalid preset code"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be 200 characters or less")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
});

export type SubmitPresetInput = z.infer<typeof submitPresetSchema>;
