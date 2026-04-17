"use server";

import { revalidatePath } from "next/cache";
import { submitPresetSchema } from "@/lib/domain/preset-validation";
import { getCurrentUser } from "@/lib/services/auth";
import { createCommunityPreset } from "@/lib/services/presets";

export type SubmitResult =
  | { status: "ok"; code: string }
  | { status: "exists"; code: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function submitCommunityPreset(
  formData: FormData,
): Promise<SubmitResult> {
  const raw = {
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
  const parsed = submitPresetSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const user = await getCurrentUser();
  const result = await createCommunityPreset({
    code: parsed.data.code,
    name: parsed.data.name,
    description: parsed.data.description,
    userId: user?.id ?? null,
  });

  if (result.status === "exists") {
    return { status: "exists", code: result.preset.code };
  }
  revalidatePath("/feed");
  return { status: "ok", code: result.preset.code };
}
