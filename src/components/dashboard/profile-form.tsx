"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { updateProfile } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Profile settings.
 *
 * This form previously had no server action behind it: it showed "Saved!" on
 * a two-second timer and threw the input away.
 */
export default function ProfileForm({
  initialName,
  initialEmail,
  initialPhone,
}: {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("idle");
        setError(null);
        startTransition(async () => {
          try {
            const result = await updateProfile({ name, phone });
            if (!result.success) {
              setError(result.error);
              setStatus("error");
              return;
            }
            setStatus("saved");
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Could not save your changes"
            );
            setStatus("error");
          }
        });
      }}
      className="space-y-5 rounded-card border border-line bg-surface p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={initialEmail}
          disabled
          className="bg-surface-2"
        />
        <p className="text-caption text-ink-3">Email cannot be changed.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0791234567"
        />
        <p className="text-caption text-ink-3">
          Buyers reach you on this number when a listing has no dealership
          WhatsApp set.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-body-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        <span aria-live="polite" className="text-body-sm text-trust">
          {status === "saved" && !isPending ? "Saved" : ""}
        </span>
      </div>
    </form>
  );
}
