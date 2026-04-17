"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/services/auth";
import { toggleLike } from "@/lib/services/likes";

export type ToggleLikeResult =
  | { status: "ok"; liked: boolean; likesCount: number }
  | { status: "unauthorized" };

export async function toggleLikeAction(
  presetId: string,
): Promise<ToggleLikeResult> {
  const user = await getCurrentUser();
  if (!user) return { status: "unauthorized" };
  const result = await toggleLike({ userId: user.id, presetId });
  revalidatePath("/feed");
  revalidatePath("/liked");
  return { status: "ok", ...result };
}
