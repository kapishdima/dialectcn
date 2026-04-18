"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  type SubmitResult,
  submitCommunityPreset,
} from "@/app/(actions)/submit";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initial: SubmitResult | null = null;

async function action(
  _prev: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  return await submitCommunityPreset(formData);
}

type Props = {
  onClose?: () => void;
};

export function SubmitForm({ onClose }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, initial);

  useEffect(() => {
    if (state?.status === "ok") {
      toast.success("Preset submitted");
      router.push(`/feed/${state.code}`);
      onClose?.();
    }
  }, [state, router, onClose]);

  const fieldErrors =
    state?.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field data-invalid={Boolean(fieldErrors.code?.length) || undefined}>
        <FieldLabel htmlFor="code">Preset code</FieldLabel>
        <Input
          id="code"
          name="code"
          placeholder="xxxxxxxxxxxxxxxxxx"
          autoComplete="off"
          required
        />
        {fieldErrors.code?.[0] ? (
          <FieldError>{fieldErrors.code[0]}</FieldError>
        ) : null}
      </Field>

      <Field data-invalid={Boolean(fieldErrors.name?.length) || undefined}>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          id="name"
          name="name"
          placeholder="Cobalt Horizon"
          maxLength={50}
          required
        />
        {fieldErrors.name?.[0] ? (
          <FieldError>{fieldErrors.name[0]}</FieldError>
        ) : null}
      </Field>

      <Field
        data-invalid={Boolean(fieldErrors.description?.length) || undefined}
      >
        <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
        <Input
          id="description"
          name="description"
          placeholder="A brief description"
          maxLength={200}
        />
        {fieldErrors.description?.[0] ? (
          <FieldError>{fieldErrors.description[0]}</FieldError>
        ) : null}
      </Field>

      {state?.status === "exists" ? (
        <p className="rounded-md border bg-muted/30 p-3 text-sm">
          This preset is already saved.{" "}
          <Link
            href={`/feed/${state.code}`}
            onClick={onClose}
            className="font-medium underline"
          >
            View it →
          </Link>
        </p>
      ) : null}

      {state?.status === "error" && !Object.keys(fieldErrors).length ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit preset"}
        </Button>
      </div>
    </form>
  );
}
