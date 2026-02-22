"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDealership, updateDealership } from "@/lib/actions/dealership";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type DealershipData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
} | null;

export default function DealershipForm({
  dealership,
}: {
  dealership: DealershipData;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      description: (form.get("description") as string) || "",
      logoUrl: (form.get("logoUrl") as string) || "",
      address: (form.get("address") as string) || "",
      phone: (form.get("phone") as string) || "",
      website: (form.get("website") as string) || "",
    };

    const result = dealership
      ? await updateDealership(data)
      : await createDealership(data);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dealership Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={dealership?.name ?? ""}
                placeholder="Amman Luxury Motors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                name="slug"
                required
                defaultValue={dealership?.slug ?? ""}
                placeholder="amman-luxury-motors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={dealership?.description ?? ""}
              placeholder="Tell buyers about your dealership..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={dealership?.logoUrl ?? ""}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={dealership?.phone ?? ""}
                placeholder="+962791234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={dealership?.website ?? ""}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={dealership?.address ?? ""}
              placeholder="Abdali Boulevard, Amman, Jordan"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading
              ? "Saving..."
              : dealership
                ? "Update Dealership"
                : "Create Dealership"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
