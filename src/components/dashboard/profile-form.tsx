"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="bg-surface border-line">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-ink-2">Email</Label>
            <Input
              id="email"
              type="email"
              value={initialEmail}
              disabled
              className="bg-surface-2 border-line-control text-ink-3 cursor-not-allowed"
            />
            <p className="text-xs text-ink-3">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-ink-2">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="bg-surface-2 border-line-control text-ink placeholder:text-ink-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-ink-2">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+962791234567"
              className="bg-surface-2 border-line-control text-ink placeholder:text-ink-3"
            />
          </div>

          <Button type="submit" className="bg-brand text-brand-ink hover:bg-brand-hover">
            <Save className="mr-2 h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
